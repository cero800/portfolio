export type Locale = 'es' | 'en'

export interface ProjectInfo {
  name: string
  perm: string
  date: string
  title: string
  desc: string
  stack: string[]
  demo: string
  code: string
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
  projects: ProjectInfo[]
}
