const fs = require('fs');
const path = require('path');

const ROOT_DIR = __dirname;

const IMAGES_DIR = path.join(ROOT_DIR, 'images');
const USED_DIR   = path.join(ROOT_DIR, 'used');

const USED_IMAGES_FILE = path.join(ROOT_DIR, 'used_images.json');

function deleteIfExists(filePath, label) {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    console.log(`🗑️ Eliminada de ${label}: ${path.basename(filePath)}`);
    return 1;
  } else {
    console.log(`⚠️ No encontrada en ${label}: ${path.basename(filePath)}`);
    return 0;
  }
}

function main() {
  if (!fs.existsSync(USED_IMAGES_FILE)) {
    console.log('ℹ️ No existe used_images.json, nada para limpiar');
    return;
  }

  const usedImages = JSON.parse(
    fs.readFileSync(USED_IMAGES_FILE, 'utf8')
  );

  if (!Array.isArray(usedImages) || usedImages.length === 0) {
    console.log('ℹ️ No hay imágenes registradas para borrar');
    return;
  }

  let deleted = 0;

  usedImages.forEach(file => {
    const imagePath = path.join(IMAGES_DIR, file);
    const usedPath  = path.join(USED_DIR, file);

    deleted += deleteIfExists(imagePath, 'images');
    deleted += deleteIfExists(usedPath, 'used');
  });

  // Reset del registro
  fs.writeFileSync(USED_IMAGES_FILE, '[]', 'utf8');

  console.log(`✅ Limpieza completada. ${deleted} archivos eliminados.`);
}

main();

