import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  collectionData,
  deleteDoc,
  doc,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

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
  precio: number; // Este será un precio base (opcional)
  descripcion?: string;
  imagen?: string;
  colores?: string[]; // Array de colores
  tiendas?: string[]; // Array de sucursales
  modalidades?: Modalidad[]; // Array de modalidades con precios
  url?: string;
  fechaCreacion?: any;
  activo?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ProductosService {
  constructor(private firestore: Firestore) {}

  // 🔹 Obtener lista de productos (en tiempo real)
  getProductos(): Observable<Producto[]> {
    const productosRef = collection(this.firestore, 'productos');
    return collectionData(productosRef, { idField: 'id' }) as Observable<Producto[]>;
  }

  // 🔹 Agregar producto
  addProducto(producto: Producto) {
    const productosRef = collection(this.firestore, 'productos');
    return addDoc(productosRef, producto);
  }

  // 🔹 Eliminar producto
  deleteProducto(id: string) {
    const productoDoc = doc(this.firestore, `productos/${id}`);
    return deleteDoc(productoDoc);
  }
}