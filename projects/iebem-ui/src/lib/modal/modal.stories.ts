import type { Meta, StoryObj } from '@storybook/angular';
import { ModalComponent, type ModalButton, type ModalConfig } from './modal.component';

const meta: Meta<ModalComponent> = {
  title: 'Components/Modal',
  component: ModalComponent,
  tags: ['autodocs'],
  args: {
    title: 'Título del modal',
    subtitle: 'Descripción breve',
    icon: 'fa-info-circle',
    config: { size: 'md', centered: true, backdrop: true, closable: true } as ModalConfig,
    buttons: [
      { label: 'Cancelar', action: 'cancel', type: 'secondary' },
      { label: 'Guardar', action: 'save', type: 'primary' }
    ] as ModalButton[]
  }
};

export default meta;
type Story = StoryObj<ModalComponent>;

export const Basic: Story = {
  render: (args) => ({
    props: { ...args, isOpen: false },
    template: `
      <button class="btn-primary btn-sm" (click)="isOpen=true">Abrir modal</button>
      <app-iebem-modal [isOpen]="isOpen" [title]="title" [subtitle]="subtitle" [icon]="icon" [config]="config" [buttons]="buttons" (closed)="isOpen=false">
        <p>Contenido de ejemplo dentro del modal.</p>
      </app-iebem-modal>
    `
  })
};

