// @ts-check
import { defineConfig } from 'astro/config'

import react from '@astrojs/react'
import tailwind from '@astrojs/tailwind'
import vercel from '@astrojs/vercel'

// For alias imports
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  experimental: {
    csp: true,
  },

  adapter: vercel({
    experimentalStaticHeaders: true,
  }),

  integrations: [react(), tailwind()],

  vite: {
    resolve: {
      alias: {
        '@styles': fileURLToPath(new URL('./src/styles', import.meta.url)),
        '@assets': fileURLToPath(new URL('./src/assets', import.meta.url)),
        '@components': fileURLToPath(new URL('./src/components', import.meta.url)),
      },
    },
  },

  output: 'server',

  server: {
    host: true,
    port: 4321,
  },
})
