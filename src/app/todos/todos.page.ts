import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonButton, IonIcon, IonSpinner, IonBadge } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { cartOutline } from 'ionicons/icons';
import { HeaderComponent } from '../components/header/header.component';
import { FooterComponent } from '../components/footer/footer.component';
import { ProductosService, Producto } from '../services/productos.service';
import { CartService } from '../services/cart.service';
import { Router } from '@angular/router';

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
    IonBadge,
    CommonModule, 
    FormsModule,
    HeaderComponent,
    FooterComponent
  ]
})
export class TodosPage implements OnInit, AfterViewInit {
  products: Producto[] = [];
  loading = true;
  cartCount = 0;

  constructor(
    private productosService: ProductosService,
    private cartService: CartService,
    private router: Router
  ) {
    addIcons({ cartOutline });
  }

  ngOnInit() {
    this.loadProducts();
    
    // Suscribirse al contador del carrito
    this.cartService.getCartCount().subscribe(count => {
      this.cartCount = count;
    });
  }

  ngAfterViewInit() {
    // El setupScrollReveal se llama después de cargar los productos
  }

  loadProducts() {
    this.productosService.getProductos().subscribe({
      next: (productos) => {
        this.products = productos;
        this.loading = false;
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
    this.cartService.addToCart(product);
    console.log('Producto agregado al carrito:', product);
    
    // Opcional: Mostrar un toast o animación
    this.showAddedFeedback();
  }

  private showAddedFeedback() {
    // Aquí puedes agregar un toast o notificación
    console.log('¡Producto agregado! Total items:', this.cartCount);
  }

  goToCart() {
    this.router.navigate(['/carrito']);
  }
}