import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent, TableColumn, TableConfig, TableAction, PaginationComponent } from 'iebem-ui';

@Component({
  selector: 'app-pagination-demo',
  standalone: true,
  imports: [CommonModule, TableComponent, PaginationComponent],
  templateUrl: './paginationdemo.component.html'
})
export class PaginationDemoComponent {
  data = Array.from({ length: 47 }, (_, i) => ({ id: i + 1, name: `Usuario ${i + 1}`, role: i % 2 ? 'User' : 'Admin', active: i % 3 === 0 }));
  columns: TableColumn[] = [
    { key: 'id', title: 'ID', type: 'number', sortable: true, width: '80px', align: 'right' },
    { key: 'name', title: 'Nombre', type: 'text', sortable: true },
    { key: 'role', title: 'Rol', type: 'badge' },
    { key: 'active', title: 'Activo', type: 'boolean', align: 'center' }
  ];
  actions: TableAction[] = [
    { key: 'view', label: 'Ver', icon: 'fas fa-eye', color: 'secondary' },
    { key: 'edit', label: 'Editar', icon: 'fas fa-edit', color: 'primary' }
  ];
  config: TableConfig = { hoverable: true, striped: true, filtering: { enabled: false }, sorting: { enabled: true }, pagination: { enabled: false, pageSize: 10 } };

  page = signal(1);
  pageSize = signal(10);
  pagedData = computed(() => {
    const start = (this.page() - 1) * this.pageSize();
    return this.data.slice(start, start + this.pageSize());
  });
}
