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
  selector: 'app-alimentos',
  templateUrl: './alimentos.page.html',
  styleUrls: ['./alimentos.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonButton,
    IonIcon,
    CommonModule,
    FormsModule,
    HeaderComponent,
    FooterComponent,
  ]
})
export class AlimentosPage implements OnInit, AfterViewInit {

  products: Product[] = [
    {
      name: 'Salsa Valentina 370ml',
      description: 'Clásica salsa picante mexicana, ideal para botanas.',
      price: 22.00,
      image: 'assets/img/products/valentina.jpg',
    },
    {
      name: 'Nube para Freír',
      description: 'Botana para freír, perfecta para fiestas y negocios.',
      price: 48.00,
      priceType: 'desde',
      image: 'assets/img/products/nube-freir.jpg',
    },
    {
      name: 'Jugo de Limón Mega',
      description: 'Jugo concentrado para cocina, bebidas o botanas.',
      price: 39.00,
      image: 'assets/img/products/jugo-limon.jpg'
    },
    {
      name: 'Salsa Botanera',
      description: 'Salsa picosita perfecta para botanas y snacks.',
      price: 18.00,
      image: 'assets/img/products/botanera.jpg'
    },
    {
      name: 'Cereales Surtidos',
      description: 'Cereales para loncherías y tiendas.',
      price: 12.00,
      priceType: 'desde',
      image: 'assets/img/products/cereales.jpg'
    },
    {
      name: 'Cono para Helado',
      description: 'Conos crujientes ideales para repostería y heladerías.',
      price: 65.00,
      image: 'assets/img/products/cono.jpg'
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
      threshold: 0.1,
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
    console.log('Agregado al carrito:', product);
  }
}
