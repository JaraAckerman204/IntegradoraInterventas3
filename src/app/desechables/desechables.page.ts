import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonButton, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { cartOutline } from 'ionicons/icons';
import { HeaderComponent } from '../components/header/header.component';
import { FooterComponent } from '../components/footer/footer.component';

interface Product {
  name: string;
  description: string;
  price: number;
  image: string;
  priceType?: 'desde' | 'fijo';
  isNew?: boolean;
}

@Component({
  selector: 'app-desechables',
  templateUrl: './desechables.page.html',
  styleUrls: ['./desechables.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonButton,
    IonIcon,
    CommonModule,
    FormsModule,
    HeaderComponent,
    FooterComponent
  ]
})
export class DesechablesPage implements OnInit, AfterViewInit {
  products: Product[] = [
    { name: 'Vaso Desechable 12oz', description: 'Ideal para refrescos o jugos.', price: 45, image: 'assets/img/vaso1.png' },
    { name: 'Tapa para Vaso 12oz', description: 'Evita derrames, perfecta para bebidas para llevar.', price: 15, image: 'assets/img/desechables/tapa12.jpg' },
    { name: 'Plato Desechable Grande', description: 'Resistente y práctico para comidas completas.', price: 70, image: 'assets/img/desechables/plato.jpg' },
    { name: 'Charola Desechable No. 6', description: 'Ideal para carnes, pasteles o postres.', price: 55, image: 'assets/img/desechables/charola6.jpg' },
    { name: 'Cuchillo Desechable', description: 'Económico y resistente para eventos.', price: 25, image: 'assets/img/desechables/cuchillo.jpg' },
    { name: 'Tenedor Desechable', description: 'Perfecto para comidas rápidas y eventos.', price: 25, image: 'assets/img/desechables/tenedor.jpg' },
    { name: 'Cuchara Desechable', description: 'Versátil y práctica para todo tipo de comida.', price: 25, image: 'assets/img/desechables/cuchara.jpg' },
    { name: 'Contenedor Desechable 500ml', description: 'Transparente, ideal para delivery.', price: 60, image: 'assets/img/desechables/contenedor500.jpg' },
    { name: 'Popote Desechable', description: 'Flexible y cómodo, ideal para bebidas frías.', price: 12, image: 'assets/img/desechables/popote.jpg' },
    { name: 'Servilleta Desechable', description: 'Suave y absorbente, para todo uso.', price: 18, image: 'assets/img/desechables/servilleta.jpg' }
  ];

  constructor() {
    addIcons({ cartOutline });
  }

  ngOnInit() {}

  ngAfterViewInit() {
    this.setupScrollReveal();
  }

  private setupScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  }

  addToCart(product: Product) {
    console.log('Agregando al carrito:', product);
  }
}
