import { Component, OnInit, inject } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { Router, NavigationEnd } from '@angular/router';
import { PushService } from './services/push.service';
import { ToastComponent } from './components/toast/toast.component';

// Firebase Analytics
import { getAnalytics, logEvent } from '@angular/fire/analytics';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    IonApp,
    IonRouterOutlet,
    ToastComponent
  ],
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {

  private pushService = inject(PushService);
  private router = inject(Router);

  ngOnInit() {
    console.log('🚀 Iniciando aplicación...');

    // ============================
    // Firebase Messaging Service Worker
    // ============================
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('firebase-messaging-sw.js')
        .then(() => console.log('✅ Firebase SW registrado correctamente'))
        .catch((err) =>
          console.error('❌ Error al registrar Firebase SW:', err)
        );
    }

    this.pushService.requestPermission();
    this.pushService.listenMessages();

    // ============================
    // Google Analytics Page Tracking
    // ============================
    const analytics = getAnalytics();

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        logEvent(analytics, 'page_view', {
          page_path: event.urlAfterRedirects,
        });

        console.log('📊 GA page_view:', event.urlAfterRedirects);
      }
    });
  }
}
