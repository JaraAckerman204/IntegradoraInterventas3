import { HeaderComponent } from '../components/header/header.component';
import { FooterComponent } from '../components/footer/footer.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { IonicModule } from '@ionic/angular';

export const SHARED_IMPORTS = [
  CommonModule,
  FormsModule,
  RouterLink,
  IonicModule,
  HeaderComponent,
  FooterComponent,
];