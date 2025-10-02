import type { Meta, StoryObj } from '@storybook/angular';
import { StepperComponent } from './stepper.component';
import { StepItem } from './stepper.types';

const meta: Meta<StepperComponent> = {
  title: 'Components/Stepper',
  component: StepperComponent,
  tags: ['autodocs'],
  args: {
    steps: [
      { label: 'Cuenta' },
      { label: 'Perfil' },
      { label: 'Confirmación' },
      { label: 'Listo' }
    ] as StepItem[],
    currentIndex: 1,
    size: 'md',
    orientation: 'horizontal',
    clickable: true,
    compact: false
  }
};

export default meta;
type Story = StoryObj<StepperComponent>;

export const Basic: Story = {};

export const WithIcons: Story = {
  args: {
    steps: [
      { label: 'Datos', subtitle: 'Información básica', icon: 'user' },
      { label: 'Dirección', subtitle: 'Domicilio', icon: 'map-marker-alt' },
      { label: 'Pago', subtitle: 'Método', icon: 'credit-card' },
      { label: 'Revisión', subtitle: 'Verifica', icon: 'clipboard-check' }
    ]
  }
};

export const Vertical: Story = {
  args: {
    orientation: 'vertical'
  }
};

export const ErrorState: Story = {
  args: {
    steps: [
      { label: 'Datos', icon: 'user' },
      { label: 'Validación', icon: 'exclamation-triangle', state: 'error' },
      { label: 'Pago', icon: 'credit-card' },
      { label: 'Confirmar', icon: 'check' }
    ]
  }
};

export const Compact: Story = {
  args: {
    compact: true,
    size: 'sm'
  }
};

