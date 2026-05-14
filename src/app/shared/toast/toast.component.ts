import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast" *ngIf="mensagem" [class.erro]="ehErro">
      <i class="fas" [class.fa-check-circle]="!ehErro" [class.fa-exclamation-circle]="ehErro"></i>
      {{ mensagem }}
    </div>
  `,
  styles: [`
    .toast {
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      background-color: #27ae60;
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 8px;
      font-weight: bold;
      font-size: 1rem;
      display: flex;
      align-items: center;
      gap: 10px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      z-index: 9999;
      animation: slideIn 0.3s ease;
    }
    .toast.erro {
      background-color: #e74c3c;
    }
    @keyframes slideIn {
      from { opacity: 0; transform: translateY(20px); }
      to   { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class ToastComponent implements OnInit, OnDestroy {
  mensagem: string = '';
  ehErro: boolean = false;
  private sub!: Subscription;
  private timer: any;

  constructor(private cartService: CartService) {}

  ngOnInit() {
    this.sub = this.cartService.notificacao$.subscribe(msg => {
      this.ehErro = msg.toLowerCase().includes('login');
      this.mensagem = msg;
      clearTimeout(this.timer);
      this.timer = setTimeout(() => this.mensagem = '', 3000);
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
    clearTimeout(this.timer);
  }
}
