#!/usr/bin/env node
/**
 * Genera un snapshot local de los repositorios públicos del usuario.
 *
 * La sección de proyectos usa la API de GitHub en cada build. Este snapshot
 * es solo un respaldo para cuando la API no está disponible (por ejemplo, si
 * se agota el límite de 60 peticiones/hora sin token). No sustituye a la API:
 * si la API responde, sus datos siempre tienen prioridad.
 *
 * Uso:
 *   pnpm sync:projects
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const OUTPUT = resolve(ROOT, 'src/data/github-repos.json')

/** Campos de la respuesta de GitHub que realmente usa el portafolio. */
const FIELDS = [
  'name',
  'full_name',
  'description',
  'html_url',
  'homepage',
  'language',
  'stargazers_count',
  'forks_count',
  'topics',
  'pushed_at',
  'fork',
  'archived',
  'disabled',
]

/** Carga `.env` sin dependencias externas (solo variables sencillas). */
async function loadDotEnv() {
  let raw
  try {
    raw = await readFile(resolve(ROOT, '.env'), 'utf8')
  } catch {
    return
  }

  for (const line of raw.split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/)
    if (!match) continue

    const [, key, rawValue] = match
    if (process.env[key] !== undefined) continue

    process.env[key] = rawValue.replace(/^(['"])(.*)\1$/, '$2').trim()
  }
}

await loadDotEnv()

const user = process.env.GITHUB_USER?.trim() || 'cero800'
const token = process.env.GITHUB_TOKEN?.trim()
const url = `https://api.github.com/users/${user}/repos?per_page=100&type=owner&sort=pushed`

const headers = {
  Accept: 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2022-11-28',
  'User-Agent': 'cero800-portfolio-sync',
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
}

const response = await fetch(url, { headers })

if (!response.ok) {
  const remaining = response.headers.get('x-ratelimit-remaining')
  console.error(`GitHub respondió ${response.status} ${response.statusText}`)
  if (remaining !== null) console.error(`Peticiones restantes: ${remaining}`)
  if (!token) console.error('Sugerencia: define GITHUB_TOKEN en .env para subir el límite.')
  process.exit(1)
}

const data = await response.json()
if (!Array.isArray(data)) {
  console.error('Respuesta inesperada de GitHub: se esperaba un array de repos.')
  process.exit(1)
}

const repos = data.map((repo) => Object.fromEntries(FIELDS.map((field) => [field, repo[field] ?? null])))

const snapshot = {
  user,
  generatedAt: new Date().toISOString(),
  repos,
}

await mkdir(dirname(OUTPUT), { recursive: true })
await writeFile(OUTPUT, `${JSON.stringify(snapshot, null, 2)}\n`, 'utf8')

console.log(`Snapshot de ${repos.length} repos de ${user} escrito en src/data/github-repos.json`)
