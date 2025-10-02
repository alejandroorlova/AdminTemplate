import type { Meta, StoryObj } from '@storybook/angular';
import { ModernSelectComponent, type SelectOption } from './modern-select.component';

const manyCities: SelectOption[] = [
  { value: 'cuernavaca', label: 'Cuernavaca', description: 'Morelos' },
  { value: 'cdmx', label: 'Ciudad de México', description: 'CDMX' },
  { value: 'puebla', label: 'Puebla', description: 'Puebla' },
  { value: 'monterrey', label: 'Monterrey', description: 'Nuevo León' },
  { value: 'guadalajara', label: 'Guadalajara', description: 'Jalisco' },
  { value: 'queretaro', label: 'Querétaro', description: 'Querétaro' },
  { value: 'toluca', label: 'Toluca', description: 'Edo. de México' },
  { value: 'merida', label: 'Mérida', description: 'Yucatán' },
  { value: 'cancun', label: 'Cancún', description: 'Quintana Roo' },
  { value: 'morelia', label: 'Morelia', description: 'Michoacán' }
];

const meta: Meta<ModernSelectComponent> = {
  title: 'Components/ModernSelect/Advanced',
  component: ModernSelectComponent,
  tags: ['autodocs'],
  args: {
    label: 'Ciudad',
    placeholder: 'Busca una ciudad',
    searchable: true,
    options: manyCities
  }
};

export default meta;
type Story = StoryObj<ModernSelectComponent>;

export const SearchAndEmptyState: Story = {
  args: {
    options: manyCities
  }
};

