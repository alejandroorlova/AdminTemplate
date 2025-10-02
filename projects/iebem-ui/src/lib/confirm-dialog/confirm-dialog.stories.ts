import type { Meta, StoryObj } from '@storybook/angular';
import { Component, inject } from '@angular/core';
import { ConfirmDialogComponent, ConfirmDialogService } from 'iebem-ui';

@Component({
  selector: 'app-confirm-host',
  standalone: true,
  imports: [ConfirmDialogComponent],
  template: `
    <div class="flex flex-col gap-3">
      <button class="btn-warning btn-sm" (click)="openConfirm()">Abrir confirmación</button>
      <div class="text-sm text-gray-600">Última respuesta: {{ lastAnswer }}</div>
      <app-iebem-confirm-dialog></app-iebem-confirm-dialog>
    </div>
  `
})
class ConfirmHostComponent {
  private confirm = inject(ConfirmDialogService);
  lastAnswer = '—';
  async openConfirm() {
    const ok = await this.confirm.confirm({
      title: 'Confirmar acción',
      message: '¿Deseas continuar?'
    });
    this.lastAnswer = ok ? 'ACEPTADO' : 'CANCELADO';
  }
}

const meta: Meta<ConfirmHostComponent> = {
  title: 'Components/ConfirmDialog',
  component: ConfirmHostComponent,
  tags: ['autodocs']
};

export default meta;
type Story = StoryObj<ConfirmHostComponent>;

export const Basic: Story = {};
