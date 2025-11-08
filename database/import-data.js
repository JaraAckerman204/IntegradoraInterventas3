const admin = require('firebase-admin');
const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');

const serviceAccount = require('./firebase-key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const productos = [];
const csvPath = path.join(__dirname, 'productos.csv');

console.log('Buscando archivo en:', csvPath);

fs.createReadStream(csvPath)
  .pipe(csv())
  .on('data', (row) => {
    // Mapear de CSV a formato Angular
    const producto = {
      id: parseInt(row['ID del Producto']) || 0,
      nombre: row['Nombre del Producto'] || '',
      categoria: row['Categoría'] || '',
      marca: row['Marca'] || '',
      precio: parseFloat(row['Precio']) || 0,
      descripcion: row['Descripción'] || '',
      imagen: row['URL de la Imagen'] || '' // Angular espera "imagen"
    };
    productos.push(producto);
  })
  .on('end', async () => {
    console.log('Importando ' + productos.length + ' productos...');
    
    for (const producto of productos) {
      await db.collection('productos').add(producto);
      console.log('✓ Producto agregado:', producto.nombre);
    }
    
    console.log('✅ ¡Importación completa! ' + productos.length + ' productos agregados');
    process.exit(0);
  })
  .on('error', (error) => {
    console.error('❌ Error leyendo archivo CSV:', error);
    process.exit(1);
  });