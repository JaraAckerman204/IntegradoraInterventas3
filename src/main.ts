import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { provideIonicAngular } from '@ionic/angular/standalone';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';

// Firebase imports
import { initializeApp } from '@angular/fire/app';
import { getAuth } from '@angular/fire/auth';
import { getFirestore } from '@angular/fire/firestore';
import { getStorage } from '@angular/fire/storage';
import { getMessaging } from '@angular/fire/messaging';

import { provideFirebaseApp } from '@angular/fire/app';
import { provideAuth } from '@angular/fire/auth';
import { provideFirestore } from '@angular/fire/firestore';
import { provideStorage } from '@angular/fire/storage';
import { provideMessaging } from '@angular/fire/messaging';

import { isDevMode } from '@angular/core';
import { provideServiceWorker } from '@angular/service-worker';

// ✅ Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyB_XyXkGjbBD63DTU_Hfc9RlErYiz79TQI",
  authDomain: "integradorainterventas.firebaseapp.com",
  projectId: "integradorainterventas",
  storageBucket: "integradorainterventas.appspot.com",
  messagingSenderId: "710007139235",
  appId: "1:710007139235:web:08ff0194124097f7b64816"
};

// 🚀 Bootstrap principal
bootstrapApplication(AppComponent, {
  providers: [
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),

    // ✅ Inicialización Firebase (versión modular)
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
    provideMessaging(() => getMessaging()),

    // ✅ Service Worker (PWA / offline + push)
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000'
    }),
  ],
});
