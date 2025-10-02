import type { Meta, StoryObj } from '@storybook/angular';
import { InputComponent } from './input.component';
import { FormsModule } from '@angular/forms';

const meta: Meta<InputComponent> = {
  title: 'Components/Input',
  component: InputComponent,
  tags: ['autodocs'],
  decorators: [
    (storyFunc) => ({
      moduleMetadata: { imports: [FormsModule, InputComponent] },
      template: storyFunc().template,
      props: storyFunc().props
    })
  ],
  args: {
    label: 'Nombre',
    placeholder: 'Escribe tu nombre',
    type: 'text',
    uppercase: false,
    disabled: false,
    required: false,
    error: '',
    hint: 'Texto de ayuda'
  }
};

export default meta;
type Story = StoryObj<InputComponent>;

export const Basic: Story = {
  render: (args) => ({
    props: { ...args, value: '' },
    template: `
      <app-iebem-input [label]="label" [placeholder]="placeholder" [type]="type" [(ngModel)]="value"></app-iebem-input>
      <div class="text-sm text-gray-600 mt-2">Valor: {{ value }}</div>
    `
  })
};

export const Password: Story = {
  args: { label: 'Contraseña', type: 'password', placeholder: '••••••••' }
};

