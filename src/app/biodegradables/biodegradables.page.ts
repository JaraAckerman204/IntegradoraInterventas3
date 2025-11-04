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
  selector: 'app-biodegradables',
  templateUrl: './biodegradables.page.html',
  styleUrls: ['./biodegradables.page.scss'],
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
export class BiodegradablesPage implements OnInit, AfterViewInit {
  products: Product[] = [
    {
      name: 'Vaso Biodegradable 8oz',
      description: 'Hecho con materiales compostables, ideal para bebidas calientes y frías.',
      price: 120,
      priceType: 'desde',
      image: 'assets/img/vaso1.png',
      isNew: true
    },
    {
      name: 'Plato Biodegradable 10"',
      description: 'Resistente y ecológico, elaborado con fibra natural de caña.',
      price: 180,
      image: 'assets/img/biodegradables/plato10.jpg'
    },
    {
      name: 'Cubiertos Biodegradables',
      description: 'Cuchillos, tenedores y cucharas 100% biodegradables.',
      price: 95,
      image: 'assets/img/biodegradables/cubiertos.jpg'
    },
    {
      name: 'Caja Biodegradable para Alimentos',
      description: 'Perfecta para llevar alimentos, resistente al calor y a la humedad.',
      price: 250,
      priceType: 'desde',
      image: 'assets/img/biodegradables/caja.jpg'
    },
    {
      name: 'Tapa Biodegradable para Vasos',
      description: 'Fabricada con almidón vegetal, se adapta a varios tamaños de vasos.',
      price: 70,
      image: 'assets/img/biodegradables/tapa.jpg'
    },
    {
      name: 'Popotes Biodegradables',
      description: 'Hechos de maíz, se degradan completamente en pocos meses.',
      price: 60,
      priceType: 'desde',
      image: 'assets/img/biodegradables/popotes.jpg'
    },
    {
      name: 'Bolsa Compostable Chica',
      description: 'Fabricada con materiales vegetales, ideal para productos ligeros.',
      price: 45,
      image: 'assets/img/biodegradables/bolsa-chica.jpg'
    },
    {
      name: 'Bolsa Compostable Grande',
      description: 'Bolsa resistente y 100% compostable, ideal para productos pesados.',
      price: 70,
      image: 'assets/img/biodegradables/bolsa-grande.jpg'
    },
    {
      name: 'Charola Biodegradable',
      description: 'Charola resistente para alimentos, hecha de pulpa natural.',
      price: 130,
      image: 'assets/img/biodegradables/charola.jpg',
      isNew: true
    },
    {
      name: 'Tazón Biodegradable',
      description: 'Ideal para sopas o ensaladas, elaborado con materiales sostenibles.',
      price: 110,
      image: 'assets/img/biodegradables/tazon.jpg'
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
    console.log('Agregando al carrito:', product);
  }
}
