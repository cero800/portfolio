import type { Locale, ProjectInfo } from '../i18n/types'
import {
  EXCLUDED_NAME_PATTERN,
  EXCLUDED_REPO_NAMES,
  FEATURED_LIMIT,
  GITHUB_USER,
  PROJECT_OVERRIDES,
} from '../config/projects'
import snapshotData from '../data/github-repos.json'

/**
 * Integración con la API pública de GitHub.
 *
 * Descubre automáticamente los repositorios del usuario, los puntúa por
 * relevancia y devuelve los más destacados ya transformados en `ProjectInfo`.
 * No hay una lista de repos hardcodeada: solo overrides opcionales de texto.
 *
 * Se ejecuta en el servidor durante el build (páginas prerenderizadas) o en
 * SSR, nunca en el cliente. Si la API falla, usa el snapshot local generado
 * con `pnpm sync:projects`; solo si tampoco existe, devuelve un array vacío.
 */

const metaEnv = import.meta.env as Record<string, unknown>
const envOf = (key: string): string | undefined => {
  const val = (process.env as Record<string, string | undefined>)[key] ?? metaEnv[key]
  return typeof val === 'string' && val.length > 0 ? val : undefined
}

const GITHUB_API = 'https://api.github.com'
const GITHUB_TOKEN = envOf('GITHUB_TOKEN')
const REQUEST_TIMEOUT_MS = 8000
const DAY_MS = 24 * 60 * 60 * 1000

/** Subconjunto de la respuesta de `/users/:user/repos`. */
interface GitHubRepo {
  name: string
  full_name: string
  description: string | null
  html_url: string
  homepage: string | null
  language: string | null
  stargazers_count: number
  forks_count: number
  topics?: string[]
  pushed_at: string | null
  fork: boolean
  archived: boolean
  disabled?: boolean
}

/** Snapshot local generado por `scripts/sync-projects.mjs`. */
interface RepoSnapshot {
  user: string
  generatedAt: string
  repos: GitHubRepo[]
}

const snapshot = snapshotData as unknown as RepoSnapshot

/**
 * Respaldo cuando la API no está disponible. Solo se acepta si corresponde al
 * mismo usuario configurado, para no mostrar repos de otra cuenta.
 */
function loadSnapshot(): GitHubRepo[] | null {
  if (!snapshot || snapshot.user !== GITHUB_USER || !Array.isArray(snapshot.repos)) return null
  const repos = snapshot.repos.filter((repo) => typeof repo?.name === 'string' && typeof repo?.full_name === 'string')
  return repos.length > 0 ? repos : null
}

const ACRONYMS = new Set([
  'api',
  'cli',
  'ui',
  'ux',
  'db',
  'css',
  'html',
  'js',
  'ts',
  'mmu',
  'pos',
  'sql',
  'orm',
  'jwt',
  'http',
  'rest',
  'crud',
  'ai',
  'ml',
])

/** Nombres "bonitos" para los topics más comunes. */
const TOPIC_LABELS: Record<string, string> = {
  javascript: 'JavaScript',
  typescript: 'TypeScript',
  react: 'React',
  astro: 'Astro',
  tailwindcss: 'Tailwind CSS',
  nodejs: 'Node.js',
  nextjs: 'Next.js',
  pnpm: 'pnpm',
  mysql: 'MySQL',
  postgresql: 'PostgreSQL',
  sqlite: 'SQLite',
  python: 'Python',
  rust: 'Rust',
  golang: 'Go',
  html: 'HTML',
  css: 'CSS',
  electron: 'Electron',
  tauri: 'Tauri',
  expo: 'Expo',
  vite: 'Vite',
  monorepo: 'Monorepo',
}

function prettifyTopic(topic: string): string {
  const key = topic.toLowerCase()
  if (TOPIC_LABELS[key]) return TOPIC_LABELS[key]
  if (ACRONYMS.has(key)) return key.toUpperCase()
  return key.charAt(0).toUpperCase() + key.slice(1)
}

function prettifyTopics(topics: string[]): string[] {
  return topics.map(prettifyTopic)
}

function githubHeaders(): HeadersInit {
  return {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': 'cero800-portfolio',
    ...(GITHUB_TOKEN ? { Authorization: `Bearer ${GITHUB_TOKEN}` } : {}),
  }
}

type ReposResult = { ok: true; repos: GitHubRepo[] } | { ok: false; reason: string; retryable: boolean }

async function requestRepos(): Promise<ReposResult> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)
  try {
    const res = await fetch(`${GITHUB_API}/users/${GITHUB_USER}/repos?per_page=100&type=owner&sort=pushed`, {
      headers: githubHeaders(),
      signal: controller.signal,
    })

    if (!res.ok) {
      const remaining = res.headers.get('x-ratelimit-remaining')
      const rateLimited = res.status === 403 || res.status === 429
      return {
        ok: false,
        reason: rateLimited
          ? `rate limit de GitHub (${remaining ?? '?'} peticiones restantes)`
          : `GitHub respondió HTTP ${res.status}`,
        // Un 401/403/404 no se arregla reintentando al instante.
        retryable: res.status >= 500,
      }
    }

    const data: unknown = await res.json()
    return Array.isArray(data)
      ? { ok: true, repos: data as GitHubRepo[] }
      : { ok: false, reason: 'respuesta inesperada de GitHub', retryable: false }
  } catch (error) {
    return {
      ok: false,
      reason:
        error instanceof Error && error.name === 'AbortError'
          ? `timeout tras ${REQUEST_TIMEOUT_MS} ms`
          : 'error de red',
      retryable: true,
    }
  } finally {
    clearTimeout(timer)
  }
}

/** Reintenta solo fallos transitorios (red, timeout, 5xx). */
async function fetchUserRepos(): Promise<{ repos: GitHubRepo[] | null; reason: string }> {
  let reason = 'error desconocido'

  for (let attempt = 0; attempt < 2; attempt += 1) {
    const result = await requestRepos()
    if (result.ok) return { repos: result.repos, reason: '' }

    reason = result.reason
    if (!result.retryable) break
  }

  return { repos: null, reason }
}

function isFeaturedCandidate(repo: GitHubRepo): boolean {
  if (repo.fork || repo.archived || repo.disabled) return false
  if (EXCLUDED_REPO_NAMES.has(repo.name.toLowerCase())) return false
  if (EXCLUDED_NAME_PATTERN.test(repo.name)) return false
  return true
}

function pushedTime(repo: GitHubRepo): number {
  return repo.pushed_at ? Date.parse(repo.pushed_at) || 0 : 0
}

/**
 * Score de relevancia. No existe un "sort by stars" en la API REST, así que
 * combinamos señales de popularidad, calidad del repo y actividad reciente.
 */
function scoreRepo(repo: GitHubRepo, now: number): number {
  const pushed = pushedTime(repo)
  const days = pushed ? (now - pushed) / DAY_MS : Number.POSITIVE_INFINITY
  const recency = days <= 90 ? 8 : days <= 180 ? 5 : days <= 365 ? 2 : 0
  const topics = repo.topics?.length ?? 0

  return (
    (repo.stargazers_count ?? 0) * 10 +
    (repo.forks_count ?? 0) * 5 +
    (repo.homepage?.trim() ? 4 : 0) +
    Math.min(topics, 5) +
    (repo.description?.trim() ? 2 : 0) +
    recency
  )
}

function prettifyName(name: string): string {
  return name
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .map((word) => {
      const lower = word.toLowerCase()
      if (ACRONYMS.has(lower)) return lower.toUpperCase()
      return lower.charAt(0).toUpperCase() + lower.slice(1)
    })
    .join(' ')
}

/** Fecha para la columna izquierda: `YYYY-MM-DD HH:mm`. */
function formatListDate(iso: string | null): string {
  if (!iso) return ''
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(
    date.getMinutes(),
  )}`
}

function toProject(repo: GitHubRepo, lang: Locale): ProjectInfo {
  const override = PROJECT_OVERRIDES[repo.full_name]
  const homepage = repo.homepage?.trim() || null
  const topics = Array.isArray(repo.topics) ? repo.topics : []
  const prettyTopics = prettifyTopics(topics)

  const stack = override?.stack ?? (prettyTopics.length > 0 ? prettyTopics : repo.language ? [repo.language] : [])
  const desc =
    override?.desc?.[lang]?.trim() || repo.description?.trim() || fallbackDescription(repo, prettyTopics, lang)

  return {
    name: `${repo.name}/`,
    perm: 'drwxr-xr-x',
    date: formatListDate(repo.pushed_at),
    title: override?.title ?? prettifyName(repo.name),
    desc,
    stack,
    demo: homepage ?? repo.html_url,
    code: repo.html_url,
    repo: repo.full_name,
    meta: {
      stars: repo.stargazers_count ?? 0,
      language: repo.language ?? null,
      updated: repo.pushed_at ?? '',
      topics: prettyTopics,
      homepage,
    },
  }
}

/** Descripción de relleno cuando el repo no tiene una en GitHub. */
function fallbackDescription(repo: GitHubRepo, topics: string[], lang: Locale): string {
  const language = repo.language ?? (lang === 'es' ? 'código' : 'code')
  if (topics.length > 0) {
    const list = topics.slice(0, 4).join(', ')
    return lang === 'es' ? `Proyecto de ${language} centrado en ${list}.` : `${language} project focused on ${list}.`
  }
  return lang === 'es' ? `Proyecto de ${language}.` : `${language} project.`
}

/** Cache a nivel de módulo: la lista de repos se comparte entre ES y EN. */
let reposCache: Promise<GitHubRepo[] | null> | null = null

/**
 * Devuelve los `FEATURED_LIMIT` repos más relevantes, ya listos para la UI.
 * Nunca lanza: si la API falla usa el snapshot local; si tampoco hay
 * snapshot, devuelve `[]`.
 */
export async function getFeaturedProjects(lang: Locale): Promise<ProjectInfo[]> {
  if (!reposCache) {
    reposCache = (async () => {
      const { repos, reason } = await fetchUserRepos()
      if (repos) return repos

      const snapshotRepos = loadSnapshot()
      if (snapshotRepos) {
        if (reason) console.warn(`[projects] Usando snapshot local de GitHub (${reason}).`)
        else console.warn('[projects] Usando snapshot local de GitHub.')
        return snapshotRepos
      }

      if (reason) console.warn(`[projects] No se pudieron cargar los repos de GitHub: ${reason}`)
      return null
    })()
  }

  const repos = await reposCache
  if (!repos) return []

  const now = Date.now()
  return repos
    .filter(isFeaturedCandidate)
    .sort((a, b) => scoreRepo(b, now) - scoreRepo(a, now) || pushedTime(b) - pushedTime(a))
    .slice(0, FEATURED_LIMIT)
    .map((repo) => toProject(repo, lang))
}
