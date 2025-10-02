import type { Meta, StoryObj } from '@storybook/angular';
import { BreadcrumbComponent } from './breadcrumb.component';
import { BreadcrumbItem } from './breadcrumb.types';

const meta: Meta<BreadcrumbComponent> = {
  title: 'Components/Breadcrumb',
  component: BreadcrumbComponent,
  tags: ['autodocs'],
  args: {
    ariaLabel: 'Breadcrumb',
    separator: 'chevron',
    truncate: true,
    items: [
      { label: 'Inicio', icon: 'home' },
      { label: 'Empleados', icon: 'users' },
      { label: 'Lista', icon: 'list' },
    ] as BreadcrumbItem[]
  }
};

export default meta;
type Story = StoryObj<BreadcrumbComponent>;

export const Basic: Story = {};

export const SlashSeparator: Story = {
  args: { separator: 'slash' }
};

export const LongLabels: Story = {
  args: {
    items: [
      { label: 'Configuración', icon: 'cog' },
      { label: 'Preferencias de usuario y notificaciones muy largas' },
      { label: 'Edición' }
    ]
  }
};

