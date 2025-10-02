import type { Meta, StoryObj } from '@storybook/angular';
import { TableComponent } from './table.component';
import type { TableColumn, TableConfig, TableAction } from './table.interfaces';

const data = Array.from({ length: 34 }, (_, i) => ({
  id: i + 1,
  name: `Usuario ${i + 1}`,
  role: i % 3 === 0 ? 'Admin' : i % 3 === 1 ? 'User' : 'Editor',
  active: i % 2 === 0
}));

const meta: Meta<TableComponent> = {
  title: 'Components/Table/InternalPagination',
  component: TableComponent,
  tags: ['autodocs'],
  args: {
    title: 'Usuarios',
    subtitle: 'Paginación integrada del componente',
    columns: [
      { key: 'id', title: 'ID', type: 'number', sortable: true, width: '80px', align: 'right' },
      { key: 'name', title: 'Nombre', type: 'text', sortable: true },
      { key: 'role', title: 'Rol', type: 'text' },
      { key: 'active', title: 'Activo', type: 'boolean', align: 'center' }
    ] as TableColumn[],
    data,
    config: {
      hoverable: true,
      striped: true,
      pagination: { enabled: true, pageSize: 5 },
      sorting: { enabled: true },
      filtering: { enabled: true, globalSearch: true }
    } as TableConfig,
    actions: [
      { key: 'view', label: 'Ver', icon: 'eye', color: 'secondary' }
    ] as TableAction[]
  }
};

export default meta;
type Story = StoryObj<TableComponent>;

export const Basic: Story = {};

