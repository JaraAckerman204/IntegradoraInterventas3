import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface ModalidadSeleccionada {
  tipo: 'Mayoreo' | 'Menudeo';
  tamano: string;
  contenido: string;
  precio: number;
}

export interface CartItem {
  id?: string;
  nombre: string;
  precio: number;
  descripcion?: string;
  imagen?: string;
  quantity: number;
  
  // Propiedades para modalidad seleccionada
  modalidadSeleccionada?: ModalidadSeleccionada;
  
  // Propiedades para opciones adicionales
  modalidad?: string;
  tamano?: string;
  contenido?: string;
  sucursal?: string;
  
  // ID único para el carrito que incluye opciones
  cartItemId?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems = new BehaviorSubject<CartItem[]>([]);
  private cartCount = new BehaviorSubject<number>(0);

  constructor() {
    this.loadCartFromStorage();
  }

  /**
   * Generar ID único basado en producto + opciones
   */
  private generateCartItemId(
    productId: string, 
    options?: { 
      modalidad?: string; 
      tamano?: string; 
      contenido?: string;
      sucursal?: string 
    }
  ): string {
    return `${productId}-${options?.modalidad || 'default'}-${options?.tamano || 'default'}-${options?.contenido || 'default'}-${options?.sucursal || 'default'}`;
  }

  /**
   * Agregar producto al carrito con opciones
   */
  addToCart(product: any, options?: { 
    modalidad?: string; 
    tamano?: string; 
    contenido?: string;
    sucursal?: string 
  }) {
    const currentCart = this.cartItems.value;
    
    // Generar ID único para este item
    const cartItemId = this.generateCartItemId(product.id, options);
    
    const existingItem = currentCart.find(item => item.cartItemId === cartItemId);

    if (existingItem) {
      // Si el producto con las mismas opciones ya existe, incrementar cantidad
      existingItem.quantity += 1;
    } else {
      // Agregar nuevo item
      const newItem: CartItem = {
        id: product.id,
        cartItemId: cartItemId,
        nombre: product.nombre,
        precio: product.precio,
        descripcion: product.descripcion,
        imagen: product.imagen,
        quantity: 1,
        modalidadSeleccionada: product.modalidadSeleccionada || undefined,
        modalidad: options?.modalidad || '',
        tamano: options?.tamano || '',
        contenido: options?.contenido || '',
        sucursal: options?.sucursal || ''
      };
      currentCart.push(newItem);
    }

    this.cartItems.next([...currentCart]);
    this.updateCartCount();
    this.saveCartToStorage();
    console.log('✅ Producto agregado al carrito:', product.nombre, 'Opciones:', options);
  }

  /**
   * Obtener carrito como Observable
   */
  getCart(): Observable<CartItem[]> {
    return this.cartItems.asObservable();
  }

  /**
   * Obtener cantidad de items en el carrito
   */
  getCartCount(): Observable<number> {
    return this.cartCount.asObservable();
  }

  /**
   * Contar total de items (considerando cantidades)
   */
  getTotalItems(): number {
    return this.cartItems.value.reduce((total, item) => total + item.quantity, 0);
  }

  /**
   * Incrementar cantidad usando cartItemId
   */
  incrementQuantity(cartItemId: string) {
    const currentCart = this.cartItems.value;
    const item = currentCart.find(i => i.cartItemId === cartItemId);
    
    if (item) {
      item.quantity += 1;
      this.cartItems.next([...currentCart]);
      this.updateCartCount();
      this.saveCartToStorage();
    } else {
      console.error('❌ Item no encontrado:', cartItemId);
    }
  }

  /**
   * Decrementar cantidad usando cartItemId
   */
  decrementQuantity(cartItemId: string) {
    const currentCart = this.cartItems.value;
    const item = currentCart.find(i => i.cartItemId === cartItemId);
    
    if (item && item.quantity > 1) {
      item.quantity -= 1;
      this.cartItems.next([...currentCart]);
      this.updateCartCount();
      this.saveCartToStorage();
    } else {
      console.error('❌ Item no encontrado o cantidad es 1:', cartItemId);
    }
  }

  /**
   * Remover un producto usando cartItemId
   */
  removeFromCart(cartItemId: string) {
    const currentCart = this.cartItems.value.filter(item => item.cartItemId !== cartItemId);
    this.cartItems.next(currentCart);
    this.updateCartCount();
    this.saveCartToStorage();
    console.log('🗑️ Producto removido del carrito');
  }

  /**
   * Vaciar carrito
   */
  clearCart() {
    this.cartItems.next([]);
    this.updateCartCount();
    this.saveCartToStorage();
    console.log('🗑️ Carrito vaciado');
  }

  /**
   * Obtener total del carrito
   */
  getTotal(): number {
    return this.cartItems.value.reduce((total, item) => {
      return total + (item.precio * item.quantity);
    }, 0);
  }

  /**
   * Actualizar contador del carrito
   */
  private updateCartCount() {
    const count = this.getTotalItems();
    this.cartCount.next(count);
  }

  /**
   * Guardar carrito en localStorage
   */
  private saveCartToStorage() {
    const cartData = JSON.stringify(this.cartItems.value);
    localStorage.setItem('cart', cartData);
    console.log('💾 Carrito guardado en localStorage');
  }

  /**
   * Cargar carrito desde localStorage con migración
   */
  private loadCartFromStorage() {
    const cartData = localStorage.getItem('cart');
    if (cartData) {
      try {
        const items: CartItem[] = JSON.parse(cartData);
        
        // ✅ MIGRACIÓN: Asegurar que todos los items tengan cartItemId
        const migratedItems = items.map(item => {
          if (!item.cartItemId) {
            // Si no tiene cartItemId, generarlo
            const cartItemId = this.generateCartItemId(
              item.id || '', 
              {
                modalidad: item.modalidad,
                tamano: item.tamano,
                contenido: item.contenido,
                sucursal: item.sucursal
              }
            );
            
            console.log('🔄 Migrando item sin cartItemId:', item.nombre, '→', cartItemId);
            
            return {
              ...item,
              cartItemId: cartItemId
            };
          }
          return item;
        });
        
        this.cartItems.next(migratedItems);
        this.updateCartCount();
        
        // Guardar los datos migrados
        if (migratedItems.some(item => !items.find(i => i.cartItemId === item.cartItemId))) {
          this.saveCartToStorage();
        }
        
        console.log('✅ Carrito cargado desde localStorage:', migratedItems.length, 'items');
      } catch (error) {
        console.error('❌ Error cargando carrito:', error);
        // Si hay error, limpiar localStorage
        localStorage.removeItem('cart');
      }
    }
  }
}