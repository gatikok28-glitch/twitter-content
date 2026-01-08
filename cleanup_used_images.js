const fs = require('fs');
const path = require('path');

const ROOT_DIR = __dirname;
const IMAGES_DIR = path.join(ROOT_DIR, 'images');
const USED_IMAGES_FILE = path.join(ROOT_DIR, 'used_images.json');

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
    const imgPath = path.join(IMAGES_DIR, file);

    if (fs.existsSync(imgPath)) {
      fs.unlinkSync(imgPath);
      deleted++;
      console.log(`🗑️ Eliminada: ${file}`);
    } else {
      console.log(`⚠️ No encontrada (ya borrada?): ${file}`);
    }
  });

  // Reset del registro
  fs.writeFileSync(USED_IMAGES_FILE, '[]', 'utf8');

  console.log(`✅ Limpieza completada. ${deleted} imágenes eliminadas.`);
}

main();
