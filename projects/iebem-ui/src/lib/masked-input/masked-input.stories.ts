import type { Meta, StoryObj } from '@storybook/angular';
import { MaskedInputComponent } from './masked-input.component';

const meta: Meta<MaskedInputComponent> = {
  title: 'Components/MaskedInput',
  component: MaskedInputComponent,
  tags: ['autodocs'],
  args: {
    label: 'RFC',
    maskType: 'rfc',
    placeholder: 'XAXX010101000',
    uppercase: true,
    validatePattern: true
  }
};

export default meta;
type Story = StoryObj<MaskedInputComponent>;

export const Basic: Story = {};

export const Phone: Story = {
  args: { label: 'Teléfono', maskType: 'phone', placeholder: '(777) 123-4567', uppercase: false }
};

export const Custom: Story = {
  args: { label: 'Custom', maskType: 'custom', customMask: 'AAAA-0000', placeholder: 'ABCD-1234' }
};

