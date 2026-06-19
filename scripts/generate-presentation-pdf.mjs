import { spawn } from 'node:child_process'
import { createWriteStream, existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const htmlPath = join(root, 'docs', 'GRADUATION_PRESENTATION_GUIDE.html')
const pdfPath = join(root, 'docs', 'GRADUATION_PRESENTATION_GUIDE.pdf')

async function run() {
  if (!existsSync(htmlPath)) {
    console.error('HTML guide not found:', htmlPath)
    process.exit(1)
  }

  const require = createRequire(import.meta.url)
  let puppeteer

  try {
    puppeteer = require('puppeteer')
  } catch {
    console.log('Installing puppeteer (one-time)...')
    await exec('npm', ['install', 'puppeteer', '--no-save'], root)
    puppeteer = require('puppeteer')
  }

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })

  const page = await browser.newPage()
  await page.goto(`file:///${htmlPath.replace(/\\/g, '/')}`, {
    waitUntil: 'networkidle0',
  })

  await page.pdf({
    path: pdfPath,
    format: 'A4',
    printBackground: true,
    margin: { top: '10mm', right: '10mm', bottom: '10mm', left: '10mm' },
  })

  await browser.close()
  console.log('PDF created:', pdfPath)
}

function exec(cmd, args, cwd) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { cwd, stdio: 'inherit', shell: true })
    child.on('close', (code) => (code === 0 ? resolve() : reject(new Error(`${cmd} failed`))))
  })
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
