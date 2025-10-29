import { inject, Injectable } from '@angular/core';
import { Messaging, getToken, onMessage } from '@angular/fire/messaging';

@Injectable({ providedIn: 'root' })
export class PushService {
  private messaging = inject(Messaging);

  async requestPermission() {
    try {
      const token = await getToken(this.messaging, {
        vapidKey: 'BIQ_5Xy-WiY9ZYab_LX8-QU0j5X-KHvqA819gXwnvXhybWGsCqSa56irZF2hPDXt25_TrTOp_gMBzQ0iH2AzUr8',
      });
      if (token) {
        console.log('✅ Token de notificaciones:', token);
      
      } else {
        console.warn('⚠️ No se pudo obtener el token.');
      }
    } catch (err) {
      console.error('❌ Error al pedir permiso de notificaciones:', err);
    }
  }

  listenMessages() {
    onMessage(this.messaging, (payload) => {
      console.log('📩 Notificación recibida en primer plano:', payload);
      alert(`📢 ${payload.notification?.title}\n${payload.notification?.body}`);
    });
  }
}
