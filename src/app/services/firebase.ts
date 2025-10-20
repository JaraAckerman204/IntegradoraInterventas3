import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, getDocs } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(private firestore: Firestore) {}

  // 🔹 Agregar producto a Firestore
  async addProduct(product: any) {
    const ref = collection(this.firestore, 'productos');
    await addDoc(ref, product);
  }

  // 🔹 Obtener productos desde Firestore
  async getProducts(): Promise<any[]> {
    const ref = collection(this.firestore, 'productos');
    const snapshot = await getDocs(ref);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }
}
