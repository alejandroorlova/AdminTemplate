import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

type ToggleSize = 'sm' | 'md' | 'lg';
type LabelPosition = 'left' | 'right';

@Component({
  selector: 'app-iebem-toggle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toggle.component.html'
})
export class ToggleComponent {
  @Input() checked = false;
  @Output() checkedChange = new EventEmitter<boolean>();

  @Input() disabled = false;
  @Input() size: ToggleSize = 'md';
  @Input() label?: string;
  @Input() labelPosition: LabelPosition = 'right';
  @Input() onLabel?: string;
  @Input() offLabel?: string;
  @Input() ariaLabel = 'Toggle';
  @Input() name?: string;
  @Input() id?: string;

  // clases por tamaño
  sizeCfg = {
    // Dejar un pequeño margen (≈2px) al extremo derecho
    sm: { track: 'w-9 h-5',  thumb: 'w-4 h-4', translate: 'translate-x-[14px]', gap: 'gap-2',   label: 'text-xs' }, // 36-16-2 - 4 = 14
    md: { track: 'w-11 h-6', thumb: 'w-5 h-5', translate: 'translate-x-[18px]', gap: 'gap-3',   label: 'text-sm' }, // 44-20-2 - 4 = 18
    lg: { track: 'w-14 h-8', thumb: 'w-7 h-7', translate: 'translate-x-[22px]', gap: 'gap-3.5', label: 'text-base' }  // 56-28-2 - 4 = 22
  } as const;

  toggle(): void {
    if (this.disabled) return;
    this.checked = !this.checked;
    this.checkedChange.emit(this.checked);
  }

  @HostListener('keydown', ['$event'])
  onKeydown(e: KeyboardEvent) {
    if (this.disabled) return;
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      this.toggle();
    }
  }

  trackClass(): string {
    const base = `relative rounded-full transition-colors duration-150 ${this.sizeCfg[this.size].track}`;
    const on = this.checked ? ' bg-iebem-primary' : ' bg-gray-300';
    const disabled = this.disabled ? ' opacity-60 cursor-not-allowed' : ' cursor-pointer';
    return base + on + disabled;
  }

  thumbClass(): string {
    const base = `absolute top-1/2 -translate-y-1/2 left-1 bg-white rounded-full shadow-sm transition-transform duration-150 ${this.sizeCfg[this.size].thumb}`;
    const pos = this.checked ? this.sizeCfg[this.size].translate : 'translate-x-0';
    return `${base} ${pos}`;
  }

  labelClass(): string {
    return `text-gray-700 select-none ${this.sizeCfg[this.size].label}`;
  }
}
