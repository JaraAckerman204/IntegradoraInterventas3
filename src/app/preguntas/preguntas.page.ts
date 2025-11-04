import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { FooterComponent } from 'src/app/components/footer/footer.component';

@Component({
  selector: 'app-preguntas',
  templateUrl: './preguntas.page.html',
  styleUrls: ['./preguntas.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonIcon,
    CommonModule,
    FormsModule,
    RouterLink,
    HeaderComponent,
    FooterComponent,
  ],
})
export class PreguntasPage implements OnInit {
  faqs = [
    {
      question: '¿En dónde están ubicados?',
      answer: `Nos encontramos en la parte norte de México. Contamos con 5 sucursales en Torreón, Coahuila, 
      3 sucursales en Gómez Palacio, Durango y 1 sucursal en Durango, Durango. 
      Conoce tu sucursal más cercana <a routerLink="/sucursales" class="faq-link">aquí</a>.`,
      open: false,
    },
    {
      question: '¿La venta es en mayoreo o menudeo?',
      answer: `Actualmente contamos con las dos opciones. Todos nuestros productos están disponibles para la venta en mayoreo,
      sin embargo no todos se encuentran disponibles para vender en menudeo.`,
      open: false,
    },
    {
      question: '¿Tienen envíos a todo el país?',
      answer: `Sí, manejamos varias paqueterías y líneas de transporte, con cobertura en toda la República Mexicana.`,
      open: false,
    },
    {
      question: '¿Cómo puedo realizar una compra?',
      answer: `Para poder realizar una compra primero te enviaremos una cotización, una vez realizada nuestro equipo de ventas se pondrá en contacto contigo.`,
      open: false,
    },
    {
      question: '¿Cómo puedo pedir una cotización?',
      answer: `Hay tres formas de obtener una cotización:<br><br>
      • Agrega los productos a tu carrito de compras, llena los datos y te mandaremos la cotización.<br><br>
      • Solicítala al teléfono de Atención al Cliente <strong>(871) 719 2070</strong>, o a través de WhatsApp al <strong>(871) 114 6742</strong>.<br><br>
      • Envía la cantidad y el código de los artículos que te interesen al correo 
      <a href="mailto:webmaster@grupointerventas.com" class="faq-link">webmaster@grupointerventas.com</a> 
      para que uno de nuestros asesores te contacte.`,
      open: false,
    },
    {
      question: '¿Se puede mejorar el precio de los artículos en línea?',
      answer: `Se aplican condiciones para hacer un descuento. Se considera la cantidad a comprar, la marca, 
      los gastos de envío, entre otros factores. Para mayor información contáctanos vía WhatsApp al 
      <strong>(871) 114 6742</strong> o al teléfono fijo <strong>(871) 719 2070</strong>.`,
      open: false,
    },
    {
      question: '¿Cómo cancelar un pedido?',
      answer: `Los pedidos pueden ser cancelados siempre y cuando no se encuentren ya en manos de la paquetería.`,
      open: false,
    },
    {
      question: '¿Cómo puedo pedir un reembolso?',
      answer: `Si el paquete todavía se encuentra en nuestras instalaciones y realizaste la cancelación,
      es importante ponerte en contacto con nosotros por WhatsApp para concluir el proceso y realizar el reembolso.<br><br>
      No contamos con cambios ni devoluciones, a excepción de que exista una falla en la mercancía. 
      En ese caso se abrirá una disputa para analizar el caso y proceder con el reembolso.`,
      open: false,
    },
  ];

  constructor() {}

  ngOnInit() {}

  toggleFaq(index: number) {
    this.faqs[index].open = !this.faqs[index].open;
  }
}
