import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Producto } from './productos.service';

export interface CartItem extends Producto {
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems: CartItem[] = [];
  private cartSubject = new BehaviorSubject<CartItem[]>([]);
  private cartCountSubject = new BehaviorSubject<number>(0);

  constructor() {
    this.loadCartFromStorage();
  }

  // Observable para que los componentes se suscriban
  getCart(): Observable<CartItem[]> {
    return this.cartSubject.asObservable();
  }

  // Observable para el contador del carrito
  getCartCount(): Observable<number> {
    return this.cartCountSubject.asObservable();
  }

  // Obtener items del carrito (sin observable)
  getCartItems(): CartItem[] {
    return this.cartItems;
  }

  // Agregar producto al carrito
  addToCart(producto: Producto) {
    const existingItem = this.cartItems.find(item => item.id === producto.id);

    if (existingItem) {
      existingItem.quantity++;
    } else {
      this.cartItems.push({ ...producto, quantity: 1 });
    }

    this.updateCart();
  }

  // Remover producto del carrito
  removeFromCart(productId: string) {
    this.cartItems = this.cartItems.filter(item => item.id !== productId);
    this.updateCart();
  }

  // Actualizar cantidad de un producto
  updateQuantity(productId: string, quantity: number) {
    const item = this.cartItems.find(item => item.id === productId);
    
    if (item) {
      if (quantity <= 0) {
        this.removeFromCart(productId);
      } else {
        item.quantity = quantity;
        this.updateCart();
      }
    }
  }

  // Incrementar cantidad
  incrementQuantity(productId: string) {
    const item = this.cartItems.find(item => item.id === productId);
    if (item) {
      item.quantity++;
      this.updateCart();
    }
  }

  // Decrementar cantidad
  decrementQuantity(productId: string) {
    const item = this.cartItems.find(item => item.id === productId);
    if (item && item.quantity > 1) {
      item.quantity--;
      this.updateCart();
    }
  }

  // Limpiar carrito
  clearCart() {
    this.cartItems = [];
    this.updateCart();
  }

  // Calcular total
  getTotal(): number {
    return this.cartItems.reduce((total, item) => {
      return total + (item.precio * item.quantity);
    }, 0);
  }

  // Calcular cantidad total de items
  getTotalItems(): number {
    return this.cartItems.reduce((total, item) => total + item.quantity, 0);
  }

  // Actualizar carrito y notificar a los observadores
  private updateCart() {
    this.cartSubject.next([...this.cartItems]);
    this.cartCountSubject.next(this.getTotalItems());
    this.saveCartToStorage();
  }

  // Guardar en localStorage
  private saveCartToStorage() {
    localStorage.setItem('cart', JSON.stringify(this.cartItems));
  }

  // Cargar desde localStorage
  private loadCartFromStorage() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      this.cartItems = JSON.parse(savedCart);
      this.cartSubject.next([...this.cartItems]);
      this.cartCountSubject.next(this.getTotalItems());
    }
  }
}