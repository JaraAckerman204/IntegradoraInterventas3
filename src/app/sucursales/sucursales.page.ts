import { Component, HostListener, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { addIcons } from 'ionicons';
import { locationOutline, callOutline, timeOutline } from 'ionicons/icons';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonButton,
  IonIcon,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonFooter,
  IonImg,
} from '@ionic/angular/standalone';

// IMPORTA TUS COMPONENTES REUTILIZABLES
import { HeaderComponent } from '../components/header/header.component';
import { FooterComponent } from '../components/footer/footer.component';

@Component({
  selector: 'app-sucursales',
  templateUrl: 'sucursales.page.html',
  styleUrls: ['sucursales.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonButton,
    IonIcon,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonFooter,
    IonImg,
    HeaderComponent,
    FooterComponent
  ],
})
export class SucursalesPage {
  constructor(
    private elRef: ElementRef,
    private sanitizer: DomSanitizer
  ) {
    // Registrar los iconos necesarios
    addIcons({ locationOutline, callOutline, timeOutline });
  }

  // ===== SUCURSALES MAYOREO =====
  sucursalesMayoreo = [
    {
      nombre: 'MATRIZ',
      direccion: 'Circuito Central #160, Col. Parque Industrial Lagunero, Gómez Palacio, Durango',
      telefono: '',
      horario: 'Lunes a Viernes 8:00 am - 6:00 pm | Sábados 8:00 am - 2:30 pm',
      mapsUrl: this.sanitizer.bypassSecurityTrustResourceUrl(
        'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3599.341663842313!2d-103.47624202530963!3d25.56029737747899!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x868fdbb30a348397%3A0x5722acdb93b63165!2sInterventas%20Matriz!5e0!3m2!1ses-419!2sus!4v1761356782851!5m2!1ses-419!2sus" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade'
      )
    },
    {
      nombre: 'DIAGONAL',
      direccion: 'Blvd. Diagonal Reforma #1795 ote., Col. Santa María, Torreón, Coahuila',
      telefono: '',
      horario: 'Lunes a Viernes 8:00 am - 5:00 pm | Sábados 8:00 am - 3:00 pm',
      mapsUrl: this.sanitizer.bypassSecurityTrustResourceUrl(
        'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3599.5299761844635!2d-103.43056752530983!3d25.55402897748289!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x868fdbb64759a2c3%3A0xf3f84995b1b9161!2sInterventas%20Diagonal!5e0!3m2!1ses-419!2sus!4v1761356872326!5m2!1ses-419!2sus" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade'
      )
    },
    {
      nombre: 'ABASTOS TORREÓN',
      direccion: 'Calle de los abarrotes, bodega 197 y 198, Mercado de Abastos Torreón, Torreón, Coahuila',
      telefono: '',
      horario: 'Lunes a Viernes 7:00 am - 2:30 pm | Sábados 7:00 am - 1:00 pm',
      mapsUrl: this.sanitizer.bypassSecurityTrustResourceUrl(
        'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3599.5299761844635!2d-103.43056752530983!3d25.55402897748289!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x868fdbb5d47da46b%3A0x64851a26ed07416b!2sInterventas%20Abastos%20Torre%C3%B3n!5e0!3m2!1ses-419!2sus!4v1761356943989!5m2!1ses-419!2sus" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade'
      )
    },
    {
      nombre: 'PERIFÉRICO',
      direccion: 'Periférico Raul López Sanchez, esquina con Av. Bravo, Col. Arboledas III, Torreón, Coahuila',
      telefono: '',
      horario: 'Lunes a Viernes 8:00 am - 4:30 pm | Sábados 9:00 am - 2:30 pm',
      mapsUrl: this.sanitizer.bypassSecurityTrustResourceUrl(
        'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d57588.48245262591!2d-103.4607063737496!3d25.562344583975072!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x868fdb5c8a8e0b8d%3A0x4cf0afddf488734!2sInterventas%20Perif%C3%A9rico!5e0!3m2!1ses-419!2sus!4v1761357081222!5m2!1ses-419!2sus" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade'
      )
    },
    {
      nombre: 'CALZADA ABASTOS',
      direccion: 'Calle Calzada abastos #141, Col. Santa María, Torreón, Coahuila',
      telefono: '',
      horario: 'Lunes a Viernes 7:30 am - 4:30 pm | Sábados 7:30 am - 2:30 pm',
      mapsUrl: this.sanitizer.bypassSecurityTrustResourceUrl(
        'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3599.41711764733!2d-103.42508261114506!3d25.557785900000013!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x868fdbb30a34849d%3A0xd6e5971e2f234e7b!2sInterventas%20Calzada!5e0!3m2!1ses-419!2sus!4v1761357155237!5m2!1ses-419!2sus" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade'
      )
    },
    {
      nombre: 'DURANGO',
      direccion: 'Calle Selenio #147 Ote. Bodega 3, Ciudad Industrial, Durango, Durango',
      telefono: '',
      horario: 'Lunes a Viernes 7:00 am - 4:00 pm | Sábados 7:30 am - 12:30 pm',
      mapsUrl: this.sanitizer.bypassSecurityTrustResourceUrl(
        'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3642.9047282837696!2d-104.606591025366!3d24.069659328453817!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x869bb6f19ddfaa17%3A0x12a9bbdc5466cc7f!2sInterventas%20Durango!5e0!3m2!1ses-419!2sus!4v1761357302462!5m2!1ses-419!2sus" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade'
      )
    }
  ];

  // ===== SUCURSALES MENUDEO =====
  sucursalesMenudeo = [
    {
      nombre: 'ABASTOS GÓMEZ',
      direccion: 'Av. Oriente #42, local 17, Mercado Abastos de Gómez Palacio, Gómez Palacio, Durango',
      telefono: '(871) 799-20-36',
      horario: 'Lunes a Viernes 8:00 am - 6:00 pm | Sábados 9:00 am - 4:00 pm',
      mapsUrl: this.sanitizer.bypassSecurityTrustResourceUrl(
        'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3599.201125256569!2d-103.4784862339399!3d25.56497458627487!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x868fd9a340004f21%3A0x1e549f8362c8a1aa!2sOriente%2042-Local%2017%2C%20Central%20de%20Abastos%2C%2035045%20G%C3%B3mez%20Palacio%2C%20Dgo.%2C%20M%C3%A9xico!5e0!3m2!1ses-419!2sus!4v1761357656795!5m2!1ses-419!2sus" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade'
      )
    },
    {
      nombre: 'CALZADA ABASTOS',
      direccion: 'Calle Calzada abastos #141, Col. Santa María, Torreón, Coahuila',
      telefono: '',
      horario: 'Lunes a Viernes 7:30 am - 4:30 pm | Sábados 7:30 am - 2:30 pm',
      mapsUrl: this.sanitizer.bypassSecurityTrustResourceUrl(
        'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3599.481532442793!2d-103.4255313719568!3d25.55564167343664!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x868fdbb5d47da46b%3A0x64851a26ed07416b!2sInterventas%20Abastos%20Torre%C3%B3n!5e0!3m2!1ses-419!2sus!4v1761357788076!5m2!1ses-419!2sus" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade'
      )
    },
    {
      nombre: 'PLAZA ABASTOS',
      direccion: 'Av. Del Desierto # 240, local 41, Col. Nueva California, Torreón, Coahuila',
      telefono: '',
      horario: 'Lunes a Viernes 8:00 am - 6:00 pm | Sábados y Domingos 9:00 am - 4:00 pm',
      mapsUrl: this.sanitizer.bypassSecurityTrustResourceUrl(
        'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d28797.890644774852!2d-103.42294956338807!3d25.547158359151947!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x868fdb5a27f644b5%3A0x9c023525b708b622!2sInterventas%20Express%20Plaza%20Abastos!5e0!3m2!1ses-419!2sus!4v1761357865875!5m2!1ses-419!2sus" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade'
      )
    }
  ];
}