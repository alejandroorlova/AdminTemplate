import type { Meta, StoryObj } from '@storybook/angular';
import { AlertComponent } from './alert.component';

const meta: Meta<AlertComponent> = {
  title: 'Components/Alert',
  component: AlertComponent,
  tags: ['autodocs'],
  args: {
    title: 'Atención',
    message: 'Este es un mensaje informativo.',
    variant: 'info',
    dismissible: true
  }
};

export default meta;
type Story = StoryObj<AlertComponent>;

export const Basic: Story = {};

export const Variants: Story = {
  render: () => ({
    template: `
      <div class="flex flex-col gap-3">
        <app-iebem-alert title="Éxito" message="Operación correcta" variant="success"></app-iebem-alert>
        <app-iebem-alert title="Info" message="Información útil" variant="info"></app-iebem-alert>
        <app-iebem-alert title="Advertencia" message="Revisa la información" variant="warning"></app-iebem-alert>
        <app-iebem-alert title="Error" message="Ocurrió un problema" variant="danger"></app-iebem-alert>
      </div>
    `
  })
};

