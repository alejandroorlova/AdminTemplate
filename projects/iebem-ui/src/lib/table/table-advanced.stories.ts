import type { Meta, StoryObj } from '@storybook/angular';
import { Component, TemplateRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent } from './table.component';
import type { TableColumn, TableAction, TableConfig } from './table.interfaces';

@Component({
  selector: 'app-table-advanced-host',
  standalone: true,
  imports: [CommonModule, TableComponent],
  template: `
    <ng-template #roleTpl let-value let-row="row">
      <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs"
        [ngClass]="{
          'bg-green-100 text-green-700': value==='Admin',
          'bg-blue-100 text-blue-700': value==='User',
          'bg-purple-100 text-purple-700': value==='Editor'
        }"
      >
        <i class="fas fa-user-shield mr-1" *ngIf="value==='Admin'"></i>
        <i class="fas fa-user mr-1" *ngIf="value==='User'"></i>
        <i class="fas fa-pen mr-1" *ngIf="value==='Editor'"></i>
        {{ value }}
      </span>
    </ng-template>

    <ng-template #activeTpl let-value>
      <span class="inline-flex items-center gap-1">
        <i class="fas" [ngClass]="value ? 'fa-check text-green-600' : 'fa-times text-red-600'"></i>
        <span class="text-sm">{{ value ? 'Sí' : 'No' }}</span>
      </span>
    </ng-template>

    <app-iebem-table [title]="'Empleados'" [subtitle]="'Con celdas personalizadas'"
      [columns]="columns" [data]="data" [config]="config" [actions]="actions"></app-iebem-table>
  `
})
class TableAdvancedHostComponent implements AfterViewInit {
  @ViewChild('roleTpl', { static: true }) roleTpl!: TemplateRef<any>;
  @ViewChild('activeTpl', { static: true }) activeTpl!: TemplateRef<any>;

  data = [
    { id: 1, name: 'Ana López', role: 'Admin', active: true },
    { id: 2, name: 'Carlos Ruiz', role: 'User', active: false },
    { id: 3, name: 'María Pérez', role: 'Editor', active: true },
  ];

  columns: TableColumn[] = [];
  actions: TableAction[] = [
    { key: 'view', label: 'Ver', icon: 'eye', color: 'secondary', tooltip: 'Ver detalle' },
    { key: 'edit', label: 'Editar', icon: 'edit', color: 'primary', tooltip: 'Editar registro' },
  ];
  config: TableConfig = { hoverable: true, striped: true, filtering: { enabled: false }, sorting: { enabled: true } };

  ngAfterViewInit(): void {
    this.columns = [
      { key: 'id', title: 'ID', type: 'number', sortable: true, width: '80px', align: 'right' },
      { key: 'name', title: 'Nombre', type: 'text', sortable: true },
      { key: 'role', title: 'Rol', type: 'custom', cellTemplate: this.roleTpl },
      { key: 'active', title: 'Activo', type: 'custom', cellTemplate: this.activeTpl, align: 'center' },
    ];
  }
}

const meta: Meta<TableAdvancedHostComponent> = {
  title: 'Components/Table/Advanced',
  component: TableAdvancedHostComponent,
  tags: ['autodocs']
};

export default meta;
type Story = StoryObj<TableAdvancedHostComponent>;

export const CustomCellsAndTooltips: Story = {};

