const fs = require('fs');
const path = require('path');

/* ================= CONFIGURACIÓN ================= */

// 🔴 CAMBIÁ ESTO
const GITHUB_USER = 'gatikok28-glitch';
const REPO_NAME = 'twitter-content';
const BRANCH = 'main';

// Cantidad de posts a generar por ejecución
const POSTS_PER_RUN = 2;

// Textos posibles para los tweets
const TEXTS = [
  'New post ✨',
  'Daily update',
  'Sharing today’s image'
];

/* ================================================= */

const ROOT_DIR = __dirname;
const IMAGES_DIR = path.join(ROOT_DIR, 'images');
const USED_DIR = path.join(ROOT_DIR, 'used');
const POSTS_DIR = path.join(ROOT_DIR, 'posts');
const CSV_PATH = path.join(POSTS_DIR, 'posts.csv');

// ---------- LOGS DE DIAGNÓSTICO ----------
console.log('📂 Root dir:', ROOT_DIR);
console.log('📂 images exists:', fs.existsSync(IMAGES_DIR));
console.log('📂 used exists:', fs.existsSync(USED_DIR));
console.log('📂 posts exists:', fs.existsSync(POSTS_DIR));
// ----------------------------------------

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRawUrl(filename) {
  return `https://raw.githubusercontent.com/${GITHUB_USER}/${REPO_NAME}/${BRANCH}/images/${filename}`;
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function main() {
  ensureDir(USED_DIR);
  ensureDir(POSTS_DIR);

  console.log('🔍 Leyendo imágenes en:', IMAGES_DIR);

  if (!fs.existsSync(IMAGES_DIR)) {
    console.log('❌ La carpeta images/ no existe');
    return;
  }

  const images = fs
    .readdirSync(IMAGES_DIR)
    .filter(f => /\.(jpg|jpeg|png)$/i.test(f));

  console.log('🖼️ Imágenes encontradas:', images);

  if (images.length === 0) {
    console.log('❌ No hay imágenes nuevas en images/');
    return;
  }

  const selected = images.slice(0, POSTS_PER_RUN);

  const rows = ['Text,Media URL,Schedule Date,Schedule Time'];
rows.push(`"${text}","${url}",,`);


  selected.forEach(file => {
    const text = randomItem(TEXTS);
    const url = getRawUrl(file);

    rows.push(`"${text}","${url}"`);

    const from = path.join(IMAGES_DIR, file);
    const to = path.join(USED_DIR, file);

    fs.renameSync(from, to);
    console.log(`➡️ Movida imagen: ${file}`);
  });

  fs.writeFileSync(CSV_PATH, rows.join('\n'), 'utf8');

  console.log(`✅ CSV generado: ${CSV_PATH}`);
  console.log(`📊 Posts creados: ${selected.length}`);
}

main();

