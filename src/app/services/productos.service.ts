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

export interface Producto {
  id?: string;
  nombre: string;
  descripcion?: string;
  imagen?: string;
  precio: number;
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
