import type { Meta, StoryObj } from '@storybook/angular';
import { ButtonComponent } from './button.component';

const meta: Meta<ButtonComponent> = {
  title: 'Components/Button',
  component: ButtonComponent,
  tags: ['autodocs'],
  args: {
    label: 'Guardar',
    variant: 'primary',
    size: 'md',
    disabled: false,
    loading: false,
    icon: '',
    iconPosition: 'left',
    rounded: false,
    shadow: true,
  }
};

export default meta;
type Story = StoryObj<ButtonComponent>;

export const Basic: Story = {};

export const WithIcon: Story = {
  args: { icon: 'fas fa-save' }
};

export const Variants: Story = {
  render: (args) => ({
    props: args,
    template: `
      <div class="flex flex-wrap gap-3">
        <app-iebem-button label="Primary" variant="primary"></app-iebem-button>
        <app-iebem-button label="Secondary" variant="secondary"></app-iebem-button>
        <app-iebem-button label="Success" variant="success"></app-iebem-button>
        <app-iebem-button label="Warning" variant="warning"></app-iebem-button>
        <app-iebem-button label="Danger" variant="danger"></app-iebem-button>
        <app-iebem-button label="Info" variant="info"></app-iebem-button>
        <app-iebem-button label="Outline" variant="outline-primary"></app-iebem-button>
        <app-iebem-button label="Ghost" variant="ghost"></app-iebem-button>
        <app-iebem-button label="Link" variant="link"></app-iebem-button>
        <app-iebem-button label="Gradient" variant="gradient"></app-iebem-button>
      </div>
    `
  })
};

