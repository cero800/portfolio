import type { Locale } from '../i18n/types'

/** Usuario de GitHub del que se traen los repositorios. */
export const GITHUB_USER = 'cero800'

/** Cuántos proyectos se muestran en la sección. */
export const FEATURED_LIMIT = 6

/**
 * Nombres de repo que nunca deben aparecer (configuración, perfil, etc.).
 * Se comparan en minúsculas contra `repo.name`.
 */
export const EXCLUDED_REPO_NAMES = new Set(['.github', 'dotfiles', 'nixos-config'])

/** Patrón para descartar repos de configuración por nombre. */
export const EXCLUDED_NAME_PATTERN = /(^|[-_.])(dotfiles|nixos|hyprland|config)([-_.]|$)/i

/**
 * Overrides OPCIONALES. No hace falta listar todos los repos: la lista se
 * obtiene automáticamente de GitHub y el ranking decide cuáles se muestran.
 * Usa este mapa solo para traducir o mejorar textos concretos.
 *
 * La clave es el nombre completo del repo, p. ej. `cero800/Bloggie`.
 */
export interface ProjectOverride {
  /** Título sin el prefijo `#` (lo añade el componente). */
  title?: string
  desc?: Partial<Record<Locale, string>>
  stack?: string[]
}

export const PROJECT_OVERRIDES: Record<string, ProjectOverride> = {
  // Ejemplo:
  // 'cero800/Bloggie': {
  //   desc: {
  //     es: 'Plataforma de blogs con CMS basado en Markdown...',
  //     en: 'Blog platform with a Markdown-based CMS...',
  //   },
  // },
}
