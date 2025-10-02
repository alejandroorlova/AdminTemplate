import type { Meta, StoryObj } from '@storybook/angular';
import { Component } from '@angular/core';
import { ModalComponent, type ModalButton, type ModalConfig } from './modal.component';

@Component({
  selector: 'app-modal-advanced-host',
  standalone: true,
  imports: [ModalComponent],
  template: `
    <button class="btn-primary btn-sm" (click)="open()">Abrir modal con loading</button>
    <app-iebem-modal [isOpen]="isOpen" [title]="'Guardar cambios'" [subtitle]="'Confirma la acción'" [config]="config"
      [buttons]="buttons" (buttonClick)="onAction($event)" (closed)="reset()"></app-iebem-modal>
  `
})
class ModalAdvancedHostComponent {
  isOpen = false;
  saving = false;
  config: ModalConfig = { size: 'md', centered: true, backdrop: true, closable: true };
  get buttons(): ModalButton[] {
    return [
      { label: 'Cancelar', action: 'cancel', type: 'secondary', disabled: this.saving },
      { label: this.saving ? 'Guardando...' : 'Guardar', action: 'save', type: 'primary', loading: this.saving }
    ];
  }
  open() { this.isOpen = true; }
  reset() { this.isOpen = false; this.saving = false; }
  onAction(action: string) {
    if (action === 'cancel') { this.reset(); return; }
    if (action === 'save') {
      this.saving = true;
      setTimeout(() => { this.saving = false; this.isOpen = false; }, 1200);
    }
  }
}

const meta: Meta<ModalAdvancedHostComponent> = {
  title: 'Components/Modal/Advanced',
  component: ModalAdvancedHostComponent,
  tags: ['autodocs']
};

export default meta;
type Story = StoryObj<ModalAdvancedHostComponent>;

export const WithLoading: Story = {};

