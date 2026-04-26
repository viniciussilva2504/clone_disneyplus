// scripts/screenshot.js
// Gera screenshots automáticos do site para o README
// Uso: node scripts/screenshot.js

const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const BASE_URL = 'https://clone-disneyplus-mu-two.vercel.app';
const OUTPUT_DIR = path.join(__dirname, '..', 'docs', 'screenshots');

const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'mobile', width: 375, height: 812 },
];

const SECTIONS = [
  { name: 'hero', selector: null, scroll: 0 },
  { name: 'carrossel', selector: '.shows', scroll: null },
  { name: 'planos', selector: '.plans', scroll: null },
  { name: 'dispositivos', selector: '.available-devices', scroll: null },
  { name: 'faq', selector: '.faq', scroll: null },
  { name: 'footer', selector: 'footer', scroll: null },
  { name: 'full-page', selector: null, fullPage: true },
];

async function takeScreenshots() {
  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  for (const viewport of VIEWPORTS) {
    console.log(`\n📱 Viewport: ${viewport.name} (${viewport.width}x${viewport.height})`);
    const page = await browser.newPage();
    await page.setViewport({ width: viewport.width, height: viewport.height });

    for (const section of SECTIONS) {
      await page.goto(BASE_URL, { waitUntil: 'networkidle2', timeout: 30000 });

      const filename = `${viewport.name}_${section.name}.png`;
      const filepath = path.join(OUTPUT_DIR, filename);

      if (section.fullPage) {
        await page.screenshot({ path: filepath, fullPage: true });
      } else if (section.selector) {
        try {
          await page.waitForSelector(section.selector, { timeout: 5000 });
          await page.$eval(section.selector, (el) => el.scrollIntoView());
          await new Promise((r) => setTimeout(r, 500));
          await page.screenshot({ path: filepath });
        } catch {
          console.warn(`  ⚠️  Selector "${section.selector}" não encontrado`);
          continue;
        }
      } else {
        if (section.scroll) await page.evaluate((y) => window.scrollTo(0, y), section.scroll);
        await page.screenshot({ path: filepath });
      }

      console.log(`  ✅ ${filename}`);
    }

    await page.close();
  }

  await browser.close();
  console.log(`\n🎉 Screenshots guardados em: ${OUTPUT_DIR}`);
}

takeScreenshots().catch((err) => {
  console.error('Erro:', err);
  process.exit(1);
});
