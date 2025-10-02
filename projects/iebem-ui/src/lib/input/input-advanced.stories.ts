import type { Meta, StoryObj } from '@storybook/angular';
import { InputComponent } from './input.component';
import { FormsModule } from '@angular/forms';

const meta: Meta<InputComponent> = {
  title: 'Components/Input/Advanced',
  component: InputComponent,
  tags: ['autodocs'],
  decorators: [
    (story) => ({
      moduleMetadata: { imports: [FormsModule, InputComponent] },
      template: story().template,
      props: story().props
    })
  ],
  args: {
    label: 'Usuario',
    placeholder: 'Escribe tu usuario',
    type: 'text',
    icon: 'fas fa-user',
    suffixIcon: '',
    hint: 'Debe tener entre 4 y 20 caracteres',
    error: ''
  }
};

export default meta;
type Story = StoryObj<InputComponent>;

export const WithSuffixIcon: Story = {
  args: {
    suffixIcon: 'fas fa-check'
  },
  render: (args) => ({
    props: { ...args, value: '' },
    template: `
      <app-iebem-input [label]="label" [placeholder]="placeholder" [type]="type" [icon]="icon" [suffixIcon]="suffixIcon" [(ngModel)]="value"></app-iebem-input>
    `
  })
};

export const ErrorState: Story = {
  args: {
    error: 'El campo es obligatorio'
  }
};

export const PasswordToggle: Story = {
  args: {
    label: 'Contraseña',
    type: 'password',
    placeholder: '••••••••'
  }
};

