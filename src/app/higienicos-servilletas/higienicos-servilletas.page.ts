import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-higienicos-servilletas',
  templateUrl: './higienicos-servilletas.page.html',
  styleUrls: ['./higienicos-servilletas.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class HigienicosServilletasPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
