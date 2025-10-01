import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StepItem, StepState } from './stepper.types';

type StepperOrientation = 'horizontal' | 'vertical';
type StepperSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-iebem-stepper',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stepper.component.html'
})
export class StepperComponent {
  @Input() steps: StepItem[] = [];
  @Input() currentIndex = 0;
  @Input() orientation: StepperOrientation = 'horizontal';
  @Input() clickable = true;
  @Input() size: StepperSize = 'md';
  @Input() ariaLabel = 'Stepper';
  @Input() showNumbers = true; // muestra número si no hay icono
  @Input() compact = false; // variante compacta: gaps y detalles reducidos

  @Output() currentIndexChange = new EventEmitter<number>();
  @Output() stepSelected = new EventEmitter<number>();

  // tamaños
  sizeCfg = {
    sm: { circle: 'w-6 h-6 text-[10px]', icon: 'text-xs', gap: 'gap-2', label: 'text-xs', sub: 'text-[10px]' },
    md: { circle: 'w-8 h-8 text-xs', icon: 'text-sm', gap: 'gap-3', label: 'text-sm', sub: 'text-xs' },
    lg: { circle: 'w-10 h-10 text-sm', icon: 'text-base', gap: 'gap-3.5', label: 'text-base', sub: 'text-sm' }
  } as const;

  onSelect(index: number) {
    if (!this.clickable) return;
    const step = this.steps[index];
    if (this.isDisabled(step)) return;
    this.currentIndex = index;
    this.currentIndexChange.emit(index);
    this.stepSelected.emit(index);
  }

  isDisabled(step: StepItem): boolean {
    const st = step.state ?? (step.disabled ? 'disabled' : undefined);
    return st === 'disabled' || !!step.disabled;
  }

  stateFor(index: number, step: StepItem): StepState {
    if (step.state) return step.state;
    if (this.isDisabled(step)) return 'disabled';
    if (index < this.currentIndex) return 'completed';
    if (index === this.currentIndex) return 'active';
    return 'pending';
  }

  circleClass(index: number, step: StepItem): string {
    const s = this.stateFor(index, step);
    const base = `flex items-center justify-center rounded-full border transition-all duration-150 ${this.sizeCfg[this.size].circle}`;
    const hover = this.clickable && !this.isDisabled(step) ? ' group-hover:ring-2 group-hover:ring-iebem-primary/20' : '';
    switch (s) {
      case 'completed':
        return base + ' bg-iebem-primary border-iebem-primary text-white' + hover;
      case 'active':
        return base + ' bg-white border-2 border-iebem-primary text-iebem-primary shadow-sm' + hover;
      case 'disabled':
        return base + ' bg-gray-100 border-gray-200 text-gray-300 opacity-70 cursor-not-allowed';
      case 'error':
        return base + ' bg-danger border-danger text-white' + hover;
      default:
        return base + ' bg-gray-100 border-gray-300 text-gray-400' + hover;
    }
  }

  numberClass(): string {
    if (!this.compact) return '';
    switch (this.size) {
      case 'sm':
        return 'text-[9px]';
      case 'lg':
        return 'text-xs';
      default:
        return 'text-[11px]';
    }
  }

  labelClass(index: number, step: StepItem): string {
    const s = this.stateFor(index, step);
    const base = `font-medium ${this.sizeCfg[this.size].label}`;
    switch (s) {
      case 'active':
        return base + ' text-iebem-primary';
      case 'error':
        return base + ' text-danger';
      case 'disabled':
        return base + ' text-gray-400';
      default:
        return base + ' text-gray-700';
    }
  }

  connectorClass(index: number): string {
    const completed = index < this.currentIndex;
    if (this.orientation === 'vertical') {
      const bg = completed ? 'bg-iebem-primary' : 'bg-gray-200';
      const h = this.compact ? 'h-6' : 'h-8';
      // Centrar bajo el círculo según tamaño; en compacto reducimos ligeramente por el scale-90
      const ml = this.compact
        ? (this.size === 'sm' ? 'ml-2' : this.size === 'lg' ? 'ml-4' : 'ml-3')
        : (this.size === 'sm' ? 'ml-3' : this.size === 'lg' ? 'ml-5' : 'ml-4');
      return `${bg} w-[2px] ${h} ${ml}`;
    }
    const bg = completed ? 'bg-iebem-primary' : 'bg-gray-200';
    // Horizontal: aplicar margen lateral; en compacto usar un paso menos
    const mx = this.compact
      ? (this.size === 'sm' ? 'mx-2' : this.size === 'lg' ? 'mx-4' : 'mx-3')
      : (this.size === 'sm' ? 'mx-3' : this.size === 'lg' ? 'mx-5' : 'mx-4');
    return `${bg} h-[2px] w-full ${mx}`;
  }
}
