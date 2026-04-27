// scripts/demo-gif.js
// Gera um GIF animado do scroll da página para o README
// Uso: npm run gif

const puppeteer = require('puppeteer');
const GifEncoder = require('gif-encoder-2');
const { PNG } = require('pngjs');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://clone-disneyplus-mu-two.vercel.app';
const OUTPUT_PATH = path.join(__dirname, '..', 'docs', 'demo.gif');

// 16:9 — boa qualidade sem explodir o tamanho do ficheiro
const WIDTH = 1024;
const HEIGHT = 576;
const FPS = 6;
const FRAME_DELAY = Math.round(1000 / FPS);

// Captura um frame e devolve o buffer RGBA para o gif-encoder
async function captureFrame(page) {
  const buffer = await page.screenshot({ type: 'png' });
  return new Promise((resolve, reject) => {
    const png = new PNG();
    png.parse(buffer, (err, data) => {
      if (err) reject(err);
      else resolve(data.data);
    });
  });
}

// Captura N frames com delay entre eles
async function addFrames(encoder, page, seconds) {
  const count = Math.ceil(FPS * seconds);
  for (let i = 0; i < count; i++) {
    await new Promise((r) => setTimeout(r, FRAME_DELAY));
    const frame = await captureFrame(page);
    encoder.addFrame(frame);
    process.stdout.write('.');
  }
}

// Faz scroll suave até um selector e aguarda a animação
async function scrollTo(page, selector) {
  try {
    await page.waitForSelector(selector, { timeout: 5000 });
    await page.$eval(selector, (el) => el.scrollIntoView({ behavior: 'smooth', block: 'start' }));
    await new Promise((r) => setTimeout(r, 700));
  } catch {
    console.warn(`\n  ⚠️  Selector "${selector}" não encontrado — a saltar`);
  }
}

async function generateGif() {
  const outputDir = path.dirname(OUTPUT_PATH);
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  console.log('🎬 A gerar GIF animado...');
  console.log(`   URL: ${BASE_URL}`);
  console.log(`   Resolução: ${WIDTH}x${HEIGHT} @ ${FPS}fps`);

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: WIDTH, height: HEIGHT });

  // Desactiva animações CSS para frames mais consistentes
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);

  await page.goto(BASE_URL, { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise((r) => setTimeout(r, 1500)); // aguarda renders iniciais

  const encoder = new GifEncoder(WIDTH, HEIGHT, 'octree', true);
  encoder.setDelay(FRAME_DELAY);
  encoder.setQuality(10);
  encoder.setRepeat(0); // loop infinito

  const fileStream = fs.createWriteStream(OUTPUT_PATH);
  encoder.createReadStream().pipe(fileStream);
  encoder.start();

  console.log('\nCapturando frames:');

  // --- Sequência de scroll ---
  // Hero — 2s
  await addFrames(encoder, page, 2);

  // Shows / carrosséis — 2s
  await scrollTo(page, '.shows');
  await addFrames(encoder, page, 2);

  // Planos — 1.5s
  await scrollTo(page, '.plans');
  await addFrames(encoder, page, 1.5);

  // Dispositivos — 1s
  await scrollTo(page, '.available-devices');
  await addFrames(encoder, page, 1);

  // FAQ — 1s
  await scrollTo(page, '.faq');
  await addFrames(encoder, page, 1);

  // Scroll de volta ao topo — 1s
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
  await new Promise((r) => setTimeout(r, 800));
  await addFrames(encoder, page, 1);

  encoder.finish();

  await new Promise((resolve, reject) => {
    fileStream.on('finish', resolve);
    fileStream.on('error', reject);
  });

  await browser.close();

  const stats = fs.statSync(OUTPUT_PATH);
  const sizeMB = (stats.size / 1024 / 1024).toFixed(1);

  console.log(`\n\n✅ GIF gerado: ${OUTPUT_PATH}`);
  console.log(`   Tamanho: ${sizeMB} MB`);

  if (stats.size > 10 * 1024 * 1024) {
    console.warn('\n⚠️  Ficheiro > 10 MB — o GitHub pode não exibi-lo directamente no README.');
    console.warn('   Considera hospedar o GIF no Giphy ou Cloudinary e usar o URL externo.');
  } else {
    console.log('   ✓ Tamanho dentro do limite do GitHub (< 10 MB)');
  }
}

generateGif().catch((err) => {
  console.error('\n❌ Erro:', err.message);
  process.exit(1);
});
