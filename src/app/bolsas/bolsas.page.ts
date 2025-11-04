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
  isNew?: boolean;
}

@Component({
  selector: 'app-bolsas',
  templateUrl: './bolsas.page.html',
  styleUrls: ['./bolsas.page.scss'],
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
export class BolsasPage implements OnInit, AfterViewInit {
  products: Product[] = [
    {
      name: 'Bolsa de Plástico',
      description: 'Resistente y práctica, ideal para empaques generales.',
      price: 12.50,
      image: 'assets/img/vaso1.png'
    },
    {
      name: 'Bolsa Negra para Basura 70x90',
      description: 'Extra resistente para desechos pesados.',
      price: 18.00,
      image: 'assets/img/products/bolsa-basura.jpg'
    },
    {
      name: 'Bolsa Tipo Camiseta',
      description: 'Perfecta para tiendas y negocios, fácil de transportar.',
      price: 9.50,
      image: 'assets/img/products/bolsa-camiseta.jpg'
    },
    {
      name: 'Bolsa Biodegradable',
      description: 'Fabricada con materiales ecológicos y compostables.',
      price: 16.00,
      image: 'assets/img/products/bolsa-biodegradable.jpg'
    },
    {
      name: 'Bolsa de Papel Kraft',
      description: 'Ideal para restaurantes y tiendas ecológicas.',
      price: 14.00,
      image: 'assets/img/products/bolsa-papel.jpg'
    },
    {
      name: 'Bolsa Ziplock Mediana',
      description: 'Reutilizable, con cierre hermético y alta durabilidad.',
      price: 22.00,
      image: 'assets/img/products/bolsa-ziplock.jpg'
    },
    {
      name: 'Bolsa de Polietileno Gruesa',
      description: 'Alta resistencia para empaques industriales.',
      price: 25.00,
      image: 'assets/img/products/bolsa-polietileno.jpg'
    },
    {
      name: 'Bolsa con Asa Plana',
      description: 'Diseño elegante, perfecta para boutiques y regalos.',
      price: 15.50,
      image: 'assets/img/products/bolsa-asa.jpg'
    },
    {
      name: 'Bolsa Reutilizable de Tela',
      description: 'Duradera, lavable y ecológica. Ideal para compras diarias.',
      price: 30.00,
      image: 'assets/img/products/bolsa-tela.jpg'
    },
    {
      name: 'Bolsa Térmica Pequeña',
      description: 'Mantiene la temperatura ideal para tus alimentos.',
      price: 35.00,
      image: 'assets/img/products/bolsa-termica.jpg'
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
    const observerOptions = { root: null, rootMargin: '0px', threshold: 0.1 };
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('in-view');
      });
    }, observerOptions);
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  }

  addToCart(product: Product) {
    console.log('Agregando al carrito:', product);
  }
}
