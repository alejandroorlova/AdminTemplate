import type { Meta, StoryObj } from '@storybook/angular';
import { TableComponent } from './table.component';
import type { TableColumn, TableConfig, TableAction } from './table.interfaces';

const meta: Meta<TableComponent> = {
  title: 'Components/Table',
  component: TableComponent,
  tags: ['autodocs'],
  args: {
    title: 'Empleados',
    subtitle: 'Listado de ejemplo',
    columns: [
      { key: 'id', title: 'ID', type: 'number', sortable: true, width: '80px', align: 'right' },
      { key: 'name', title: 'Nombre', type: 'text', sortable: true },
      { key: 'role', title: 'Rol', type: 'badge' },
      { key: 'active', title: 'Activo', type: 'boolean', align: 'center' },
      { key: 'actions', title: 'Acciones', type: 'actions', width: '140px' }
    ] as TableColumn[],
    data: [
      { id: 1, name: 'Ana López', role: 'Admin', active: true },
      { id: 2, name: 'Carlos Ruiz', role: 'User', active: false },
      { id: 3, name: 'María Pérez', role: 'Editor', active: true }
    ],
    config: {
      hoverable: true,
      striped: true,
      bordered: false,
      compact: false,
      stickyHeader: false,
      headerStyle: 'glass',
      pagination: { enabled: true, pageSize: 10 },
      sorting: { enabled: true },
      filtering: { enabled: true, globalSearch: true }
    } as TableConfig,
    actions: [
      { key: 'view', label: 'Ver', icon: 'fas fa-eye', color: 'info' },
      { key: 'edit', label: 'Editar', icon: 'fas fa-edit', color: 'primary' },
      { key: 'delete', label: 'Eliminar', icon: 'fas fa-trash', color: 'danger' }
    ] as TableAction[]
  }
};

export default meta;
type Story = StoryObj<TableComponent>;

export const Basic: Story = {};

