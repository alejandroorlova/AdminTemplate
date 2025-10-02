import type { Meta, StoryObj } from '@storybook/angular';
import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent } from './table.component';
import type { TableColumn, TableConfig, TableAction } from './table.interfaces';

@Component({
  selector: 'app-table-filters-host',
  standalone: true,
  imports: [CommonModule, TableComponent],
  template: `
    <div class="flex flex-wrap gap-3 items-end mb-4">
      <div class="flex flex-col">
        <label class="text-xs text-gray-500">Nombre</label>
        <input class="input-default py-2 px-3" placeholder="Filtrar por nombre" [(ngModel)]="name()" (ngModelChange)="name.set($event)" />
      </div>
      <div class="flex flex-col">
        <label class="text-xs text-gray-500">Rol</label>
        <select class="input-default py-2 px-3" [(ngModel)]="role()" (ngModelChange)="role.set($event)">
          <option value="">Todos</option>
          <option>Admin</option>
          <option>User</option>
          <option>Editor</option>
        </select>
      </div>
      <div class="flex items-center gap-2">
        <input id="activeOnly" type="checkbox" class="chk-base chk-sm" [(ngModel)]="activeOnly()" (ngModelChange)="activeOnly.set($event)" />
        <label for="activeOnly" class="text-sm text-gray-700">Solo activos</label>
      </div>
    </div>

    <app-iebem-table [title]="'Usuarios'" [columns]="columns" [data]="filtered()" [config]="config" [actions]="actions"></app-iebem-table>
  `
})
class TableFiltersHostComponent {
  data = [
    { id: 1, name: 'Ana López', role: 'Admin', active: true },
    { id: 2, name: 'Carlos Ruiz', role: 'User', active: false },
    { id: 3, name: 'María Pérez', role: 'Editor', active: true },
    { id: 4, name: 'Luis García', role: 'User', active: true },
    { id: 5, name: 'Elena Torres', role: 'Admin', active: false }
  ];

  columns: TableColumn[] = [
    { key: 'id', title: 'ID', type: 'number', sortable: true, width: '80px', align: 'right' },
    { key: 'name', title: 'Nombre', type: 'text', sortable: true },
    { key: 'role', title: 'Rol', type: 'text' },
    { key: 'active', title: 'Activo', type: 'boolean', align: 'center' }
  ];

  actions: TableAction[] = [
    { key: 'view', label: 'Ver', icon: 'eye', color: 'secondary' }
  ];

  config: TableConfig = { hoverable: true, striped: true, pagination: { enabled: false, pageSize: 10 }, sorting: { enabled: true } };

  name = signal('');
  role = signal('');
  activeOnly = signal(false);

  filtered = computed(() => {
    const q = this.name().toLowerCase().trim();
    const r = this.role();
    const only = this.activeOnly();
    return this.data.filter(row => {
      const byName = !q || String(row.name).toLowerCase().includes(q);
      const byRole = !r || row.role === r;
      const byActive = !only || row.active === true;
      return byName && byRole && byActive;
    });
  });
}

const meta: Meta<TableFiltersHostComponent> = {
  title: 'Components/Table/ColumnFilters',
  component: TableFiltersHostComponent,
  tags: ['autodocs']
};

export default meta;
type Story = StoryObj<TableFiltersHostComponent>;

export const ExternalFilters: Story = {};

