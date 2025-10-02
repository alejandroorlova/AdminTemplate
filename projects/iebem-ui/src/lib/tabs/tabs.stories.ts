import type { Meta, StoryObj } from '@storybook/angular';
import { TabsComponent, type TabItem } from './tabs.component';

const meta: Meta<TabsComponent> = {
  title: 'Components/Tabs',
  component: TabsComponent,
  tags: ['autodocs'],
  args: {
    size: 'md',
    fitted: false,
    activeIndex: 0,
    tabs: [
      { label: 'General', icon: 'sliders-h' },
      { label: 'Usuarios', icon: 'users', badge: 3 },
      { label: 'Ajustes', icon: 'cog' }
    ] as TabItem[]
  }
};

export default meta;
type Story = StoryObj<TabsComponent>;

export const Basic: Story = {};

export const Fitted: Story = {
  args: { fitted: true }
};

