import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  collectionData,
  deleteDoc,
  doc,
} from '@angular/fire/firestore';
import { Observable, from, of } from 'rxjs';
import { map, catchError, tap, timeout } from 'rxjs/operators';
import { OfflineStorageService } from './offline-storage.service';

export interface Modalidad {
  id: string;
  modalidad: 'Mayoreo' | 'Menudeo';
  precio: number;
  tamano: string;
  contenido: string;
}

export interface Producto {
  id?: string;
  sku?: string;
  nombre: string;
  categoria?: string;
  subcategoria?: string;
  marca?: string;
  precio: number;
  descripcion?: string;
  imagen?: string;
  colores?: string[];
  tiendas?: string[];
  modalidades?: Modalidad[];
  url?: string;
  fechaCreacion?: any;
  activo?: boolean;
  material?: string;
  color?: string;
  medida?: string;
  cantidadPaquete?: string;
  biodegradable?: boolean;
  aptoMicroondas?: boolean;
  aptoCongelador?: boolean;
  usosRecomendados?: string;
  destacado?: boolean;
  modalidadSeleccionada?: {
    tipo: string;
    tamano: string;
    contenido: string;
    precio: number;
  };
}

@Injectable({
  providedIn: 'root',
})
export class ProductosService {
  private firestore = inject(Firestore);
  private offlineStorage = inject(OfflineStorageService);

  getProductos(): Observable<Producto[]> {
    console.log('🔄 Iniciando carga de productos...');
    console.log('📡 Estado de conexión:', navigator.onLine ? 'ONLINE' : 'OFFLINE');

    if (!navigator.onLine) {
      console.log('📡 Sin conexión - Cargando desde IndexedDB');
      return from(this.offlineStorage.getProductos()).pipe(
        map(productos => {
          if (productos.length === 0) {
            console.warn('⚠️ No hay productos en caché offline');
          } else {
            console.log('✅ Productos cargados desde caché:', productos.length);
          }
          return productos;
        }),
        catchError(error => {
          console.error('❌ Error cargando desde IndexedDB:', error);
          return of([]);
        })
      );
    }

    console.log('📡 Online - Intentando cargar desde Firestore...');
    const productosRef = collection(this.firestore, 'productos');
    
    return (collectionData(productosRef, { idField: 'id' }) as Observable<Producto[]>).pipe(
      timeout(15000),
      map((productos: Producto[]) => {
        console.log('✅ Productos recibidos de Firestore:', productos.length);
        return productos;
      }),
      tap(async (productos) => {
        if (productos.length > 0) {
          try {
            await this.offlineStorage.saveProductos(productos);
            const metadata = await this.offlineStorage.getMetadata();
            console.log('💾 Productos guardados en caché offline');
            console.log('📅 Última actualización:', new Date(metadata.lastUpdate).toLocaleString());
          } catch (error) {
            console.error('❌ Error guardando en caché:', error);
          }
        }
      }),
      catchError(error => {
        console.error('❌ Error cargando de Firestore:', error.message);
        console.log('🔄 Intentando cargar desde caché offline...');
        
        return from(this.offlineStorage.getProductos()).pipe(
          map(productos => {
            if (productos.length > 0) {
              console.log('✅ Productos cargados desde caché de respaldo:', productos.length);
            } else {
              console.warn('⚠️ No hay productos en caché offline');
            }
            return productos;
          }),
          catchError(dbError => {
            console.error('❌ Error cargando desde caché:', dbError);
            return of([]);
          })
        );
      })
    );
  }

  async forceUpdateCache(): Promise<boolean> {
    if (!navigator.onLine) {
      console.warn('⚠️ Sin conexión, no se puede actualizar caché');
      return false;
    }

    try {
      console.log('🔄 Forzando actualización de caché...');
      const productosRef = collection(this.firestore, 'productos');
      const productos = await new Promise<Producto[]>((resolve, reject) => {
        const subscription = (collectionData(productosRef, { idField: 'id' }) as Observable<Producto[]>)
          .pipe(timeout(15000))
          .subscribe({
            next: (data) => {
              subscription.unsubscribe();
              resolve(data as Producto[]);
            },
            error: (error) => {
              subscription.unsubscribe();
              reject(error);
            }
          });
      });
      
      if (productos.length > 0) {
        await this.offlineStorage.saveProductos(productos);
        console.log('✅ Caché actualizado manualmente:', productos.length);
        return true;
      }
      return false;
    } catch (error) {
      console.error('❌ Error actualizando caché:', error);
      return false;
    }
  }

  async getCacheInfo(): Promise<any> {
    const metadata = await this.offlineStorage.getMetadata();
    const count = await this.offlineStorage.getProductCount();
    
    return {
      productsCount: count,
      lastUpdate: metadata ? new Date(metadata.lastUpdate) : null,
      hasCache: count > 0
    };
  }

  async clearCache(): Promise<void> {
    await this.offlineStorage.clearAll();
    console.log('🧹 Caché limpiado');
  }

  addProducto(producto: Producto) {
    const productosRef = collection(this.firestore, 'productos');
    return addDoc(productosRef, producto);
  }

  deleteProducto(id: string) {
    const productoDoc = doc(this.firestore, `productos/${id}`);
    return deleteDoc(productoDoc);
  }
}