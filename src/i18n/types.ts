export type Locale = 'es' | 'en'

/**
 * Datos vivos traídos de la API de GitHub durante el build.
 * El campo `meta` es opcional en `ProjectInfo`: el proyecto puede renderizarse
 * sin metadata si la API no devuelve datos para ese repo.
 */
export interface RepoMeta {
  stars: number
  language: string | null
  /** Fecha ISO de `pushed_at`. */
  updated: string
  topics: string[]
  homepage: string | null
}

export interface ProjectInfo {
  name: string
  perm: string
  date: string
  title: string
  desc: string
  stack: string[]
  demo: string
  code: string
  /** Repositorio en GitHub, formato "owner/repo". Clave para consultar la API. */
  repo: string
  /** Rellenado en build por `src/lib/github.ts`. */
  meta?: RepoMeta
}

export interface Dict {
  htmlLang: string
  ogLocale: string
  baseTitle: string
  description: string
  nav: {
    proyectos: string
    skills: string
    sobreMi: string
    contacto: string
    menu: string
    close: string
    navigation: string
  }
  hero: {
    tagline: string
    verProyectos: string
    sobreMi: string
  }
  sections: {
    proyectos: string
    skills: string
    sobreMi: string
    contacto: string
  }
  contact: {
    placeholderName: string
    placeholderEmail: string
    placeholderMessage: string
  }
  notFound: {
    backHome: string
    viewProjects: string
  }
  projectsMeta: {
    updated: string
    topics: string
    empty: string
  }
}
