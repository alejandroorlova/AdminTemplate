import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StepperComponent, StepItem } from 'iebem-ui';

@Component({
  selector: 'app-stepper-demo',
  standalone: true,
  imports: [CommonModule, StepperComponent],
  templateUrl: './stepper.component.html'
})
export class StepperDemoComponent {
  current = signal(1);

  stepsBasic: StepItem[] = [
    { label: 'Cuenta' },
    { label: 'Perfil' },
    { label: 'Confirmación' },
    { label: 'Listo' }
  ];

  stepsIcons: StepItem[] = [
    { label: 'Datos', subtitle: 'Información básica', icon: 'user' },
    { label: 'Dirección', subtitle: 'Domicilio', icon: 'map-marker-alt' },
    { label: 'Pago', subtitle: 'Método', icon: 'credit-card' },
    { label: 'Revisión', subtitle: 'Verifica', icon: 'clipboard-check' }
  ];

  stepsDisabled: StepItem[] = [
    { label: 'Inicio', icon: 'home' },
    { label: 'Opciones', icon: 'sliders-h', disabled: true },
    { label: 'Detalles', icon: 'list' },
    { label: 'Final', icon: 'flag-checkered' }
  ];

  stepsError: StepItem[] = [
    { label: 'Datos', icon: 'user' },
    { label: 'Validación', icon: 'exclamation-triangle', state: 'error' },
    { label: 'Pago', icon: 'credit-card' },
    { label: 'Confirmar', icon: 'check' }
  ];

  setStep(i: number) {
    this.current.set(i);
  }

  private clamp(v: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, v));
  }

  prev() {
    const max = this.stepsBasic.length - 1;
    this.setStep(this.clamp(this.current() - 1, 0, max));
  }

  next() {
    const max = this.stepsBasic.length - 1;
    this.setStep(this.clamp(this.current() + 1, 0, max));
  }
}
