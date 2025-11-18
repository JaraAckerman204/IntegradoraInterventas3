import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../components/header/header.component';
import { FooterComponent } from '../components/footer/footer.component';
import {
  IonContent,
  IonHeader,
  IonFooter,
  IonTitle,
  IonToolbar,
  IonButton,
  IonIcon,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonList,
  IonItem,
  IonLabel,
  IonThumbnail,
  IonBadge,
  IonButtons,
  IonBackButton,
  IonInput
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  trashOutline,
  addOutline,
  removeOutline,
  cartOutline,
  arrowBackOutline,
  logoWhatsapp,
  resizeOutline,
  layersOutline,
  storefrontOutline,
  pricetagOutline,
  ribbonOutline,
  barcodeOutline,
  colorPaletteOutline,
  compassOutline,
  bagHandleOutline,
  closeOutline,
  personCircleOutline,
  personOutline,
  callOutline,
  receiptOutline,
  giftOutline,
  arrowForward,
  shieldCheckmarkOutline,
  rocketOutline,
  headsetOutline,
  remove,
  add,
  close
} from 'ionicons/icons';
import { CartService, CartItem } from '../services/cart.service';
import { Router } from '@angular/router';
import { ToastService } from '../services/toast.service'; // ⭐ IMPORTAR TOAST

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.page.html',
  styleUrls: ['./carrito.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    HeaderComponent,
    FooterComponent,
    IonHeader,
    IonFooter,
    IonTitle,
    IonToolbar,
    IonButton,
    IonIcon,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonList,
    IonItem,
    IonLabel,
    IonThumbnail,
    IonBadge,
    IonButtons,
    IonBackButton,
    IonInput,
    CommonModule,
    FormsModule
  ]
})
export class CarritoPage implements OnInit {
  cartItems: CartItem[] = [];
  total = 0;
  
  // Datos del cliente
  customerName = '';
  customerPhone = '';
  customerAddress = '';
  customerNotes = '';
  
  // Número de WhatsApp del negocio
  businessWhatsApp = '5218711027262';

  // ⭐ INYECTAR SERVICIOS
  private cartService = inject(CartService);
  private router = inject(Router);
  private toastService = inject(ToastService); // ⭐ INYECTAR TOAST SERVICE

  constructor() {
    addIcons({
      trashOutline,
      cartOutline,
      ribbonOutline,
      barcodeOutline,
      pricetagOutline,
      resizeOutline,
      layersOutline,
      storefrontOutline,
      colorPaletteOutline,
      removeOutline,
      addOutline,
      arrowBackOutline,
      logoWhatsapp,
      compassOutline,
      bagHandleOutline,
      closeOutline,
      personCircleOutline,
      personOutline,
      callOutline,
      receiptOutline,
      giftOutline,
      arrowForward,
      shieldCheckmarkOutline,
      rocketOutline,
      headsetOutline,
      remove,
      add,
      close
    });
  }

  ngOnInit() {
    this.loadCart();
  }

  // ⭐ MÉTODO AUXILIAR PARA MOSTRAR TOAST
  async mostrarToast(mensaje: string) {
    await this.toastService.show(mensaje);
  }

  loadCart() {
    this.cartService.getCart().subscribe(items => {
      this.cartItems = items;
      this.total = this.cartService.getTotal();
      
      // 🔍 DEBUG: Ver información completa de cada producto
      console.log('╔═══════════════════════════════════════╗');
      console.log('🛒 CARRITO CARGADO - Total items:', items.length);
      console.log('╚═══════════════════════════════════════╝');
      
      items.forEach((item, index) => {
        console.log(`\n📦 PRODUCTO ${index + 1}:`);
        console.log('  ├─ Nombre:', item.nombre);
        console.log('  ├─ Marca:', item.marca || '❌ SIN MARCA');
        console.log('  ├─ SKU:', item.sku || '❌ SIN SKU');
        console.log('  ├─ Categoría:', item.categoria || '❌ SIN CATEGORÍA');
        console.log('  ├─ Subcategoría:', item.subcategoria || '❌ SIN SUBCATEGORÍA');
        console.log('  ├─ Colores:', item.colores || '❌ SIN COLORES');
        console.log('  ├─ Descripción:', item.descripcion || '❌ SIN DESCRIPCIÓN');
        console.log('  ├─ Precio:', `$${item.precio}`);
        console.log('  ├─ Cantidad:', item.quantity);
        console.log('  ├─ Sucursal:', item.sucursal || 'No especificada');
        console.log('  └─ Modalidad:', item.modalidadSeleccionada || 'Sin modalidad');
      });
      
      console.log('\n╔═══════════════════════════════════════╗');
      console.log('💰 TOTAL:', `$${this.total.toFixed(2)}`);
      console.log('╚═══════════════════════════════════════╝\n');
    });
  }

  incrementQuantity(cartItemId: string) {
    this.cartService.incrementQuantity(cartItemId);
  }

  decrementQuantity(cartItemId: string) {
    this.cartService.decrementQuantity(cartItemId);
  }

  async removeItem(cartItemId: string) {
    this.cartService.removeFromCart(cartItemId);
    await this.mostrarToast('🗑️ Producto eliminado del carrito');
  }

  async clearCart() {
    if (confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
      this.cartService.clearCart();
      await this.mostrarToast('🗑️ Carrito vaciado correctamente');
    }
  }

  // ========================================
// 🧭 NAVEGACIÓN AL CATÁLOGO
// ========================================

/**
 * Redirige al usuario a la página de productos/catálogo
 */
irACatalogo(): void {
  // Opción 1: Si tienes una ruta específica para productos
  this.router.navigate(['/productos/todos']);
  
  // Opción 2: Si quieres ir a una categoría específica
  // this.router.navigate(['/productos'], { queryParams: { categoria: 'Desechables' } });
  
  // Opción 3: Si quieres ir al home y hacer scroll a productos
  // this.router.navigate(['/home']).then(() => {
  //   setTimeout(() => {
  //     const element = document.getElementById('productos-section');
  //     if (element) {
  //       element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  //     }
  //   }, 100);
  // });
}

  async checkout() {
    // Validar que haya productos
    if (this.cartItems.length === 0) {
      await this.mostrarToast('⚠️ Tu carrito está vacío');
      return;
    }

    // Validar que haya datos del cliente
    if (!this.customerName.trim()) {
      await this.mostrarToast('⚠️ Por favor ingresa tu nombre');
      return;
    }

    if (!this.customerPhone.trim()) {
      await this.mostrarToast('⚠️ Por favor ingresa tu teléfono');
      return;
    }

    // Generar mensaje para WhatsApp
    const message = this.generateWhatsAppMessage();
    
    // Abrir WhatsApp
    this.sendToWhatsApp(message);
  }

  generateWhatsAppMessage(): string {
    let message = `🛒 *NUEVO PEDIDO*\n\n`;
    
    // Información del cliente
    message += `👤 *Cliente:* ${this.customerName}\n`;
    message += `📱 *Teléfono:* ${this.customerPhone}\n`;
    
    message += `\n━━━━━━━━━━━━━━━━━━━━\n\n`;
    
    // Productos
    message += `🛍️ *PRODUCTOS:*\n\n`;
    
    this.cartItems.forEach((item, index) => {
      message += `${index + 1}. *${item.nombre}*\n`;
      
      // ✅ MARCA
      if (item.marca) {
        message += `   🏷️ Marca: ${item.marca}\n`;
      }
      
      // ✅ SKU
      if (item.sku) {
        message += `   📦 SKU: ${item.sku}\n`;
      }
      
      // ✅ CATEGORÍA
      if (item.categoria) {
        message += `   📂 Categoría: ${item.categoria}`;
        if (item.subcategoria) {
          message += ` / ${item.subcategoria}`;
        }
        message += `\n`;
      }
      
      // Cantidad y precio
      message += `   • Cantidad: ${item.quantity}\n`;
      message += `   • Precio unitario: $${item.precio.toFixed(2)}\n`;
      
      // ✅ INFORMACIÓN DE MODALIDAD (NUEVO FORMATO)
      if (item.modalidadSeleccionada) {
        message += `   • Modalidad: ${item.modalidadSeleccionada.tipo}\n`;
        message += `   • Tamaño: ${item.modalidadSeleccionada.tamano}\n`;
        message += `   • Contenido: ${item.modalidadSeleccionada.contenido}\n`;
      }
      // ✅ COMPATIBILIDAD CON FORMATO ANTIGUO
      else {
        if (item.modalidad) {
          message += `   • Modalidad: ${item.modalidad}\n`;
        }
        if (item.tamano) {
          message += `   • Tamaño: ${item.tamano}\n`;
        }
        if (item.contenido) {
          message += `   • Contenido: ${item.contenido}\n`;
        }
      }
      
      // ✅ SUCURSAL
      if (item.sucursal) {
        message += `   🏪 Sucursal: ${item.sucursal}\n`;
      }
      
      // ✅ COLORES
      if (item.colores && item.colores.length > 0) {
        message += `   🎨 Colores: ${item.colores.join(', ')}\n`;
      }
      
      // Subtotal
      message += `   💰 Subtotal: $${(item.precio * item.quantity).toFixed(2)}\n`;
      message += `\n`;
    });
    
    message += `━━━━━━━━━━━━━━━━━━━━\n\n`;
    
    // Total
    const totalItems = this.cartService.getTotalItems();
    message += `📦 *Total de productos:* ${totalItems}\n`;
    message += `💵 *TOTAL A PAGAR:* $${this.total.toFixed(2)}\n\n`;
    
    message += `✅ ¡Gracias por tu preferencia!`;
    
    return message;
  }

  async sendToWhatsApp(message: string) {
    // Codificar el mensaje para URL
    const encodedMessage = encodeURIComponent(message);
    
    // Construir URL de WhatsApp
    const whatsappUrl = `https://wa.me/${this.businessWhatsApp}?text=${encodedMessage}`;
    
    // Mostrar toast de confirmación
    await this.mostrarToast('📱 Abriendo WhatsApp...');
    
    // Abrir WhatsApp en una nueva ventana/pestaña
    window.open(whatsappUrl, '_blank');
    
    // Confirmar y limpiar
    setTimeout(async () => {
      const confirmado = confirm('¿El pedido se envió correctamente por WhatsApp?');
      if (confirmado) {
        this.cartService.clearCart();
        this.resetCustomerData();
        await this.mostrarToast('✅ ¡Gracias por tu compra! Te contactaremos pronto.');
        
        // Navegar después de mostrar el toast
        setTimeout(() => {
          this.router.navigate(['/productos/todos']);
        }, 1000);
      }
    }, 2000);
  }

  resetCustomerData() {
    this.customerName = '';
    this.customerPhone = '';
    this.customerAddress = '';
    this.customerNotes = '';
  }

  async continueShopping() {
    await this.mostrarToast('🛍️ Continuando con las compras...');
    setTimeout(() => {
      this.router.navigate(['/productos/todos']);
    }, 500);
  }
}