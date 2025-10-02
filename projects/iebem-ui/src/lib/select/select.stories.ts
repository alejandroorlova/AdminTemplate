import type { Meta, StoryObj } from '@storybook/angular';
import { SelectComponent } from './select.component';
import { FormsModule } from '@angular/forms';

const meta: Meta<SelectComponent> = {
  title: 'Components/Select',
  component: SelectComponent,
  tags: ['autodocs'],
  decorators: [
    (storyFunc) => ({
      moduleMetadata: { imports: [FormsModule, SelectComponent] },
      template: storyFunc().template,
      props: storyFunc().props
    })
  ],
  args: {
    label: 'País',
    placeholder: 'Selecciona un país',
    required: false,
    disabled: false,
    options: [
      { value: 'mx', label: 'México' },
      { value: 'us', label: 'Estados Unidos' },
      { value: 'es', label: 'España' }
    ]
  }
};

export default meta;
type Story = StoryObj<SelectComponent>;

export const Basic: Story = {
  render: (args) => ({
    props: { ...args, value: 'mx' },
    template: `
      <app-iebem-select [label]="label" [placeholder]="placeholder" [options]="options" [(ngModel)]="value"></app-iebem-select>
      <div class="text-sm text-gray-600 mt-2">Valor: {{ value }}</div>
    `
  })
};

