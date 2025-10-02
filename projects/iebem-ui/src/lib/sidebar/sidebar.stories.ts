import type { Meta, StoryObj } from '@storybook/angular';
import { SidebarComponent, type SidebarConfig } from './sidebar.component';

const meta: Meta<SidebarComponent> = {
  title: 'Components/Sidebar',
  component: SidebarComponent,
  tags: ['autodocs'],
  decorators: [],
  args: {
    isOpen: true,
    config: {
      logo: { icon: 'graduation-cap', title: 'IEBEM', subtitle: 'Admin Panel' },
      version: '2.1.0',
      collapsible: true,
      persistCollapsedState: false,
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: 'chart-line' },
        { id: 'employees', label: 'Empleados', icon: 'users', children: [
          { id: 'list', label: 'Lista', icon: 'address-book' },
          { id: 'add', label: 'Nuevo', icon: 'user-plus' }
        ]},
        { id: 'settings', label: 'Configuración', icon: 'cog' }
      ]
    } as SidebarConfig
  }
};

export default meta;
type Story = StoryObj<SidebarComponent>;

export const Basic: Story = {
  render: (args) => ({
    props: args,
    template: `
      <div class="flex h-[480px]">
        <app-iebem-sidebar [isOpen]="isOpen" [config]="config" style="width: 280px;"></app-iebem-sidebar>
        <div class="flex-1 p-6">Contenido</div>
      </div>
    `
  })
};
