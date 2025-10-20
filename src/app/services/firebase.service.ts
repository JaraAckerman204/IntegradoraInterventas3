import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root' // Esto hace que el servicio esté disponible en toda la app
})
export class FirebaseService {

  constructor(private firestore: Firestore) {}

  /**
   * 🛍 Obtiene todos los productos desde Firestore
   * Retorna un Observable que se actualiza en tiempo real
   */
  getProducts(): Observable<any[]> {
    const productosRef = collection(this.firestore, 'productos'); // 👈 nombre de tu colección
    return collectionData(productosRef, { idField: 'id' }) as Observable<any[]>;
  }

  /**
   * ➕ Agrega un producto a Firestore
   */
  async addProduct(producto: any): Promise<void> {
    const productosRef = collection(this.firestore, 'productos');
    await import('@angular/fire/firestore').then(m =>
      m.addDoc(productosRef, producto)
    );
  }

  /**
   * 🗑 Elimina un producto (si lo necesitas más adelante)
   */
  async deleteProduct(id: string): Promise<void> {
    const productosRef = collection(this.firestore, 'productos');
    await import('@angular/fire/firestore').then(m =>
      m.deleteDoc(m.doc(productosRef, id))
    );
  }
}
