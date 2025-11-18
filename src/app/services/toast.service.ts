import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Toast {
  id: number;
  message: string;
  duration: number;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toasts$ = new BehaviorSubject<Toast[]>([]);
  public toasts = this.toasts$.asObservable();
  private idCounter = 0;

  /**
   * Muestra un toast con diseño uniforme
   * @param message Mensaje a mostrar
   * @param duration Duración en ms (default: 3000)
   */
  show(message: string, duration: number = 3000) {
    const id = this.idCounter++;
    const newToast: Toast = { id, message, duration };
    
    // Agregar el toast
    const currentToasts = this.toasts$.value;
    this.toasts$.next([...currentToasts, newToast]);
    
    // Auto-remover después de la duración
    setTimeout(() => {
      this.remove(id);
    }, duration);
  }

  /**
   * Remueve un toast específico
   */
  remove(id: number) {
    const currentToasts = this.toasts$.value;
    this.toasts$.next(currentToasts.filter(t => t.id !== id));
  }

  /**
   * Limpia todos los toasts
   */
  clear() {
    this.toasts$.next([]);
  }
}