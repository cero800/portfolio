# Mi Portafolio Personal (Astro, React & Tailwind CSS)

[![Astro](https://img.shields.io/badge/Astro-B354FF?style=for-the-badge&logo=astro&logoColor=white)](https://astro.build/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Tailwind CSS v3](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)

> **¡Hola! Soy CERO (cero800).** Este es el repositorio de mi portafolio web personal. Es una _single page_ con estética **TUI de terminal**, pensada para mostrar mi trabajo como desarrollador **backend** y mis proyectos de web. La versión actual es el **v1**: navegación a secciones, _file explorer_ interactivo con mis proyectos reales, formulario de contacto funcional e internacionalización **ES/EN** (`/: español`, `/en: english`).

### 🖼️ Previsualización del Sitio

<img width="1090" height="292" alt="image" src="https://github.com/user-attachments/assets/dc5c7ddc-4ec8-45eb-b7eb-083750e98229" />

### 🌐 Demo en Vivo

Puedes ver la versión desplegada en:

- Español: https://mini-portfolio-sigma-33.vercel.app/
- English: https://mini-portfolio-sigma-33.vercel.app/en

---

## 🚀 Tecnologías Clave

- **Astro:** Framework principal, con `output: 'server'` (SSR) y `@astrojs/vercel`. Las páginas de inicio (`/` y `/en`) están **prerenderizadas** (`prerender = true`); el endpoint de contacto sigue en SSR.
- **React:** Se usa como isla (`client:idle`) en el _file explorer_ de proyectos, donde se requiere estado e interactividad.
- **Tailwind CSS v3:** Diseño _utility-first_, completamente _responsive_.
- **TypeScript:** Tipado en todo el proyecto, con `astro check` y ESLint en la verificación.
- **Resend + Zod:** API endpoint para el formulario de contacto, con validación, _honeypot_ y rate-limit (3 envíos/hora por IP).
- **GitHub API:** La sección de proyectos **descubre automáticamente** los repos públicos, los ordena por relevancia y muestra los 6 más destacados con datos vivos (estrellas, lenguaje, última actualización, topics y homepage) obtenidos **una sola vez durante el build**. Usa un snapshot local como respaldo si la API falla. Ver [Proyectos desde GitHub](#-proyectos-desde-github-automático).

---

## ⚙️ Configuración y Desarrollo Local

### Prerrequisitos

- [Node.js](https://nodejs.org/en/) (versión 18+)
- **pnpm** (está configurado como gestor del proyecto).

### Instalación

1.  **Clonar el Repositorio:**

    ```bash
    git clone https://github.com/cero800/portfolio.git
    cd portfolio
    ```

2.  **Instalar Dependencias:**

    ```bash
    pnpm install
    ```

### Ejecutar en Modo Desarrollo

Ejecuta el servidor de desarrollo en modo local. Esto abrirá el sitio en `http://localhost:4321`.

```bash
pnpm dev
```

### Checklist de Verificación

Antes de subir cambios:

```bash
pnpm format:check
pnpm lint
pnpm exec astro check
pnpm run build
```

### Regenerar Assets de Marca

El favicon, el _apple-touch-icon_ y la imagen `og.png` (1200×630) se generan desde `scripts/gen-brand-assets.mjs`:

```bash
node scripts/gen-brand-assets.mjs
```

### Variables de Entorno (formulario de contacto)

El formulario de la sección **Contacto** envía los mensajes por correo usando **Resend**. En producción configúralas en Vercel → **Settings → Environment Variables**; en local, copia `.env.template` a `.env`:

| Variable          | Descripción                                                        |
| ----------------- | ------------------------------------------------------------------ |
| `RESEND_API_KEY`  | Clave de API de Resend.                                            |
| `RESEND_FROM`     | Dirección "De:" del correo. Ej.: `CERO <portfolio@tudominio.com>`. |
| `RESEND_EMAIL_TO` | Tu correo real donde recibir los mensajes.                         |

> **Nota:** Sin un dominio verificado en Resend, el modo `onboarding@resend.dev` solo puede enviar a tu propio email (el de tu cuenta de Resend).

### 🐙 Proyectos desde GitHub (automático)

La sección **Proyectos** ya **no tiene una lista hardcodeada**. En cada build se descubren los repositorios públicos del usuario, se puntúan por relevancia y se muestran los **6 más destacados**. Cada tarjeta incluye datos reales del repo:

```
★ estrellas · lenguaje · actualizado <mes año>
temas: topic1, topic2, ...
```

**Cómo funciona**

- **Descubrimiento:** `GET https://api.github.com/users/cero800/repos?per_page=100&type=owner&sort=pushed`.
- **Filtros:** se descartan forks, repos archivados/deshabilitados y repos de configuración (`.github`, `dotfiles`, `nixos`, etc.).
- **Ranking (`src/lib/github.ts`):** como la API REST no permite ordenar por estrellas, se calcula un score combinando estrellas, forks, homepage, topics, descripción y recencia. El resultado se ordena de mayor a menor.
- **Transformación:** cada repo se convierte en `ProjectInfo` usando nombre, descripción, topics (como stack), homepage, lenguaje y fecha de push.
- **Build estático:** las páginas están prerenderizadas, así que todo se resuelve una vez en `pnpm build`. No hay peticiones a GitHub desde el navegador.
- **Respaldo automático:** si la API falla (rate limit, red, etc.), se usa `src/data/github-repos.json` generado con `pnpm sync:projects`. Si no hay snapshot, la sección muestra un mensaje alternativo sin romper el build.

**Overrides opcionales (`src/config/projects.ts`)**

No hace falta listar los repos. Si quieres traducir o mejorar un proyecto concreto, añádelo al mapa `PROJECT_OVERRIDES` (clave `owner/repo`):

```ts
export const PROJECT_OVERRIDES = {
  'cero800/Bloggie': {
    desc: {
      es: 'Plataforma de blogs con CMS basado en Markdown...',
      en: 'Blog platform with a Markdown-based CMS...',
    },
  },
}
```

Los repos que no estén en el mapa usan la descripción de GitHub (o una generada a partir de lenguaje/topics).

**Ajustar cantidad y exclusiones**

En `src/config/projects.ts`: `FEATURED_LIMIT` (por defecto 6), `EXCLUDED_REPO_NAMES` y `EXCLUDED_NAME_PATTERN`.

**Variable opcional**

| Variable       | Descripción                                                                                                                                                 |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `GITHUB_TOKEN` | Token **opcional** (classic, sin scopes, solo lectura pública). Sube el límite de peticiones de 60 a 5.000 req/h durante el build. Sin él también funciona. |

**Actualizar repositorios**

```bash
# Sincroniza el snapshot con la API de GitHub (usa GITHUB_TOKEN si está en .env)
pnpm sync:projects
```

> Para actualizar los repos hay que volver a desplegar. Si quieres refresco automático, puedes añadir un _Deploy Hook_ de Vercel y un _cron_ que lo dispare.
