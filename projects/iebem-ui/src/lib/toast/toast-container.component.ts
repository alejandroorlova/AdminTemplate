import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription, timer } from 'rxjs';
import { ToastService } from './toast.service';
import { ToastInternal } from './toast.types';

@Component({
  selector: 'app-iebem-toast-container',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast-container.component.html',
  styleUrls: ['./toast-container.component.scss']
})
export class ToastContainerComponent implements OnDestroy {
  toasts: ToastInternal[] = [];
  sub: Subscription;

  constructor(private toast: ToastService) {
    this.sub = this.toast.toasts$.subscribe(t => this.push(t));
  }

  private push(t: ToastInternal) {
    this.toasts = [...this.toasts, t];
    if (t.duration > 0) {
      timer(t.duration).subscribe(() => this.dismiss(t.id));
    }
  }

  dismiss(id: string) {
    this.toasts = this.toasts.filter(x => x.id !== id);
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}

