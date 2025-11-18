import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, Toast } from '../../services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-wrapper">
      <div 
        *ngFor="let toast of toasts; trackBy: trackByToastId" 
        class="custom-toast-uniform">
        <div class="toast-container">
          <div class="toast-top-line"></div>
          <div class="toast-content">
            <div class="toast-message">{{ toast.message }}</div>
            <button class="toast-button" (click)="closeToast(toast.id)" type="button">
              <span class="toast-button-icon">×</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .toast-wrapper {
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 10000;
      display: flex;
      flex-direction: column;
      gap: 12px;
      pointer-events: none;
      width: auto;
      max-width: 500px;
    }

    .custom-toast-uniform {
      pointer-events: auto;
      animation: slideIn 0.3s ease-out;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
      min-height: 60px;
      width: auto;
      max-width: 500px;
      min-width: 300px;
    }

    @keyframes slideIn {
      from {
        transform: translateY(100px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }

    .toast-container {
      background: linear-gradient(135deg, #27318d 0%, #1a2365 100%);
      border-radius: 12px;
      border: 2px solid rgba(237, 19, 112, 0.5);
      position: relative;
      overflow: hidden;
      display: flex;
      align-items: center;
      padding: 10px;
      gap: 12px;
    }

    .toast-top-line {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: linear-gradient(to right, #ed1370, #ff4d94);
    }

    .toast-content {
      display: flex;
      align-items: center;
      gap: 12px;
      width: 100%;
      position: relative;
      z-index: 1;
    }

    .toast-message {
      font-family: 'Lato', sans-serif;
      font-weight: 600;
      font-size: 0.9em;
      color: #27318d;
      line-height: 1.4;
      background: white;
      padding: 12px 16px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      flex: 1;
    }

    .toast-button {
      position: relative;
      right: 0;
      border-radius: 50%;
      width: 32px;
      height: 32px;
      min-width: 32px;
      border: none;
      cursor: pointer;
      padding: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255, 255, 255, 0.2);
      color: white;
      transition: all 0.3s ease;
      flex-shrink: 0;
      z-index: 10;
    }

    .toast-button:hover {
      background: rgba(237, 19, 112, 0.8);
      transform: scale(1.1);
    }

    .toast-button:active {
      transform: scale(0.95);
    }

    .toast-button-icon {
      font-size: 20px;
      font-weight: bold;
      display: flex;
      align-items: center;
      justify-content: center;
      line-height: 1;
    }

    @media (max-width: 768px) {
      .toast-wrapper {
        max-width: 92vw;
        left: 50%;
        right: auto;
      }

      .custom-toast-uniform {
        min-width: 280px;
        max-width: 92vw;
      }

      .toast-container {
        padding: 8px;
      }

      .toast-message {
        font-size: 0.88em;
        padding: 10px 14px;
      }

      .toast-button {
        width: 28px;
        height: 28px;
        min-width: 28px;
      }

      .toast-button-icon {
        font-size: 16px;
      }
    }

    @media (max-width: 480px) {
      .toast-wrapper {
        bottom: 10px;
        max-width: 95vw;
      }

      .custom-toast-uniform {
        min-width: 260px;
      }

      .toast-message {
        font-size: 0.85em;
        padding: 8px 12px;
      }
    }
  `]
})
export class ToastComponent implements OnInit {
  private toastService = inject(ToastService);
  toasts: Toast[] = [];

  ngOnInit() {
    this.toastService.toasts.subscribe(toasts => {
      this.toasts = toasts;
    });
  }

  closeToast(id: number) {
    this.toastService.remove(id);
  }

  trackByToastId(index: number, toast: Toast): number {
    return toast.id;
  }
}