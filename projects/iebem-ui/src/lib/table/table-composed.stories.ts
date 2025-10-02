import type { Meta, StoryObj } from '@storybook/angular';
import { Component, computed, signal } from '@angular/core';
import { TableComponent } from './table.component';
import type { TableColumn, TableConfig, TableAction } from './table.interfaces';
import { PaginationComponent } from '../pagination/pagination.component';

@Component({
  selector: 'app-table-pagination-host',
  standalone: true,
  imports: [TableComponent, PaginationComponent],
  template: `
    <app-iebem-table
      [title]="'Usuarios'"
      [columns]="columns"
      [data]="pagedData()"
      [config]="config"
      [actions]="actions"
    ></app-iebem-table>

    <div class="mt-4 flex justify-end">
      <app-iebem-pagination [totalItems]="masterData.length" [pageSize]="pageSize()" [currentPage]="page()"
        (pageChange)="setPage($event)"></app-iebem-pagination>
    </div>
  `
})
class TablePaginationHostComponent {
  masterData = Array.from({ length: 47 }, (_, i) => ({ id: i + 1, name: `Usuario ${i + 1}`, role: i % 2 ? 'User' : 'Admin', active: i % 3 === 0 }));
  columns: TableColumn[] = [
    { key: 'id', title: 'ID', type: 'number', sortable: true, width: '80px', align: 'right' },
    { key: 'name', title: 'Nombre', type: 'text', sortable: true },
    { key: 'role', title: 'Rol', type: 'badge' },
    { key: 'active', title: 'Activo', type: 'boolean', align: 'center' },
  ];
  actions: TableAction[] = [
    { key: 'view', label: 'Ver', icon: 'eye', color: 'secondary' },
    { key: 'edit', label: 'Editar', icon: 'edit', color: 'primary' }
  ];
  config: TableConfig = { hoverable: true, striped: true, filtering: { enabled: false }, sorting: { enabled: true }, pagination: { enabled: false, pageSize: 10 } };

  page = signal(1);
  pageSize = signal(10);
  pagedData = computed(() => {
    const start = (this.page() - 1) * this.pageSize();
    return this.masterData.slice(start, start + this.pageSize());
  });
  setPage(p: number) { this.page.set(p); }
}

const meta: Meta<TablePaginationHostComponent> = {
  title: 'Components/Table/WithPagination',
  component: TablePaginationHostComponent,
  tags: ['autodocs']
};

export default meta;
type Story = StoryObj<TablePaginationHostComponent>;

export const ExternalPagination: Story = {};
