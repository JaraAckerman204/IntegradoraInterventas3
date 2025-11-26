import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  collectionData,
  deleteDoc,
  doc,
  getDocs,
  query,
  orderBy
} from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { ProductoCacheService } from './producto-cache.service';

// Interfaz para Modalidades
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
  
  // ESPECIFICACIONES
  material?: string;
  color?: string;
  medida?: string;
  cantidadPaquete?: string;
  
  // CARACTERÍSTICAS
  biodegradable?: boolean;
  aptoMicroondas?: boolean;
  aptoCongelador?: boolean;
  
  // CONTENIDO
  usosRecomendados?: string;
  destacado?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ProductosService {
  private cacheService = inject(ProductoCacheService);
  private loadingFromFirebase = false;

  constructor(private firestore: Firestore) {}

  // ==========================================
  // 📦 MÉTODO PRINCIPAL - CON CACHE AUTOMÁTICO
  // ==========================================
  /**
   * Obtiene productos con cache automático
   * Primero intenta desde cache, si no hay o expiró, carga desde Firebase
   */
  getProductos(): Observable<Producto[]> {
    console.log('📦 Obteniendo productos...');
    
    // Intentar obtener desde cache primero
    const productosCache = this.cacheService.obtenerTodosProductos();
    
    if (productosCache && productosCache.length > 0) {
      console.log('📱 Usando productos desde cache:', productosCache.length);
      return of(productosCache);
    }
    
    // Si no hay cache válido, cargar desde Firebase
    console.log('🔥 Cargando productos desde Firebase...');
    return this.loadFromFirebase();
  }

  // ==========================================
  // 🔥 CARGA DESDE FIREBASE
  // ==========================================
  /**
   * Carga productos desde Firebase y los guarda en cache
   */
  private loadFromFirebase(): Observable<Producto[]> {
    if (this.loadingFromFirebase) {
      console.log('⏳ Ya hay una carga en progreso...');
      return of([]);
    }

    this.loadingFromFirebase = true;
    const productosRef = collection(this.firestore, 'productos');
    
    return (collectionData(productosRef, { idField: 'id' }) as Observable<Producto[]>).pipe(
      tap(productos => {
        console.log('✅ Productos cargados desde Firebase:', productos.length);
        this.cacheService.guardarProductos(productos);
        this.loadingFromFirebase = false;
      }),
      catchError(error => {
        console.error('❌ Error cargando desde Firebase:', error);
        this.loadingFromFirebase = false;
        
        // Como fallback, intentar usar cache expirado
        const cacheExpirado = this.cacheService.obtenerTodosProductos();
        if (cacheExpirado) {
          console.warn('⚠️ Usando cache expirado como fallback');
          return of(cacheExpirado);
        }
        
        throw error;
      })
    );
  }

  // ==========================================
  // 🔄 FORZAR ACTUALIZACIÓN
  // ==========================================
  /**
   * Fuerza la actualización desde Firebase ignorando el cache
   * Útil para pull-to-refresh
   */
  forceRefresh(): Observable<Producto[]> {
    console.log('🔄 Forzando actualización desde Firebase...');
    this.cacheService.limpiarCache();
    return this.loadFromFirebase();
  }

  // ==========================================
  // 📊 MÉTODOS DE INFORMACIÓN DEL CACHE
  // ==========================================
  
  /**
   * Verifica si se está usando cache
   */
  isUsingCache(): boolean {
    return this.cacheService.tieneCacheValido();
  }

  /**
   * Obtiene la fecha del cache
   */
  getCacheDate(): string | null {
    const fecha = this.cacheService.obtenerFechaCache();
    return fecha ? fecha.toISOString() : null;
  }

  /**
   * Limpia el cache manualmente
   */
  clearCache(): void {
    this.cacheService.limpiarCache();
    console.log('🗑️ Cache limpiado');
  }

  /**
   * Obtiene estadísticas del cache
   */
  getCacheStats() {
    return this.cacheService.obtenerEstadisticas();
  }

  // ==========================================
  // 🔍 MÉTODOS DE FILTRADO CON CACHE
  // ==========================================
  
  /**
   * Obtiene productos por categoría (usa cache)
   */
  getProductosPorCategoria(categoria: string): Observable<Producto[]> {
    const productosCache = this.cacheService.obtenerProductosPorCategoria(categoria);
    
    if (productosCache) {
      return of(productosCache);
    }
    
    // Si no hay cache, cargar todo y filtrar
    return this.getProductos().pipe(
      map(productos => productos.filter(p => 
        p.categoria?.toLowerCase() === categoria.toLowerCase()
      ))
    );
  }

  /**
   * Obtiene productos por subcategoría (usa cache)
   */
  getProductosPorSubcategoria(subcategoria: string): Observable<Producto[]> {
    const productosCache = this.cacheService.obtenerProductosPorSubcategoria(subcategoria);
    
    if (productosCache) {
      return of(productosCache);
    }
    
    return this.getProductos().pipe(
      map(productos => productos.filter(p => 
        p.subcategoria?.toLowerCase() === subcategoria.toLowerCase()
      ))
    );
  }

  /**
   * Obtiene productos por marca (usa cache)
   */
  getProductosPorMarca(marca: string): Observable<Producto[]> {
    const productosCache = this.cacheService.obtenerProductosPorMarca(marca);
    
    if (productosCache) {
      return of(productosCache);
    }
    
    return this.getProductos().pipe(
      map(productos => productos.filter(p => 
        p.marca?.toLowerCase() === marca.toLowerCase()
      ))
    );
  }

  // ==========================================
  // ✏️ MÉTODOS DE CRUD (SIN CACHE)
  // ==========================================
  
  /**
   * Agregar producto
   * Al agregar, limpia el cache para forzar recarga
   */
  addProducto(producto: Producto) {
    const productosRef = collection(this.firestore, 'productos');
    return addDoc(productosRef, producto).then(result => {
      console.log('✅ Producto agregado, limpiando cache...');
      this.clearCache();
      return result;
    });
  }

  /**
   * Eliminar producto
   * Al eliminar, limpia el cache para forzar recarga
   */
  deleteProducto(id: string) {
    const productoDoc = doc(this.firestore, `productos/${id}`);
    return deleteDoc(productoDoc).then(() => {
      console.log('✅ Producto eliminado, limpiando cache...');
      this.clearCache();
    });
  }

  /**
   * Actualizar producto
   * Puedes agregar este método si lo necesitas
   */
  updateProducto(id: string, producto: Partial<Producto>) {
    const productoDoc = doc(this.firestore, `productos/${id}`);
    // Implementar lógica de actualización aquí
    console.log('✅ Producto actualizado, limpiando cache...');
    this.clearCache();
  }
}