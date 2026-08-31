/* global Buffer, console */
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const pub = join(root, 'public')

const BG = '#070a08'
const CARD = '#0c140d'
const GREEN = '#45f585'
const MUTED = '#34d36d'
const PLACEHOLDER = '#1e5631'

const GRID = [
  ' ██████╗███████╗██████╗  ██████╗ ',
  '██╔════╝██╔════╝██╔══██╗██╔═══██╗',
  '██║     █████╗  ██████╔╝██║   ██║',
  '██║     ██╔══╝  ██╔══██╗██║   ██║',
  '╚██████╗███████╗██║  ██║╚██████╔╝',
  ' ╚═════╝╚══════╝╚═╝  ╚═╝ ╚═════╝ ',
]

const COLS = Math.max(...GRID.map((l) => l.length))

const CHEVRON = [
  [0, 2],
  [0, 4],
  [0, 6],
  [0, 4],
  [0, 2],
]

const MARK_COLS = 11
const MARK_ROWS = 5

function gridRects(u, gap, ox, oy) {
  const w = u - gap
  const rects = []
  GRID.forEach((line, y) => {
    for (let x = 0; x < line.length; x++) {
      if (line[x] !== ' ') {
        rects.push(
          `<rect x="${(ox + x * u).toFixed(2)}" y="${(oy + y * u).toFixed(2)}" width="${w.toFixed(2)}" height="${w.toFixed(2)}" />`,
        )
      }
    }
  })
  return rects.join('')
}

function markRects(u, gap, ox, oy) {
  const w = u - gap
  const rects = []
  CHEVRON.forEach(([start, cols], y) => {
    for (let x = start; x < start + cols; x++) {
      rects.push(
        `<rect x="${(ox + x * u).toFixed(2)}" y="${(oy + y * u).toFixed(2)}" width="${w.toFixed(2)}" height="${w.toFixed(2)}" fill="${GREEN}" />`,
      )
    }
  })
  rects.push(
    `<rect x="${(ox + 7 * u).toFixed(2)}" y="${(oy + 4 * u).toFixed(2)}" width="${(4 * u - gap).toFixed(2)}" height="${w.toFixed(2)}" fill="${MUTED}" />`,
  )
  return rects.join('')
}

function faviconSvg(size) {
  const u = (size - 18) / MARK_COLS
  const gap = Math.max(0.5, u * 0.12)
  const gw = MARK_COLS * u
  const gh = MARK_ROWS * u
  const ox = (size - gw) / 2
  const oy = (size - gh) / 2
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" rx="22" fill="${CARD}" />
  <rect x="2" y="2" width="${size - 4}" height="${size - 4}" rx="20" fill="none" stroke="${PLACEHOLDER}" stroke-width="1.5" stroke-dasharray="6 5" />
  <g>${markRects(u, gap, ox, oy)}</g>
</svg>`
}

function ogSvg() {
  const W = 1200
  const H = 630
  const u = 30
  const gap = 6
  const gw = COLS * u
  const ox = (W - gw) / 2
  const oy = 210
  const mu = 9
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <rect width="${W}" height="${H}" fill="${BG}" />
  <rect x="14" y="14" width="${W - 28}" height="${H - 28}" rx="22" fill="none" stroke="${PLACEHOLDER}" stroke-width="2" stroke-dasharray="14 12" />
  <g>${markRects(mu, 2, 56, 58)}</g>
  <text x="176" y="96" font-family="Noto Sans Mono, monospace" font-size="30" fill="${GREEN}">cero@portfolio</text>
  <text x="512" y="96" font-family="Noto Sans Mono, monospace" font-size="30" fill="${MUTED}">:~$ software_developer</text>
  <g fill="${GREEN}">${gridRects(u, gap, ox, oy)}</g>
  <line x1="${(W - 640) / 2}" y1="470" x2="${(W - 640) / 2 + 640}" y2="470" stroke="${PLACEHOLDER}" stroke-width="2" stroke-dasharray="10 8" />
  <text x="${W / 2}" y="522" text-anchor="middle" font-family="Noto Sans Mono, monospace" font-size="26" fill="${MUTED}">backend &#x2022; web &#x2022; tui &#x2014; github.com/cero800</text>
</svg>`
}

mkdirSync(pub, { recursive: true })

writeFileSync(join(pub, 'favicon.svg'), faviconSvg(120))

const bigPngs = [
  ['apple-touch-icon.png', faviconSvg(180), 180],
  ['og.png', ogSvg(), null],
]

for (const [name, svg, size] of bigPngs) {
  let pipeline = sharp(Buffer.from(svg)).png()
  if (size) pipeline = pipeline.resize(size, size)
  await pipeline.toFile(join(pub, name))
}

console.log('brand assets generated in', pub)
