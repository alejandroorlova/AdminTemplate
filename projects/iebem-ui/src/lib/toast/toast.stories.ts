import type { Meta, StoryObj } from '@storybook/angular';
import { Component, inject } from '@angular/core';
import { ToastContainerComponent, ToastService } from 'iebem-ui';

@Component({
  selector: 'app-toast-host',
  standalone: true,
  imports: [ToastContainerComponent],
  template: `
    <div class="flex flex-col gap-3">
      <div class="flex gap-2">
        <button class="btn-primary btn-sm" (click)="success()">Success</button>
        <button class="btn-info btn-sm" (click)="info()">Info</button>
        <button class="btn-warning btn-sm" (click)="warning()">Warning</button>
        <button class="btn-danger btn-sm" (click)="danger()">Danger</button>
      </div>
      <app-iebem-toast-container></app-iebem-toast-container>
    </div>
  `
})
class ToastHostComponent {
  private toast = inject(ToastService);
  success() { this.toast.success({ title: 'Listo', message: 'Operación exitosa' }); }
  info() { this.toast.info({ title: 'Info', message: 'Mensaje informativo' }); }
  warning() { this.toast.warning({ title: 'Atención', message: 'Revisa los datos' }); }
  danger() { this.toast.danger({ title: 'Error', message: 'Algo salió mal' }); }
}

const meta: Meta<ToastHostComponent> = {
  title: 'Components/Toast',
  component: ToastHostComponent,
  tags: ['autodocs']
};

export default meta;
type Story = StoryObj<ToastHostComponent>;

export const Basic: Story = {};

