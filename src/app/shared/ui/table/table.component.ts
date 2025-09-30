// table.component.ts
import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
  SimpleChanges,
  ChangeDetectionStrategy,
  TemplateRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableUtils } from '../../utils/table.utils';
import { TableColumn, TableConfig, TableAction } from './table.interfaces';
export type { TableColumn, TableConfig, TableAction } from './table.interfaces';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']  // Archivo vacío, solo Tailwind
})
export class TableComponent implements OnInit, OnChanges {

  // Inputs principales
  @Input() data: any[] = [];
  @Input() columns: TableColumn[] = [];
  @Input() config: TableConfig = {};
  @Input() actions: TableAction[] = [];
  @Input() loading: boolean = false;

  // Labels
  @Input() title: string = '';
  @Input() subtitle: string = '';
  @Input() emptyMessage: string = 'No hay datos disponibles';

  // Outputs
  @Output() rowClick = new EventEmitter<any>();
  @Output() actionClick = new EventEmitter<{ action: TableAction, row: any }>();
  @Output() sortChange = new EventEmitter<{ column: string, direction: 'asc' | 'desc' }>();
  @Output() filterChange = new EventEmitter<string>();
  @Output() pageChange = new EventEmitter<number>();

  // Estado interno
  processedData: any[] = [];
  currentPage: number = 1;
  pageSize: number = 10;
  totalItems: number = 0;
  globalSearch: string = '';
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  ngOnInit() {
    this.initializeConfig();
    this.updateProcessedData();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data'] || changes['config']) {
      this.updateProcessedData();
    }
  }

  private initializeConfig() {
    // Configuración por defecto
    this.config = {
      hoverable: true,
      striped: false,
      bordered: false,
      compact: false,
      stickyHeader: false,
      pagination: {
        enabled: true,
        pageSize: 10
      },
      sorting: {
        enabled: true
      },
      filtering: {
        enabled: true,
        globalSearch: true
      },
      ...this.config
    };

    this.pageSize = this.config.pagination?.pageSize || 10;
  }

  private updateProcessedData() {
    let result = [...this.data];

    // Aplicar búsqueda global
    if (this.globalSearch && this.config.filtering?.globalSearch) {
      result = this.applyGlobalSearch(result);
    }

    // Aplicar ordenamiento
    if (this.sortColumn && this.config.sorting?.enabled) {
      result = this.applySort(result);
    }

    // Actualizar total
    this.totalItems = result.length;

    // Aplicar paginación
    if (this.config.pagination?.enabled) {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      result = result.slice(start, end);
    }

    this.processedData = result;
  }

  private applyGlobalSearch(data: any[]): any[] {
    const searchTerm = this.globalSearch.toLowerCase();

    return data.filter(row => {
      return this.columns.some(column => {
        const value = this.getColumnValue(row, column.key);
        return value?.toString().toLowerCase().includes(searchTerm);
      });
    });
  }

  private applySort(data: any[]): any[] {
    return data.sort((a, b) => {
      const aVal = this.getColumnValue(a, this.sortColumn);
      const bVal = this.getColumnValue(b, this.sortColumn);

      let result = 0;
      if (aVal < bVal) result = -1;
      else if (aVal > bVal) result = 1;

      return this.sortDirection === 'desc' ? -result : result;
    });
  }

  // Métodos públicos para eventos
  onSort(columnKey: string) {
    if (!this.config.sorting?.enabled) return;

    if (this.sortColumn === columnKey) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = columnKey;
      this.sortDirection = 'asc';
    }

    this.updateProcessedData();
    this.sortChange.emit({ column: columnKey, direction: this.sortDirection });
  }

  onGlobalSearch() {
    this.currentPage = 1;
    this.updateProcessedData();
    this.filterChange.emit(this.globalSearch);
  }

  onPageChange(page: number) {
    this.currentPage = Math.max(1, Math.min(page, this.getTotalPages()));
    this.updateProcessedData();
    this.pageChange.emit(this.currentPage);
  }

  onRowClick(row: any) {
    this.rowClick.emit(row);
  }

  onAction(action: TableAction, row: any, event: Event) {
    event.stopPropagation();
    this.actionClick.emit({ action, row });
  }

  // Métodos de utilidad
  getColumnValue(row: any, key: string): any {
    return key.split('.').reduce((obj, prop) => obj?.[prop], row);
  }

  getTotalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }

  getStartRecord(): number {
    return (this.currentPage - 1) * this.pageSize + 1;
  }

  getEndRecord(): number {
    return Math.min(this.currentPage * this.pageSize, this.totalItems);
  }

  getSortIcon(columnKey: string): string {
    if (this.sortColumn === columnKey) {
      return this.sortDirection === 'asc' ? 'fas fa-sort-up text-white' : 'fas fa-sort-down text-white';
    }
    return 'fas fa-sort text-white text-opacity-70';
  }

  formatCellValue(value: any, column: TableColumn): string {
    if (value == null) return '-';

    // NUEVO: prioridad al format explícito
    if (typeof column.format === 'function') {
      return column.format(value, /* row no lo tienes aquí, por eso el HTML custom es mejor para casos complejos */ {} as any);
    }
    if (column.format === 'date') {
      return new Date(value).toLocaleDateString('es-ES');
    }
    if (column.format === 'currency') {
      const num = Number(value) || 0;
      return num.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });
    }

    // lo que ya tenías:
    switch (column.type) {
      case 'date':
        return new Date(value).toLocaleDateString('es-ES');
      case 'number':
        if (typeof value === 'number') {
          if (value > 1000) {
            return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(value);
          }
          return new Intl.NumberFormat('es-ES').format(value);
        }
        return value.toString();
      case 'boolean':
        return value ? 'Activo' : 'Inactivo';
      default:
        return value.toString();
    }
  }


  getCellClasses(column: TableColumn): string {
    let classes = 'px-6 py-4 whitespace-nowrap text-sm';

    if (column.align === 'center') classes += ' text-center';
    if (column.align === 'right') classes += ' text-right';

    return classes;
  }

  getBooleanBadgeClasses(value: any): string {
    const baseClasses = 'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold';

    // Colores usando tu paleta IEBEM
    const statusColors: { [key: string]: string } = {
      'active': 'bg-success bg-opacity-10 text-success',
      'activo': 'bg-success bg-opacity-10 text-success',
      'inactive': 'bg-danger bg-opacity-10 text-danger',
      'inactivo': 'bg-danger bg-opacity-10 text-danger',
      'pending': 'bg-warning bg-opacity-10 text-warning',
      'pendiente': 'bg-warning bg-opacity-10 text-warning',
      'completed': 'bg-iebem-primary bg-opacity-10 text-iebem-primary',
      'completado': 'bg-iebem-primary bg-opacity-10 text-iebem-primary',
      'en_proceso': 'bg-info bg-opacity-10 text-info',
      'proceso': 'bg-info bg-opacity-10 text-info'
    };

    const colorClass = statusColors[value?.toString().toLowerCase()] || 'bg-gray-100 text-gray-800';
    return `${baseClasses} ${colorClass}`;
  }

  getActionClasses(action: TableAction): string {
    const baseClasses = 'inline-flex items-center justify-center rounded-lg transition-all duration-200 hover:shadow-md transform hover:-translate-y-0.5';

    switch (action.color) {
      case 'primary':
        return `${baseClasses} bg-iebem-primary text-white hover:bg-iebem-dark`;
      case 'secondary':
        return `${baseClasses} bg-iebem-secondary text-white hover:bg-opacity-80`;
      case 'danger':
        return `${baseClasses} bg-danger text-white hover:bg-red-600`;
      default:
        return `${baseClasses} bg-gray-600 text-white hover:bg-gray-700`;
    }
  }

  // Track by functions para performance
  trackByColumn(index: number, column: TableColumn): string {
    return column.key;
  }

  trackByRow(index: number, row: any): any {
    return row.id || index;
  }


  // Verificar si una columna es crítica (siempre visible)
  isCriticalColumn(columnKey: string): boolean {
    const criticalColumns = ['firstName', 'lastName', 'email', 'status'];
    return criticalColumns.includes(columnKey);
  }

  // Obtener columnas para vista móvil (solo las más críticas)
  getMobileColumns(): TableColumn[] {
    return this.columns.filter(column =>
      this.isCriticalColumn(column.key)
    );
  }

  // Método helper para obtener la columna por key
  getColumnByKey(key: string): TableColumn | undefined {
    return this.columns.find(col => col.key === key);
  }


  // Métodos simplificados para agregar al table.component.ts

  // Columnas para desktop (las más importantes)
  getDesktopColumns(): TableColumn[] {
    return TableUtils.getDesktopColumns(this.columns);
  }

  getResponsiveWidth(column: TableColumn): string {
    return TableUtils.getResponsiveWidth(column);
  }

  formatMobileValue(value: any, type: string): string {
    return TableUtils.formatMobileValue(value, type);
  }

  getModernBadgeClasses(value: any): string {
    return TableUtils.getBadgeClasses(value);
  }

  getModernActionClasses(action: TableAction): string {
    return TableUtils.getActionClasses(action.color);
  }

  // Nuevo: usar botones estandarizados del sistema
  getActionBtnClasses(action: TableAction): string {
    const size = 'btn-sm';
    const map: Record<string, string> = {
      primary: 'btn-primary',
      secondary: 'btn-secondary',
      danger: 'btn-danger',
      success: 'btn-success',
      warning: 'btn-warning',
      info: 'btn-info',
      dark: 'btn-dark',
      light: 'btn-light'
    };
    const base = map[(action as any).color] || 'btn-outline';
    return `${base} ${size} tbl-action-btn`;
  }

}
