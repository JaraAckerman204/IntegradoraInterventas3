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
  selector: 'app-cocina-reposteria',
  templateUrl: './cocina-reposteria.page.html',
  styleUrls: ['./cocina-reposteria.page.scss'],
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
export class CocinaReposteriaPage implements OnInit, AfterViewInit {

  products: Product[] = [
    {
      name: 'Molde para Pastel Redondo',
      description: 'Molde de aluminio antiadherente ideal para repostería profesional.',
      price: 89.00,
      image: 'assets/img/products/molde-redondo.jpg'
    },
    {
      name: 'Espátula de Silicón Premium',
      description: 'Resistente al calor, perfecta para mezclas de repostería y cocina.',
      price: 45.00,
      image: 'assets/img/products/espatula.jpg'
    },
    {
      name: 'Manga Pastelera con Boquillas',
      description: 'Incluye 10 boquillas de acero inoxidable para decorar postres.',
      price: 110.00,
      image: 'assets/img/products/manga-pastelera.jpg'
    },
    {
      name: 'Cuchillo para Pan',
      description: 'Filo dentado ideal para cortar panes y pasteles sin desmoronarlos.',
      price: 75.00,
      image: 'assets/img/products/cuchillo-pan.jpg'
    },
    {
      name: 'Tazón de Mezcla 3L',
      description: 'De acero inoxidable con base antideslizante, resistente y duradero.',
      price: 130.00,
      image: 'assets/img/products/tazon-mezcla.jpg'
    },
    {
      name: 'Molde para Cupcakes',
      description: 'Capacidad para 12 piezas, recubrimiento antiadherente y fácil limpieza.',
      price: 95.00,
      image: 'assets/img/products/molde-cupcakes.jpg'
    },
    {
      name: 'Cucharas Medidoras de Acero',
      description: 'Set de 5 medidas exactas para repostería y cocina.',
      price: 65.00,
      image: 'assets/img/products/cucharas-medidoras.jpg'
    },
    {
      name: 'Rodillo de Madera',
      description: 'Superficie lisa y mango ergonómico para extender masas fácilmente.',
      price: 80.00,
      image: 'assets/img/products/rodillo.jpg'
    },
    {
      name: 'Molde de Silicón para Gelatina',
      description: 'Flexible, antiadherente y resistente a altas temperaturas.',
      price: 70.00,
      image: 'assets/img/products/molde-gelatina.jpg'
    },
    {
      name: 'Rejilla Enfriadora',
      description: 'Ideal para enfriar pasteles, galletas o pan recién horneado.',
      price: 85.00,
      image: 'assets/img/products/rejilla-enfriadora.jpg'
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
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) entry.target.classList.add('in-view');
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
  }

  addToCart(product: Product) {
    console.log('Producto agregado al carrito:', product);
  }
}
