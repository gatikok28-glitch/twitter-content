const fs = require('fs');
const path = require('path');

// ===== CONFIGURACIÓN =====
const GITHUB_USER = 'gatikok28-glitch';
const REPO_NAME = 'twitter-content';
const BRANCH = 'main';
const POSTS_PER_RUN = 2;

// Textos posibles (podés editar o dejar uno solo)
const TEXTS = [
  'New post ✨',
  'Daily update',
  'Sharing today’s image'
];

// =========================

const IMAGES_DIR = path.join(__dirname, 'images');
const USED_DIR = path.join(__dirname, 'used');
const POSTS_DIR = path.join(__dirname, 'posts');
const CSV_PATH = path.join(POSTS_DIR, 'posts.csv');

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRawUrl(filename) {
  return `https://raw.githubusercontent.com/${GITHUB_USER}/${REPO_NAME}/${BRANCH}/images/${filename}`;
}

function main() {
  const images = fs
    .readdirSync(IMAGES_DIR)
    .filter(f => /\.(jpg|jpeg|png)$/i.test(f));

  if (images.length === 0) {
    console.log('❌ No hay imágenes nuevas en images/');
    return;
  }

  const selected = images.slice(0, POSTS_PER_RUN);

  if (!fs.existsSync(POSTS_DIR)) {
    fs.mkdirSync(POSTS_DIR);
  }

  const rows = ['text,media_url'];

  selected.forEach(file => {
    const text = randomItem(TEXTS);
    const url = getRawUrl(file);
    rows.push(`"${text}","${url}"`);

    // mover imagen a used/
    fs.renameSync(
      path.join(IMAGES_DIR, file),
      path.join(USED_DIR, file)
    );
  });

  fs.writeFileSync(CSV_PATH, rows.join('\n'), 'utf8');

  console.log(`✅ CSV generado con ${selected.length} posts`);
  console.log(`📄 ${CSV_PATH}`);
}

main();
