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
  selector: 'app-todos',
  templateUrl: './todos.page.html',
  styleUrls: ['./todos.page.scss'],
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
export class TodosPage implements OnInit, AfterViewInit {
  products: Product[] = [
    {
      name: 'Charola Grande C-10',
      description: 'Ideal para pastelerías, carnicerías y catering.',
      price: 37.00,
      priceType: 'desde',
      image: 'assets/img/vaso1.png',
    },
    {
      name: 'Vaso Térmico No.10',
      description: 'Excelente aislamiento, perfecto para bebidas frías y calientes.',
      price: 26.00,
      image: 'assets/img/products/vaso-termico.jpg',
      isNew: true
    },
    {
      name: 'Cuchara Plástica Mediana',
      description: 'La opción económica y resistente para eventos y restaurantes.',
      price: 14.00,
      priceType: 'desde',
      image: 'assets/img/products/cuchara.jpg'
    },
    {
      name: 'Plato Biodegradable',
      description: 'Ecológico y resistente, perfecto para eventos al aire libre.',
      price: 45.00,
      image: 'assets/img/products/plato-bio.jpg',
      isNew: true
    },
    {
      name: 'Servilletas Premium',
      description: 'Suaves y absorbentes, ideales para restaurantes de alta gama.',
      price: 28.50,
      priceType: 'desde',
      image: 'assets/img/products/servilletas.jpg'
    },
    {
      name: 'Contenedor Térmico',
      description: 'Mantiene la temperatura ideal para entregas y eventos.',
      price: 52.00,
      image: 'assets/img/products/contenedor.jpg'
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
    // TODO: Implementar la lógica del carrito
    console.log('Agregando al carrito:', product);
    // Aquí puedes agregar la lógica para añadir el producto al carrito
    // Por ejemplo, emitir un evento o llamar a un servicio
  }
}
