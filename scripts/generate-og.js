import { readFileSync, writeFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')

const stops = JSON.parse(readFileSync(resolve(root, 'talent-roadmap.json'), 'utf8'))
const stopCount = stops.length
const sightseeingCount = stops.reduce((sum, s) => sum + (s.sightseeings?.length ?? 0), 0)

const logoData = readFileSync(resolve(root, 'public/cgi-logo.png'))
const logoBase64 = `data:image/png;base64,${logoData.toString('base64')}`

// Card: 1200x630, dark background, replicating the header brand section
const svg = `<svg width="1200" height="630" viewBox="0 0 1200 630"
  xmlns="http://www.w3.org/2000/svg"
  xmlns:xlink="http://www.w3.org/1999/xlink">

  <!-- Background -->
  <rect width="1200" height="630" fill="#111111"/>

  <!-- Red left accent -->
  <rect x="0" y="0" width="6" height="630" fill="#E8001C"/>

  <!-- CGI logo (2x original 72x33) -->
  <image x="72" y="175" width="144" height="66"
    href="${logoBase64}" preserveAspectRatio="xMidYMid meet"/>

  <!-- Vertical divider -->
  <rect x="248" y="168" width="2" height="80" fill="#2a2a2a"/>

  <!-- Title -->
  <text x="268" y="217"
    font-family="Arial, Helvetica, sans-serif"
    font-size="36" font-weight="700" fill="#ffffff"
    letter-spacing="-0.5">Modern Testing Talent Roadmap</text>

  <!-- Subtitle -->
  <text x="268" y="250"
    font-family="Arial, Helvetica, sans-serif"
    font-size="19" fill="#777777">A visual guide to the skills and stops on the journey</text>

  <!-- Stats row -->
  <!-- Stop count -->
  <text x="340" y="405"
    text-anchor="middle"
    font-family="Arial, Helvetica, sans-serif"
    font-size="110" font-weight="700" fill="#ffffff">${stopCount}</text>
  <text x="340" y="445"
    text-anchor="middle"
    font-family="Arial, Helvetica, sans-serif"
    font-size="17" fill="#666666" letter-spacing="2">STOPS</text>

  <!-- Divider between stats -->
  <rect x="590" y="340" width="2" height="120" fill="#2a2a2a"/>

  <!-- Sightseeing count -->
  <text x="860" y="405"
    text-anchor="middle"
    font-family="Arial, Helvetica, sans-serif"
    font-size="110" font-weight="700" fill="#ffffff">${sightseeingCount}</text>
  <text x="860" y="445"
    text-anchor="middle"
    font-family="Arial, Helvetica, sans-serif"
    font-size="17" fill="#666666" letter-spacing="2">SIGHTSEEINGS</text>

  <!-- Red bottom accent -->
  <rect x="0" y="624" width="1200" height="6" fill="#E8001C"/>
</svg>`

const outPath = resolve(root, 'public/og-image.png')
await sharp(Buffer.from(svg)).png().toFile(outPath)
console.log(`OG image generated → public/og-image.png  (${stopCount} stops · ${sightseeingCount} sightseeings)`)
