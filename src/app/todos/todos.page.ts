import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonButton, IonIcon, IonSpinner } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { cartOutline } from 'ionicons/icons';
import { HeaderComponent } from '../components/header/header.component';
import { FooterComponent } from '../components/footer/footer.component';
import { ProductosService, Producto } from '../services/productos.service';

@Component({
  selector: 'app-todos',
  templateUrl: './todos.page.html',
  styleUrls: ['./todos.page.scss'],
  standalone: true,
  imports: [
    IonContent, 
    IonButton,
    IonIcon,
    IonSpinner,
    CommonModule, 
    FormsModule,
    HeaderComponent,
    FooterComponent
  ]
})
export class TodosPage implements OnInit, AfterViewInit {
  products: Producto[] = [];
  loading = true;

  constructor(private productosService: ProductosService) {
    addIcons({ cartOutline });
  }

  ngOnInit() {
    this.loadProducts();
  }

  ngAfterViewInit() {
    // El setupScrollReveal se llama después de cargar los productos
  }

  loadProducts() {
    this.productosService.getProductos().subscribe({
      next: (productos) => {
        this.products = productos;
        this.loading = false;
        // Esperar un tick para que el DOM se actualice antes de aplicar el reveal
        setTimeout(() => this.setupScrollReveal(), 100);
      },
      error: (error) => {
        console.error('Error cargando productos:', error);
        this.loading = false;
      }
    });
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

  addToCart(product: Producto) {
    console.log('Agregando al carrito:', product);
    // TODO: Implementar la lógica del carrito
  }
}