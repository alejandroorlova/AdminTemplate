import type { Meta, StoryObj } from '@storybook/angular';
import { DatePickerComponent } from './date-picker.component';
import { FormsModule } from '@angular/forms';

const meta: Meta<DatePickerComponent> = {
  title: 'Components/DatePicker',
  component: DatePickerComponent,
  tags: ['autodocs'],
  decorators: [
    (storyFunc) => ({
      moduleMetadata: { imports: [FormsModule, DatePickerComponent] },
      template: storyFunc().template,
      props: storyFunc().props
    })
  ],
  args: {
    label: 'Fecha',
    placeholder: 'Seleccionar fecha',
    clearable: true,
    disabled: false
  }
};

export default meta;
type Story = StoryObj<DatePickerComponent>;

export const Basic: Story = {
  render: (args) => ({
    props: { ...args, value: '' },
    template: `
      <app-iebem-date-picker [label]="label" [placeholder]="placeholder" [(ngModel)]="value"></app-iebem-date-picker>
      <div class="text-sm text-gray-600 mt-2">Valor: {{ value }}</div>
    `
  })
};

