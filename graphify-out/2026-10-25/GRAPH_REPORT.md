# Graph Report - portfolio (2026-10-14)

## Corpus Check

- 38 files · ~9,463 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary

- 244 nodes · 257 edges · 50 communities (12 shown, 27 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
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

## God Nodes (most connected - your core abstractions)

1. `scripts` - 10 edges
2. `compilerOptions` - 10 edges
3. `⚙️ Configuración y Desarrollo Local` - 8 edges
4. `Locale` - 7 edges
5. `include` - 7 edges
6. `Mi Portafolio Personal (Astro, React & Tailwind CSS)` - 5 edges
7. `en` - 4 edges
8. `paths` - 4 edges
9. `markRects()` - 3 edges
10. `ogSvg()` - 3 edges

## Surprising Connections (you probably didn't know these)

- `Props` --references--> `Locale` [EXTRACTED]
  src/components/FileExplorer.tsx → src/i18n/types.ts
- `Props` --references--> `ProjectInfo` [EXTRACTED]
  src/components/FileExplorer.tsx → src/i18n/types.ts

## Import Cycles

- None detected.

## Communities (50 total, 27 thin omitted)

### Community 0 - "Home.astro"

Cohesion: 0.09
Nodes (21): ../assets/avatar.txt?raw, FileExplorer(), formatUpdated(), Props, maxNameLen, projects, skills, skillsHtml (+13 more)

### Community 1 - "dependencies"

Cohesion: 0.07
Nodes (29): astro, @astrojs/check, @astrojs/react, @fontsource/fira-code, @fontsource-variable/inter, @fontsource-variable/orbitron, dependencies, astro (+21 more)

### Community 2 - "compilerOptions"

Cohesion: 0.08
Nodes (23): **/_, astro/tsconfigs/strict, .astro/types.d.ts, dist, src/assets/_, src/components/_, src/styles/_, compilerOptions (+15 more)

### Community 3 - "scripts"

Cohesion: 0.14
Nodes (13): name, scripts, astro, build, dev, format, format:check, lint (+5 more)

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

Cohesion: 0.28
Nodes (7): RepoMeta, fetchRepoMeta(), getReposMeta(), GITHUB_TOKEN, GitHubRepoResponse, loadReposMeta(), metaEnv

### Community 9 - "devDependencies"

Cohesion: 0.29
Nodes (7): astro-eslint-parser, @astrojs/tailwind, devDependencies, astro-eslint-parser, @astrojs/tailwind, prettier-plugin-tailwindcss, prettier-plugin-tailwindcss

### Community 10 - "opencode.json"

Cohesion: 0.50
Nodes (3): plugin, $schema, .opencode/plugins/graphify.js

### Community 11 - "gen_sitemap.ts"

Cohesion: 0.50
Nodes (3): out, routes, SLASHLESS

## Knowledge Gaps

- **127 isolated node(s):** `$schema`, `.opencode/plugins/graphify.js`, `__dirname`, `compat`, `name` (+122 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 148 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **27 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions

_Questions this graph is uniquely positioned to answer:_

- **Why does `devDependencies` connect `devDependencies` to `scripts`, `@astrojs/vercel`, `autoprefixer`, `eslint`, `eslint-config-prettier`, `@eslint/eslintrc`, `eslint-import-resolver-typescript`, `@eslint/js`, `eslint-plugin-astro`, `eslint-plugin-import`, `eslint-plugin-prettier`, `eslint-plugin-react`, `eslint-plugin-react-hooks`, `eslint-plugin-tailwindcss`, `globals`, `postcss`, `prettier`, `prettier-plugin-astro`, `sharp`, `tailwindcss`, `@types/node`, `@typescript-eslint/eslint-plugin`, `@typescript-eslint/parser`?**
  _High betweenness centrality (0.114) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `scripts`?**
  _High betweenness centrality (0.074) - this node is a cross-community bridge._
- **What connects `$schema`, `.opencode/plugins/graphify.js`, `__dirname` to the rest of the system?**
  _127 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Home.astro` be split into smaller, more focused modules?**
  _Cohesion score 0.0945945945945946 - nodes in this community are weakly interconnected._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.06896551724137931 - nodes in this community are weakly interconnected._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.08333333333333333 - nodes in this community are weakly interconnected._
- **Should `scripts` be split into smaller, more focused modules?**
  _Cohesion score 0.14285714285714285 - nodes in this community are weakly interconnected._
