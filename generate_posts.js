const fs = require('fs');
const path = require('path');

/* ================= CONFIG ================= */

const GITHUB_USER = 'gatikok28-glitch';
const REPO_NAME = 'twitter-content';
const BRANCH = 'main';

// 👉 Cambiá a 3 cuando quieras escalar
const POSTS_PER_RUN = 2;

/*
=================================================
📚 BIBLIOTECA DE 90 TEXTOS HUMANOS (SFW)
=================================================
*/
const TEXTS = [
  // neutros
  'Daily update',
  'New post',
  'Another one',
  'From today',
  'Latest upload',
  'Just posted',
  'New today',
  'Today’s post',
  'Posting this',
  'Sharing this',

  // emoción leve
  'Love this',
  'Really like this',
  'One of my favorites',
  'This one feels nice',
  'Glad to share this',
  'Enjoy this one',
  'Feels good',
  'Looks great',
  'This one stands out',
  'Nice one',

  // casual / humano
  'Just sharing',
  'Nothing special, just posting',
  'Here it is',
  'Another post today',
  'Posting casually',
  'Why not',
  'Just because',
  'Here we go',
  'Posting again',
  'One more',

  // minimalistas (muy humanos)
  '✨',
  '.',
  '—',
  '..',
  '...',
  '*',
  '~',
  '✓',
  '✦',
  '✧',

  // descriptivos suaves
  'Today’s image',
  'New image today',
  'Latest image',
  'Sharing today’s image',
  'From today’s upload',
  'Today’s upload',
  'Another image',
  'New image',
  'Posting an image',
  'This image',

  // variaciones naturales
  'Back with a new post',
  'Posting something new',
  'Another update today',
  'Sharing something new',
  'Quick post',
  'Small update',
  'Just an update',
  'New drop',
  'Fresh post',
  'Here’s today’s post',

  // ultra humanos / bajo esfuerzo
  'ok',
  'hm',
  'yeah',
  'nice',
  'cool',
  'alright',
  'done',
  'posted',
  'upload',
  'new'
];

// 🔒 HEADER EXACTO DEL TEMPLATE OFICIAL DE PUBLER (NO MODIFICAR)
const CSV_HEADER =
  'Date - Intl. format or prompt,Text,Link(s) - Separated by comma for FB carousels,Media URL(s) - Separated by comma,"Title - For the video, pin, PDF ..",Label(s) - Separated by comma,Alt text(s) - Separated by ||,Comment(s) - Separated by ||,"Pin board, FB album, or Google category","Post subtype - I.e. story, reel, PDF ..",CTA - For Facebook links or Google,"Reminder - For stories, reels, shorts, and TikToks"';

/* ========================================== */

const ROOT_DIR = __dirname;
const IMAGES_DIR = path.join(ROOT_DIR, 'images');
const POSTS_DIR = path.join(ROOT_DIR, 'posts');
const CSV_PATH = path.join(POSTS_DIR, 'posts.csv');

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function rawUrl(filename) {
  // Codifica espacios y caracteres especiales
  const encoded = encodeURIComponent(filename).replace(/%2F/g, '/');
  return `https://raw.githubusercontent.com/${GITHUB_USER}/${REPO_NAME}/${BRANCH}/images/${encoded}`;
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function main() {
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

    // Solo usamos Date (vacío), Text y Media URL(s)
    // El resto de columnas quedan vacías
    rows.push(
      `,"${text}",,"${mediaUrl}",,,,,,,,,`
    );
  });

  fs.writeFileSync(CSV_PATH, rows.join('\n'), 'utf8');
  console.log(`✅ CSV generado con ${selected.length} posts`);
}

main();



