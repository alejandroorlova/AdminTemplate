import { TemplateRef } from '@angular/core';

export interface TableColumn {
  key: string;
  title: string;
  type: 'text' | 'number' | 'date' | 'badge' | 'avatar' | 'actions' | 'boolean' | 'custom';
  width?: string;
  minWidth?: string;
  sortable?: boolean;
  filterable?: boolean;
  sticky?: boolean;
  align?: 'left' | 'center' | 'right';
  template?: TemplateRef<any>;
  cellTemplate?: TemplateRef<any>;
  format?: string | ((value: any, row: any) => string);
  badge?: { colors: { [key: string]: string } };
  avatar?: { fallbackIcon?: string };
}

export interface TableAction {
  key: string;
  label: string;
  icon?: string;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  disabled?: (row: any) => boolean;
  hidden?: (row: any) => boolean;
  tooltip?: string;
}

export interface TableConfig {
  selectable?: boolean;
  multiSelect?: boolean;
  hoverable?: boolean;
  striped?: boolean;
  bordered?: boolean;
  compact?: boolean;
  stickyHeader?: boolean;
  headerStyle?: 'primary' | 'glass' | 'gradient' | 'soft';
  pagination?: { enabled: boolean; pageSize: number; pageSizeOptions?: number[]; showSizeSelector?: boolean };
  sorting?: { enabled: boolean; defaultSort?: { column: string; direction: 'asc' | 'desc' } };
  filtering?: { enabled: boolean; globalSearch?: boolean; columnFilters?: boolean };
  actions?: { position: 'start' | 'end'; width?: string; sticky?: boolean };
}

export interface TableSort { column: string; direction: 'asc' | 'desc' }
export interface TableFilter { column: string; value: any; operator?: 'equals' | 'contains' | 'startsWith' | 'endsWith' | 'greaterThan' | 'lessThan' }
export interface TableState { currentPage: number; pageSize: number; totalItems: number; sort?: TableSort; filters: TableFilter[]; globalSearch?: string; selectedRows: any[] }
export interface TableEvent { type: 'sort' | 'filter' | 'page' | 'select' | 'action' | 'rowClick'; data: any }

