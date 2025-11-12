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
    // Parsear colores desde CSV (separados por punto y coma)
    const colores = row['Colores'] ? row['Colores'].split(';').map(c => c.trim()).filter(c => c) : [];
    
    // Parsear tiendas desde CSV (separadas por punto y coma)
    const tiendas = row['Tiendas'] ? row['Tiendas'].split(';').map(t => t.trim()).filter(t => t) : [];
    
    // Parsear modalidades desde CSV (formato: "Modalidad|Precio|Tamaño|Contenido;...")
    const modalidades = [];
    if (row['Modalidades']) {
      const modalidadesArray = row['Modalidades'].split(';');
      modalidadesArray.forEach(mod => {
        const [modalidad, precio, tamano, contenido] = mod.split('|');
        if (modalidad && precio) {
          modalidades.push({
            id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            modalidad: modalidad.trim(),
            precio: parseFloat(precio) || 0,
            tamano: tamano?.trim() || '',
            contenido: contenido?.trim() || ''
          });
        }
      });
    }

    // ⭐ PARSEAR NUEVOS CAMPOS
    // Convertir valores booleanos desde CSV
    const parseBool = (value) => {
      if (!value) return false;
      const val = value.toString().toLowerCase().trim();
      return val === 'true' || val === '1' || val === 'sí' || val === 'si' || val === 'yes';
    };

    const producto = {
      sku: row['SKU'] || '',
      nombre: row['Nombre del Producto'] || '',
      categoria: row['Categoría'] || '',
      subcategoria: row['Subcategoría'] || '',
      marca: row['Marca'] || 'Sin Marca',
      precio: parseFloat(row['Precio Base']) || 0,
      descripcion: row['Descripción'] || '',
      imagen: row['URL de la Imagen'] || '',
      colores: colores,
      tiendas: tiendas,
      modalidades: modalidades,
      url: row['URL'] || '',
      fechaCreacion: admin.firestore.FieldValue.serverTimestamp(),
      activo: parseBool(row['Activo']),
      
      // ⭐ NUEVOS CAMPOS - ESPECIFICACIONES
      material: row['Material'] || '',
      color: row['Color'] || '',
      medida: row['Medida'] || '',
      cantidadPaquete: row['Cantidad Paquete'] || '',
      
      // ⭐ NUEVOS CAMPOS - CARACTERÍSTICAS
      biodegradable: parseBool(row['Biodegradable']),
      aptoMicroondas: parseBool(row['Apto Microondas']),
      aptoCongelador: parseBool(row['Apto Congelador']),
      
      // ⭐ NUEVOS CAMPOS - CONTENIDO
      usosRecomendados: row['Usos Recomendados'] || ''
    };
    
    productos.push(producto);
  })
  .on('end', async () => {
    console.log('Importando ' + productos.length + ' productos...');
    
    let contador = 0;
    for (const producto of productos) {
      try {
        await db.collection('productos').add(producto);
        contador++;
        console.log(`✓ [${contador}/${productos.length}] Producto agregado: ${producto.nombre}`);
      } catch (error) {
        console.error(`✗ Error al agregar ${producto.nombre}:`, error.message);
      }
    }
    
    console.log(`\n✅ ¡Importación completa! ${contador}/${productos.length} productos agregados exitosamente`);
    process.exit(0);
  })
  .on('error', (error) => {
    console.error('❌ Error leyendo archivo CSV:', error);
    process.exit(1);
  });