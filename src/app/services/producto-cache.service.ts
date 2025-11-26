import { Injectable } from '@angular/core';
import { Producto } from './productos.service';

@Injectable({
  providedIn: 'root'
})
export class ProductoCacheService {
  private readonly CACHE_ALL_KEY = 'productos_todos';
  private readonly CACHE_TIME_KEY = 'productos_cache_time';
  private readonly CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 días

  constructor() {}

  /**
   * Guarda TODOS los productos en cache
   */
  guardarProductos(productos: Producto[]): void {
    try {
      const ahora = Date.now();
      localStorage.setItem(this.CACHE_ALL_KEY, JSON.stringify(productos));
      localStorage.setItem(this.CACHE_TIME_KEY, ahora.toString());
      console.log(`✅ ${productos.length} productos guardados en cache`);
    } catch (error) {
      console.error('❌ Error guardando productos:', error);
    }
  }

  /**
   * Obtiene TODOS los productos del cache
   */
  obtenerTodosProductos(): Producto[] | null {
    try {
      if (!this.tieneCacheValido()) {
        console.log('⚠️ Cache expirado o no existe');
        return null;
      }

      const productosStr = localStorage.getItem(this.CACHE_ALL_KEY);
      if (!productosStr) return null;

      const productos = JSON.parse(productosStr);
      console.log(`✅ ${productos.length} productos obtenidos del cache`);
      return productos;
    } catch (error) {
      console.error('❌ Error obteniendo productos del cache:', error);
      return null;
    }
  }

  /**
   * Obtiene productos filtrados por categoría del cache
   */
  obtenerProductosPorCategoria(categoria: string): Producto[] | null {
    const todosProductos = this.obtenerTodosProductos();
    if (!todosProductos) return null;

    const productosFiltrados = todosProductos.filter(
      p => p.categoria?.toLowerCase() === categoria.toLowerCase()
    );
    
    console.log(`✅ ${productosFiltrados.length} productos de categoría "${categoria}" obtenidos del cache`);
    return productosFiltrados;
  }

  /**
   * Obtiene productos filtrados por subcategoría del cache
   */
  obtenerProductosPorSubcategoria(subcategoria: string): Producto[] | null {
    const todosProductos = this.obtenerTodosProductos();
    if (!todosProductos) return null;

    const productosFiltrados = todosProductos.filter(
      p => p.subcategoria?.toLowerCase() === subcategoria.toLowerCase()
    );
    
    console.log(`✅ ${productosFiltrados.length} productos de subcategoría "${subcategoria}" obtenidos del cache`);
    return productosFiltrados;
  }

  /**
   * Obtiene productos filtrados por marca del cache
   */
  obtenerProductosPorMarca(marca: string): Producto[] | null {
    const todosProductos = this.obtenerTodosProductos();
    if (!todosProductos) return null;

    const productosFiltrados = todosProductos.filter(
      p => p.marca?.toLowerCase() === marca.toLowerCase()
    );
    
    console.log(`✅ ${productosFiltrados.length} productos de marca "${marca}" obtenidos del cache`);
    return productosFiltrados;
  }

  /**
   * Verifica si hay cache válido
   */
  tieneCacheValido(): boolean {
    const cacheTime = localStorage.getItem(this.CACHE_TIME_KEY);
    if (!cacheTime) return false;
    
    const edad = Date.now() - parseInt(cacheTime);
    return edad <= this.CACHE_DURATION;
  }

  /**
   * Obtiene la fecha de la última actualización
   */
  obtenerFechaCache(): Date | null {
    const cacheTime = localStorage.getItem(this.CACHE_TIME_KEY);
    return cacheTime ? new Date(parseInt(cacheTime)) : null;
  }

  /**
   * Limpia todo el cache
   */
  limpiarCache(): void {
    localStorage.removeItem(this.CACHE_ALL_KEY);
    localStorage.removeItem(this.CACHE_TIME_KEY);
    console.log('🗑️ Cache limpiado completamente');
  }

  /**
   * Obtiene estadísticas del cache
   */
  obtenerEstadisticas(): { total: number; porCategoria: { [key: string]: number } } | null {
    const productos = this.obtenerTodosProductos();
    if (!productos) return null;

    const porCategoria: { [key: string]: number } = {};
    
    productos.forEach(p => {
      const cat = p.categoria || 'Sin categoría';
      porCategoria[cat] = (porCategoria[cat] || 0) + 1;
    });

    return {
      total: productos.length,
      porCategoria
    };
  }
}