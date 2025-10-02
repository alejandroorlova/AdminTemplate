import type { Meta, StoryObj } from '@storybook/angular';
import { ModernSelectComponent, type SelectOption } from './modern-select.component';
import { FormsModule } from '@angular/forms';

const meta: Meta<ModernSelectComponent> = {
  title: 'Components/ModernSelect',
  component: ModernSelectComponent,
  tags: ['autodocs'],
  decorators: [
    (story) => ({
      moduleMetadata: { imports: [FormsModule, ModernSelectComponent] },
      template: story().template,
      props: story().props
    })
  ],
  args: {
    label: 'Ciudad',
    placeholder: 'Selecciona una ciudad',
    searchable: true,
    options: [
      { value: 'cuernavaca', label: 'Cuernavaca', icon: 'fa-city', description: 'Morelos' },
      { value: 'cdmx', label: 'Ciudad de México', icon: 'fa-building', description: 'CDMX' },
      { value: 'puebla', label: 'Puebla', icon: 'fa-landmark', description: 'Puebla' }
    ] as SelectOption[]
  }
};

export default meta;
type Story = StoryObj<ModernSelectComponent>;

export const Basic: Story = {};

export const DisabledOptions: Story = {
  args: {
    options: [
      { value: 'cuernavaca', label: 'Cuernavaca', description: 'Morelos' },
      { value: 'cdmx', label: 'Ciudad de México', description: 'CDMX', disabled: true },
      { value: 'puebla', label: 'Puebla', description: 'Puebla' }
    ]
  }
};

export const WithModel: Story = {
  render: (args) => ({
    props: { ...args, value: 'cdmx' },
    template: `
      <app-iebem-modern-select [label]="label" [placeholder]="placeholder" [options]="options" [searchable]="true" [(ngModel)]="value"></app-iebem-modern-select>
      <div class="text-sm text-gray-600 mt-2">Valor: {{ value }}</div>
    `
  })
};
