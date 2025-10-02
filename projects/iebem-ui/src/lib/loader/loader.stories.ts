import type { Meta, StoryObj } from '@storybook/angular';
import { LoaderComponent, type LoaderConfig } from './loader.component';

const meta: Meta<LoaderComponent> = {
  title: 'Components/Loader',
  component: LoaderComponent,
  tags: ['autodocs'],
  args: {
    isVisible: true,
    config: { message: 'Cargando...', submessage: 'Por favor espere', type: 'default', size: 'md', theme: 'light' } as LoaderConfig,
  }
};

export default meta;
type Story = StoryObj<LoaderComponent>;

export const Basic: Story = {};

export const Variants: Story = {
  render: (args) => ({
    props: args,
    template: `
      <div class="flex flex-col gap-6">
        <app-iebem-loader [isVisible]="true" [config]="{ type: 'default', message: 'Cargando...' }"></app-iebem-loader>
        <app-iebem-loader [isVisible]="true" [config]="{ type: 'upload', message: 'Subiendo archivo...' }"></app-iebem-loader>
        <app-iebem-loader [isVisible]="true" [config]="{ type: 'processing', message: 'Procesando...' }"></app-iebem-loader>
        <app-iebem-loader [isVisible]="true" [config]="{ type: 'simple', message: 'Cargando...' }"></app-iebem-loader>
      </div>
    `
  })
};

