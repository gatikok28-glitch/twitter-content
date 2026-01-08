const fs = require('fs');
const path = require('path');

/* ================= CONFIG ================= */

const GITHUB_USER = 'gatikok28-glitch';
const REPO_NAME = 'twitter-content';
const BRANCH = 'main';

const POSTS_PER_RUN = 2;

const TEXTS = [
  'New post ✨',
  'Daily update',
  'Sharing today’s image'
];

// HEADER EXACTO DE PUBLER (NO TOCAR)
const CSV_HEADER = 'Date - Intl. format or prompt,Text,Link(s) - Separated by comma for FB carousels,Media URL(s) - Separated by comma,"Title - For the video, pin, PDF ..",Label(s) - Separated by comma,Alt text(s) - Separated by ||,Comment(s) - Separated by ||,"Pin board, FB album, or Google category","Post subtype - I.e. story, reel, PDF ..",CTA - For Facebook links or Google,"Reminder - For stories, reels, shorts, and TikToks"';

/* ========================================== */

const ROOT_DIR = __dirname;
const IMAGES_DIR = path.join(ROOT_DIR, 'images');
const USED_DIR = path.join(ROOT_DIR, 'used');
const POSTS_DIR = path.join(ROOT_DIR, 'posts');
const CSV_PATH = path.join(POSTS_DIR, 'posts.csv');

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function rawUrl(filename) {
  // encodea espacios y caracteres raros
  const encoded = encodeURIComponent(filename).replace(/%2F/g, '/');
  return `https://raw.githubusercontent.com/${GITHUB_USER}/${REPO_NAME}/${BRANCH}/images/${encoded}`;
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function main() {
  ensureDir(USED_DIR);
  ensureDir(POSTS_DIR);

  const images = fs
    .readdirSync(IMAGES_DIR)
    .filter(f => /\.(jpg|jpeg|png)$/i.test(f));

  if (images.length === 0) {
    console.log('❌ No hay imágenes nuevas en images/');
    return;
  }

  const selected = images.slice(0, POSTS_PER_RUN);
  const rows = [CSV_HEADER];

  selected.forEach(file => {
    const text = randomItem(TEXTS);
    const mediaUrl = rawUrl(file);

    // IMPORTANTE:
    // Solo llenamos Date (vacío), Text y Media URL(s)
    // El resto de columnas quedan vacías
    rows.push(
      `,"${text}",,"${mediaUrl}",,,,,,,,,`
    );

    // fs.renameSync(
//   path.join(IMAGES_DIR, file),
//   path.join(USED_DIR, file)
// );

    console.log(`➡️ Imagen usada: ${file}`);
  });

  fs.writeFileSync(CSV_PATH, rows.join('\n'), 'utf8');
  console.log(`✅ CSV generado correctamente en ${CSV_PATH}`);
}

main();


