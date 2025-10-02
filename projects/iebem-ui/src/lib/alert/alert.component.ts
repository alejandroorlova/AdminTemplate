import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

export type AlertVariant = 'success' | 'info' | 'warning' | 'danger' | 'primary' | 'secondary' | 'accent';

@Component({
  selector: 'app-iebem-alert',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alert.component.html'
})
export class AlertComponent {
  @Input() title = '';
  @Input() message = '';
  @Input() variant: AlertVariant = 'info';
  @Input() dismissible = true;

  @Output() dismissed = new EventEmitter<void>();

  get icon(): string {
    const map: Record<AlertVariant, string> = {
      success: 'fa-check-circle', info: 'fa-info-circle', warning: 'fa-exclamation-triangle', danger: 'fa-times-circle', primary: 'fa-circle-info', secondary: 'fa-circle', accent: 'fa-star'
    } as const;
    return map[this.variant] || 'fa-info-circle';
  }

  containerClass(): string {
    const base = 'w-full rounded-xl px-4 py-3 flex items-start gap-3 border';
    const map: Record<AlertVariant, string> = {
      success: 'bg-green-50 border-green-200 text-green-800',
      info: 'bg-blue-50 border-blue-200 text-blue-800',
      warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
      danger: 'bg-red-50 border-red-200 text-red-800',
      primary: 'bg-iebem-light border-iebem-primary/30 text-iebem-primary',
      secondary: 'bg-gray-50 border-gray-200 text-gray-700',
      accent: 'bg-purple-50 border-purple-200 text-purple-800'
    };
    return `${base} ${map[this.variant]}`;
  }
}

