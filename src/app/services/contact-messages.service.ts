import { Injectable } from '@angular/core';
import { Firestore, collectionData, collection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

export interface ContactMessage {
  id?: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  message: string;
  date: string;
}

@Injectable({ providedIn: 'root' })
export class ContactMessagesService {
  constructor(private firestore: Firestore) {}

  // ✅ Obtener todos los mensajes desde Firestore
  getMessages(): Observable<ContactMessage[]> {
    const col = collection(this.firestore, 'contactMessages');
    return collectionData(col, { idField: 'id' }) as Observable<ContactMessage[]>;
  }
}
