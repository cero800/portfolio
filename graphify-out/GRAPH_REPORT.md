# Graph Report - portfolio (2026-10-27)

## Corpus Check

- 42 files · ~11,663 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary

- 277 nodes · 310 edges · 52 communities (14 shown, 27 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness

- Built from commit: `5b3e9e49`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)

- Home.astro
- dependencies
- compilerOptions
- scripts
- ⚙️ Configuración y Desarrollo Local
- include
- gen-brand-assets.mjs
- contact.ts
- github.ts
- devDependencies
- opencode.json
- gen_sitemap.ts
- eslint.config.js
- graphify.js
- env.d.ts
- vercel.json
- AGENTS.md
- @astrojs/vercel
- autoprefixer
- eslint
- eslint-config-prettier
- @eslint/eslintrc
- eslint-import-resolver-typescript
- @eslint/js
- eslint-plugin-astro
- eslint-plugin-import
- eslint-plugin-prettier
- eslint-plugin-react
- eslint-plugin-react-hooks
- eslint-plugin-tailwindcss
- globals
- postcss
- prettier
- prettier-plugin-astro
- sharp
- tailwindcss
- @types/node
- @typescript-eslint/eslint-plugin
- @typescript-eslint/parser
- sync-projects.mjs
- FileExplorer.tsx

## God Nodes (most connected - your core abstractions)

1. `scripts` - 11 edges
2. `Locale` - 10 edges
3. `compilerOptions` - 10 edges
4. `getFeaturedProjects()` - 8 edges
5. `⚙️ Configuración y Desarrollo Local` - 8 edges
6. `include` - 7 edges
7. `toProject()` - 6 edges
8. `Mi Portafolio Personal (Astro, React & Tailwind CSS)` - 5 edges
9. `en` - 4 edges
10. `ProjectInfo` - 4 edges

## Surprising Connections (you probably didn't know these)

- `Props` --references--> `Locale` [EXTRACTED]
  src/components/FileExplorer.tsx → src/i18n/types.ts
- `ProjectOverride` --references--> `Locale` [EXTRACTED]
  src/config/projects.ts → src/i18n/types.ts
- `Props` --references--> `ProjectInfo` [EXTRACTED]
  src/components/FileExplorer.tsx → src/i18n/types.ts

## Import Cycles

- None detected.

## Communities (52 total, 27 thin omitted)

### Community 0 - "Home.astro"

Cohesion: 0.10
Nodes (16): ../assets/avatar.txt?raw, maxNameLen, skills, skillsHtml, string, titlePadded, en, es (+8 more)

### Community 1 - "dependencies"

Cohesion: 0.07
Nodes (29): astro, @astrojs/check, @astrojs/react, @fontsource/fira-code, @fontsource-variable/inter, @fontsource-variable/orbitron, dependencies, astro (+21 more)

### Community 2 - "compilerOptions"

Cohesion: 0.08
Nodes (23): **/_, astro/tsconfigs/strict, .astro/types.d.ts, dist, src/assets/_, src/components/_, src/styles/_, compilerOptions (+15 more)

### Community 3 - "scripts"

Cohesion: 0.13
Nodes (14): name, scripts, astro, build, dev, format, format:check, lint (+6 more)

### Community 4 - "⚙️ Configuración y Desarrollo Local"

Cohesion: 0.15
Nodes (12): Checklist de Verificación, ⚙️ Configuración y Desarrollo Local, 🌐 Demo en Vivo, Ejecutar en Modo Desarrollo, Instalación, Mi Portafolio Personal (Astro, React & Tailwind CSS), Prerrequisitos, 🖼️ Previsualización del Sitio (+4 more)

### Community 5 - "include"

Cohesion: 0.17
Nodes (11): eslint.config.js, postcss.config.js, scripts/**/\*, src/**/*, tailwind.config.js, ./tsconfig.json, vite.config.ts, compilerOptions (+3 more)

### Community 6 - "gen-brand-assets.mjs"

Cohesion: 0.24
Nodes (10): bigPngs, CHEVRON, COLS, faviconSvg(), GRID, gridRects(), markRects(), ogSvg() (+2 more)

### Community 7 - "contact.ts"

Cohesion: 0.20
Nodes (9): checkRate(), ContactMessages, MESSAGES, metaEnv, POST(), prerender, rate, resendKey (+1 more)

### Community 8 - "github.ts"

Cohesion: 0.10
Nodes (29): EXCLUDED_NAME_PATTERN, EXCLUDED_REPO_NAMES, FEATURED_LIMIT, GITHUB_USER, PROJECT_OVERRIDES, ProjectOverride, Locale, ACRONYMS (+21 more)

### Community 9 - "devDependencies"

Cohesion: 0.29
Nodes (7): astro-eslint-parser, @astrojs/tailwind, devDependencies, astro-eslint-parser, @astrojs/tailwind, prettier-plugin-tailwindcss, prettier-plugin-tailwindcss

### Community 10 - "opencode.json"

Cohesion: 0.50
Nodes (3): plugin, $schema, .opencode/plugins/graphify.js

### Community 11 - "gen_sitemap.ts"

Cohesion: 0.50
Nodes (3): out, routes, SLASHLESS

### Community 50 - "sync-projects.mjs"

Cohesion: 0.22
Nodes (7): FIELDS, headers, OUTPUT, repos, ROOT, snapshot, token

### Community 51 - "FileExplorer.tsx"

Cohesion: 0.60
Nodes (4): FileExplorer(), formatUpdated(), Props, ProjectInfo

## Knowledge Gaps

- **140 isolated node(s):** `$schema`, `.opencode/plugins/graphify.js`, `__dirname`, `compat`, `name` (+135 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 163 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **27 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions

_Questions this graph is uniquely positioned to answer:_

- **Why does `devDependencies` connect `devDependencies` to `scripts`, `@astrojs/vercel`, `autoprefixer`, `eslint`, `eslint-config-prettier`, `@eslint/eslintrc`, `eslint-import-resolver-typescript`, `@eslint/js`, `eslint-plugin-astro`, `eslint-plugin-import`, `eslint-plugin-prettier`, `eslint-plugin-react`, `eslint-plugin-react-hooks`, `eslint-plugin-tailwindcss`, `globals`, `postcss`, `prettier`, `prettier-plugin-astro`, `sharp`, `tailwindcss`, `@types/node`, `@typescript-eslint/eslint-plugin`, `@typescript-eslint/parser`?**
  _High betweenness centrality (0.090) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `scripts`?**
  _High betweenness centrality (0.058) - this node is a cross-community bridge._
- **What connects `$schema`, `.opencode/plugins/graphify.js`, `__dirname` to the rest of the system?**
  _140 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Home.astro` be split into smaller, more focused modules?**
  _Cohesion score 0.09879032258064516 - nodes in this community are weakly interconnected._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.06896551724137931 - nodes in this community are weakly interconnected._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.08333333333333333 - nodes in this community are weakly interconnected._
- **Should `scripts` be split into smaller, more focused modules?**
  _Cohesion score 0.13333333333333333 - nodes in this community are weakly interconnected._
