import { Component, OnInit, inject } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { PushService } from './services/push.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [IonApp, IonRouterOutlet],
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  private pushService = inject(PushService);

  ngOnInit() {
    console.log('🚀 Iniciando aplicación...');

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('firebase-messaging-sw.js')
        .then(() => console.log('✅ Firebase SW registrado correctamente'))
        .catch((err) => console.error('❌ Error al registrar Firebase SW:', err));
    }

    this.pushService.requestPermission();
    this.pushService.listenMessages();
  }
}
