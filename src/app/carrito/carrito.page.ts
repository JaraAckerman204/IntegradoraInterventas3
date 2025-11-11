import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../components/header/header.component';
import {
  IonContent,
  IonHeader,
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
  colorPaletteOutline
} from 'ionicons/icons';
import { CartService, CartItem } from '../services/cart.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.page.html',
  styleUrls: ['./carrito.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    HeaderComponent,
    IonHeader,
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

  constructor(
    private cartService: CartService,
    private router: Router
  ) {
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
      logoWhatsapp
    });
  }

  ngOnInit() {
    this.loadCart();
  }

  loadCart() {
    this.cartService.getCart().subscribe(items => {
      this.cartItems = items;
      this.total = this.cartService.getTotal();
      
      // 🔍 DEBUG: Ver información completa de cada producto
      console.log('═══════════════════════════════════════');
      console.log('🛒 CARRITO CARGADO - Total items:', items.length);
      console.log('═══════════════════════════════════════');
      
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
      
      console.log('\n═══════════════════════════════════════');
      console.log('💰 TOTAL:', `$${this.total.toFixed(2)}`);
      console.log('═══════════════════════════════════════\n');
    });
  }

  incrementQuantity(cartItemId: string) {
    this.cartService.incrementQuantity(cartItemId);
  }

  decrementQuantity(cartItemId: string) {
    this.cartService.decrementQuantity(cartItemId);
  }

  removeItem(cartItemId: string) {
    this.cartService.removeFromCart(cartItemId);
  }

  clearCart() {
    if (confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
      this.cartService.clearCart();
    }
  }

  checkout() {
    // Validar que haya datos del cliente
    if (!this.customerName.trim()) {
      alert('Por favor ingresa tu nombre');
      return;
    }

    if (!this.customerPhone.trim()) {
      alert('Por favor ingresa tu teléfono');
      return;
    }

    if (!this.customerAddress.trim()) {
      alert('Por favor ingresa tu dirección de entrega');
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
    message += `📍 *Dirección:* ${this.customerAddress}\n`;
    
    if (this.customerNotes.trim()) {
      message += `📝 *Notas:* ${this.customerNotes}\n`;
    }
    
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

  sendToWhatsApp(message: string) {
    // Codificar el mensaje para URL
    const encodedMessage = encodeURIComponent(message);
    
    // Construir URL de WhatsApp
    const whatsappUrl = `https://wa.me/${this.businessWhatsApp}?text=${encodedMessage}`;
    
    // Abrir WhatsApp en una nueva ventana/pestaña
    window.open(whatsappUrl, '_blank');
    
    // Confirmar y limpiar
    setTimeout(() => {
      const confirmado = confirm('¿El pedido se envió correctamente por WhatsApp?');
      if (confirmado) {
        this.cartService.clearCart();
        this.resetCustomerData();
        alert('✅ ¡Gracias por tu compra! Te contactaremos pronto.');
        this.router.navigate(['/todos']);
      }
    }, 2000);
  }

  resetCustomerData() {
    this.customerName = '';
    this.customerPhone = '';
    this.customerAddress = '';
    this.customerNotes = '';
  }

  continueShopping() {
    this.router.navigate(['/todos']);
  }
}