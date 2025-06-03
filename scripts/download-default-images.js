const https = require('https')
const fs = require('fs')
const path = require('path')

const images = {
  'foie-gras.jpg': 'https://example.com/foie-gras.jpg',
  'terrine.jpg': 'https://example.com/terrine.jpg',
  'confit.jpg': 'https://example.com/confit.jpg',
  'magret.jpg': 'https://example.com/magret.jpg',
  'plat-cuisine.jpg': 'https://example.com/plat-cuisine.jpg',
  'charcuterie.jpg': 'https://example.com/charcuterie.jpg'
}

const downloadImage = (url, filename) => {
  const filepath = path.join(__dirname, '..', 'public', 'images', 'produits', filename)
  const file = fs.createWriteStream(filepath)

  https.get(url, response => {
    response.pipe(file)
    file.on('finish', () => {
      file.close()
      console.log(`Téléchargé: ${filename}`)
    })
  }).on('error', err => {
    fs.unlink(filepath)
    console.error(`Erreur lors du téléchargement de ${filename}:`, err.message)
  })
}

// Créer le dossier s'il n'existe pas
const dir = path.join(__dirname, '..', 'public', 'images', 'produits')
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true })
}

// Télécharger toutes les images
Object.entries(images).forEach(([filename, url]) => {
  downloadImage(url, filename)
}) 