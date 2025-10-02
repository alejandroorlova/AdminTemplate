import type { Meta, StoryObj } from '@storybook/angular';
import { ToggleComponent } from './toggle.component';

const meta: Meta<ToggleComponent> = {
  title: 'Components/Toggle',
  component: ToggleComponent,
  tags: ['autodocs'],
  args: {
    checked: true,
    disabled: false,
    size: 'md',
    label: 'Notificaciones',
    labelPosition: 'right'
  },
  argTypes: {
    checkedChange: { action: 'checkedChange' }
  }
};

export default meta;
type Story = StoryObj<ToggleComponent>;

export const Basic: Story = {};

export const Sizes: Story = {
  render: (args) => ({
    props: args,
    template: `
      <div class="flex items-center gap-6">
        <app-iebem-toggle [checked]="checked" [size]="'sm'" [label]="'Pequeño'"></app-iebem-toggle>
        <app-iebem-toggle [checked]="checked" [size]="'md'" [label]="'Mediano'"></app-iebem-toggle>
        <app-iebem-toggle [checked]="checked" [size]="'lg'" [label]="'Grande'"></app-iebem-toggle>
      </div>
    `
  })
};

export const Disabled: Story = {
  args: {
    disabled: true
  }
};

