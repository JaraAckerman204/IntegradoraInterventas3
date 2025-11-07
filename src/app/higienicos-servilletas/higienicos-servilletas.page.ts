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
  priceType?: 'desde' | 'fijo';
  image: string;
  isNew?: boolean;
}

@Component({
  selector: 'app-higienicos-servilletas',
  templateUrl: './higienicos-servilletas.page.html',
  styleUrls: ['./higienicos-servilletas.page.scss'],
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
export class HigienicosServilletasPage implements OnInit, AfterViewInit {

  products: Product[] = [
    {
      name: 'Servilletas Clásicas 500 pzas',
      description: 'Suaves y absorbentes, ideales para restaurantes y eventos.',
      price: 28.00,
      image: 'assets/img/products/servilletas1.jpg',
    },
    {
      name: 'Servilletas Premium 300 pzas',
      description: 'Mayor grosor y suavidad, presentación premium.',
      price: 32.00,
      priceType: 'fijo',
      image: 'assets/img/products/servilletas2.jpg',
    },
    {
      name: 'Servilletas Económicas 800 pzas',
      description: 'Gran cantidad a bajo costo para grandes consumos.',
      price: 26.00,
      priceType: 'desde',
      image: 'assets/img/products/servilletas3.jpg'
    },
    {
      name: 'Servilletas Decoradas 200 pzas',
      description: 'Diseños para eventos y celebraciones.',
      price: 35.00,
      image: 'assets/img/products/servilletas4.jpg'
    },
    {
      name: 'Servilletas Industriales 100 pzas',
      description: 'Alta resistencia para uso intensivo.',
      price: 22.00,
      image: 'assets/img/products/servilletas5.jpg'
    },
    {
      name: 'Servilletas Extra Suaves 400 pzas',
      description: 'Suavidad superior para experiencia premium.',
      price: 30.00,
      image: 'assets/img/products/servilletas6.jpg',
    }
  ];

  constructor() {
    addIcons({ cartOutline });
  }

  ngOnInit() {}

  ngAfterViewInit() {
    this.setupScrollReveal();
  }

  private setupScrollReveal() {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
        }
      });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach((element) => {
      observer.observe(element);
    });
  }

  addToCart(product: Product) {
    // Placeholder: aquí va la lógica real del carrito o llamado a servicio
    console.log('Agregando al carrito:', product);
  }
}
