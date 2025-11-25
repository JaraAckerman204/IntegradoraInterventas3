import { Injectable } from '@angular/core';
import { openDB, IDBPDatabase } from 'idb';
import { Producto } from './productos.service';

@Injectable({
  providedIn: 'root'
})
export class OfflineStorageService {
  private db: IDBPDatabase | null = null;
  private readonly DB_NAME = 'interventas-productos-db';
  private readonly DB_VERSION = 1;

  constructor() {
    this.initDB();
  }

  private async initDB(): Promise<void> {
    try {
      this.db = await openDB(this.DB_NAME, this.DB_VERSION, {
        upgrade(db) {
          if (!db.objectStoreNames.contains('productos')) {
            db.createObjectStore('productos', { keyPath: 'id' });
          }
          if (!db.objectStoreNames.contains('metadata')) {
            db.createObjectStore('metadata');
          }
        }
      });
      console.log('✅ IndexedDB inicializado');
    } catch (error) {
      console.error('❌ Error inicializando IndexedDB:', error);
    }
  }

  private async getDB(): Promise<IDBPDatabase> {
    if (!this.db) {
      await this.initDB();
    }
    return this.db!;
  }

  async saveProductos(productos: Producto[]): Promise<void> {
    try {
      const db = await this.getDB();
      const tx = db.transaction(['productos', 'metadata'], 'readwrite');
      
      await tx.objectStore('productos').clear();
      
      for (const producto of productos) {
        if (producto.id) {
          await tx.objectStore('productos').put(producto);
        }
      }
      
      await tx.objectStore('metadata').put({
        lastUpdate: Date.now(),
        version: this.DB_VERSION
      }, 'info');
      
      await tx.done;
      console.log('✅ Productos guardados:', productos.length);
    } catch (error) {
      console.error('❌ Error guardando:', error);
    }
  }

  async getProductos(): Promise<Producto[]> {
    try {
      const db = await this.getDB();
      const productos = await db.getAll('productos');
      console.log('📦 Productos recuperados:', productos.length);
      return productos;
    } catch (error) {
      console.error('❌ Error recuperando:', error);
      return [];
    }
  }

  async getMetadata(): Promise<any> {
    try {
      const db = await this.getDB();
      return await db.get('metadata', 'info');
    } catch (error) {
      console.error('❌ Error metadata:', error);
      return null;
    }
  }

  async clearAll(): Promise<void> {
    try {
      const db = await this.getDB();
      const tx = db.transaction(['productos', 'metadata'], 'readwrite');
      await tx.objectStore('productos').clear();
      await tx.objectStore('metadata').clear();
      await tx.done;
      console.log('🧹 Cache limpiado');
    } catch (error) {
      console.error('❌ Error limpiando:', error);
    }
  }

  async getProductCount(): Promise<number> {
    try {
      const db = await this.getDB();
      return await db.count('productos');
    } catch (error) {
      return 0;
    }
  }
}