import { ApplicationConfig, provideZoneChangeDetection, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideServiceWorker } from '@angular/service-worker';
import { routes } from './app.routes';
import { provideIonicAngular } from '@ionic/angular/standalone';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideAnalytics, getAnalytics } from '@angular/fire/analytics';
import { provideMessaging, getMessaging } from '@angular/fire/messaging';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideIonicAngular(),
    provideFirebaseApp(() => initializeApp({
      apiKey: "AIzaSyB_XyXkGjbBD63DTU_Hfc9RlErYiz79TQI",
      authDomain: "integradorainterventas.firebaseapp.com",
      projectId: "integradorainterventas",
      storageBucket: "integradorainterventas.firebasestorage.app",
      messagingSenderId: "710007139235",
      appId: "1:710007139235:web:08ff0194124097f7b64816",
      measurementId: "G-9V9JBBFK5P"
    })),
    provideFirestore(() => getFirestore()),
    provideAnalytics(() => getAnalytics()),
    provideMessaging(() => getMessaging()),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000'
    })
  ]
};