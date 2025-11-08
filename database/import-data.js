const admin = require('firebase-admin');
const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');

// Inicializar Firebase Admin
const serviceAccount = require('./firebase-key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Leer CSV e importar a Firestore
const productos = [];

// CAMBIADO: Usa path.join con __dirname para encontrar el CSV en la misma carpeta
const csvPath = path.join(__dirname, 'productos.csv');

console.log('Buscando archivo en:', csvPath);

fs.createReadStream(csvPath)
  .pipe(csv())
  .on('data', (row) => {
    productos.push(row);
  })
  .on('end', async () => {
    console.log('Importando ' + productos.length + ' productos...');
    
    for (const producto of productos) {
      await db.collection('productos').add(producto);
      console.log('Producto agregado:', producto['Nombre del Producto']);
    }
    
    console.log('¡Importación completa!');
    process.exit(0);
  })
  .on('error', (error) => {
    console.error('Error leyendo archivo CSV:', error);
    process.exit(1);
  });