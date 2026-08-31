import * as fs from 'fs'
import * as path from 'path'

const baseUrl: string = process.argv[2] || 'https://mini-portfolio-sigma-33.vercel.app'

const SLASHLESS = baseUrl.replace(/\/$/, '')

const routes: { path: string; lastmod: string }[] = [
  { path: '/', lastmod: new Date().toISOString().split('T')[0] },
  { path: '/en', lastmod: new Date().toISOString().split('T')[0] },
]

const out = path.resolve('dist')
fs.mkdirSync(out, { recursive: true })

console.log('<?xml version="1.0" encoding="UTF-8"?>')
console.log('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">')

for (const route of routes) {
  console.log('  <url>')
  console.log('    <loc>' + SLASHLESS + route.path + '</loc>')
  console.log('    <lastmod>' + route.lastmod + '</lastmod>')
  console.log('  </url>')
}

console.log('</urlset>')
