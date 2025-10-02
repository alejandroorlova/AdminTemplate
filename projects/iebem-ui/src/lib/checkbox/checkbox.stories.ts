import type { Meta, StoryObj } from '@storybook/angular';
import { CheckboxComponent } from './checkbox.component';

const meta: Meta<CheckboxComponent> = {
  title: 'Components/Checkbox',
  component: CheckboxComponent,
  tags: ['autodocs'],
  args: {
    label: 'Aceptar términos',
    variant: 'primary',
    size: 'md',
    labelPosition: 'right',
    disabled: false,
    checked: false,
    required: false,
  },
};

export default meta;
type Story = StoryObj<CheckboxComponent>;

export const Basic: Story = {};

export const Variants: Story = {
  render: () => ({
    template: `
      <div class="flex flex-col gap-3">
        <app-iebem-checkbox label="Primary" variant="primary"></app-iebem-checkbox>
        <app-iebem-checkbox label="Success" variant="success"></app-iebem-checkbox>
        <app-iebem-checkbox label="Warning" variant="warning"></app-iebem-checkbox>
        <app-iebem-checkbox label="Danger" variant="danger"></app-iebem-checkbox>
        <app-iebem-checkbox label="Info" variant="info"></app-iebem-checkbox>
      </div>
    `
  })
};

