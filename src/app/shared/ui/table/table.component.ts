// table.component.ts
import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
  SimpleChanges,
  ChangeDetectionStrategy
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Interfaces básicas
export interface TableColumn {
  key: string;
  title: string;
  type: 'text' | 'number' | 'date' | 'badge' | 'boolean';
  width?: string;
  sortable?: boolean;
  filterable?: boolean;
  align?: 'left' | 'center' | 'right';
}

export interface TableConfig {
  pagination?: {
    enabled: boolean;
    pageSize: number;
  };
  sorting?: {
    enabled: boolean;
  };
  filtering?: {
    enabled: boolean;
    globalSearch?: boolean;
  };
}

export interface TableAction {
  key: string;
  label: string;
  icon?: string;
  color?: 'primary' | 'secondary' | 'danger';
}

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss'  // Archivo vacío, solo Tailwind
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

    switch (column.type) {
      case 'date':
        return new Date(value).toLocaleDateString('es-ES');
      case 'number':
        if (typeof value === 'number') {
          // Formato para salarios o moneda
          if (value > 1000) {
            return new Intl.NumberFormat('es-MX', {
              style: 'currency',
              currency: 'MXN'
            }).format(value);
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

  getBadgeClasses(value: any): string {
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

  // Métodos adicionales para agregar al table.component.ts

  // Columnas prioritarias para desktop (las más importantes)
  // getDesktopColumns(): TableColumn[] {
  //   // En desktop mostramos las columnas más importantes
  //   const priorityColumns = ['firstName', 'lastName', 'email', 'department', 'position', 'status'];

  //   return this.columns.filter(column =>
  //     priorityColumns.includes(column.key)
  //   );
  // }

  // Obtener ancho responsivo para las columnas
  // getResponsiveWidth(column: TableColumn): string {
  //   const responsiveWidths: { [key: string]: string } = {
  //     'firstName': '120px',
  //     'lastName': '140px',
  //     'email': '180px',
  //     'phone': '120px',
  //     'department': '130px',
  //     'position': '140px',
  //     'salary': '100px',
  //     'hireDate': '100px',
  //     'status': '90px'
  //   };

  //   return responsiveWidths[column.key] || column.width || '120px';
  // }

  // Verificar si una columna es crítica (siempre visible)
  // isCriticalColumn(columnKey: string): boolean {
  //   const criticalColumns = ['firstName', 'lastName', 'email', 'status'];
  //   return criticalColumns.includes(columnKey);
  // }

  // Obtener columnas para vista móvil (solo las más críticas)
  // getMobileColumns(): TableColumn[] {
  //   return this.columns.filter(column =>
  //     this.isCriticalColumn(column.key)
  //   );
  // }

  // Método para formatear datos específicos para mobile
  // formatMobileValue(value: any, column: TableColumn): string {
  //   if (value == null) return '-';

  //   // Para móvil, usar formatos más cortos
  //   switch (column.type) {
  //     case 'date':
  //       return new Date(value).toLocaleDateString('es-ES', {
  //         month: 'short',
  //         day: 'numeric',
  //         year: '2-digit'
  //       });
  //     case 'number':
  //       if (typeof value === 'number' && value > 1000) {
  //         // Formato compacto para móvil
  //         return new Intl.NumberFormat('es-MX', {
  //           style: 'currency',
  //           currency: 'MXN',
  //           notation: 'compact'
  //         }).format(value);
  //       }
  //       return this.formatCellValue(value, column);
  //     default:
  //       return this.formatCellValue(value, column);
  //   }
  // }

  ///////////////////////////////////


  // Métodos adicionales para agregar al table.component.ts

  // Columnas prioritarias para desktop (las más importantes)
  // getDesktopColumns(): TableColumn[] {
  //   // En desktop mostramos las columnas más importantes
  //   const priorityColumns = ['firstName', 'lastName', 'email', 'department', 'position', 'status'];

  //   return this.columns.filter(column =>
  //     priorityColumns.includes(column.key)
  //   );
  // }

  // Obtener ancho responsivo para las columnas
  // getResponsiveWidth(column: TableColumn): string {
  //   const responsiveWidths: { [key: string]: string } = {
  //     'firstName': '120px',
  //     'lastName': '140px',
  //     'email': '180px',
  //     'phone': '120px',
  //     'department': '130px',
  //     'position': '140px',
  //     'salary': '100px',
  //     'hireDate': '100px',
  //     'status': '90px'
  //   };

  //   return responsiveWidths[column.key] || column.width || '120px';
  // }

  // Verificar si una columna es crítica (siempre visible)
  // isCriticalColumn(columnKey: string): boolean {
  //   const criticalColumns = ['firstName', 'lastName', 'email', 'status'];
  //   return criticalColumns.includes(columnKey);
  // }

  // Obtener columnas para vista móvil (solo las más críticas)
  // getMobileColumns(): TableColumn[] {
  //   return this.columns.filter(column =>
  //     this.isCriticalColumn(column.key)
  //   );
  // }

  // Método helper para obtener la columna por key
  // getColumnByKey(key: string): TableColumn | undefined {
  //   return this.columns.find(col => col.key === key);
  // }

  // Método para formatear valores específicos sin necesidad del objeto TableColumn completo
  // formatMobileValue(value: any, type: string): string {
  //   if (value == null) return '-';

  //   switch (type) {
  //     case 'badge':
  //       return value.toString().charAt(0).toUpperCase() + value.toString().slice(1);
  //     case 'date':
  //       return new Date(value).toLocaleDateString('es-ES', {
  //         month: 'short',
  //         day: 'numeric',
  //         year: '2-digit'
  //       });
  //     case 'number':
  //       if (typeof value === 'number' && value > 1000) {
  //         return new Intl.NumberFormat('es-MX', {
  //           style: 'currency',
  //           currency: 'MXN',
  //           notation: 'compact'
  //         }).format(value);
  //       }
  //       return new Intl.NumberFormat('es-ES').format(value);
  //     case 'currency':
  //       return new Intl.NumberFormat('es-MX', {
  //         style: 'currency',
  //         currency: 'MXN'
  //       }).format(value);
  //     default:
  //       return value.toString();
  //   }
  // }

  //-------------------

  // Métodos adicionales para agregar al table.component.ts

  // Columnas prioritarias para desktop (las más importantes)
  // getDesktopColumns(): TableColumn[] {
  //   // En desktop mostramos las columnas más importantes
  //   const priorityColumns = ['firstName', 'lastName', 'email', 'department', 'position', 'status'];

  //   return this.columns.filter(column =>
  //     priorityColumns.includes(column.key)
  //   );
  // }

  // Obtener ancho responsivo para las columnas
  // getResponsiveWidth(column: TableColumn): string {
  //   const responsiveWidths: { [key: string]: string } = {
  //     'firstName': '120px',
  //     'lastName': '140px',
  //     'email': '180px',
  //     'phone': '120px',
  //     'department': '130px',
  //     'position': '140px',
  //     'salary': '100px',
  //     'hireDate': '100px',
  //     'status': '90px'
  //   };

  //   return responsiveWidths[column.key] || column.width || '120px';
  // }

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

  // Método para formatear valores específicos sin necesidad del objeto TableColumn completo
  // formatMobileValue(value: any, type: string): string {
  //   if (value == null) return '-';

  //   switch (type) {
  //     case 'badge':
  //       return value.toString().charAt(0).toUpperCase() + value.toString().slice(1);
  //     case 'date':
  //       return new Date(value).toLocaleDateString('es-ES', {
  //         month: 'short',
  //         day: 'numeric',
  //         year: '2-digit'
  //       });
  //     case 'number':
  //       if (typeof value === 'number' && value > 1000) {
  //         return new Intl.NumberFormat('es-MX', {
  //           style: 'currency',
  //           currency: 'MXN',
  //           notation: 'compact'
  //         }).format(value);
  //       }
  //       return new Intl.NumberFormat('es-ES').format(value);
  //     case 'currency':
  //       return new Intl.NumberFormat('es-MX', {
  //         style: 'currency',
  //         currency: 'MXN'
  //       }).format(value);
  //     default:
  //       return value.toString();
  //   }
  // }

  // Método moderno para badges con colores IEBEM
  // getModernBadgeClasses(value: any): string {
  //   const baseClasses = 'inline-flex items-center px-3 py-2 rounded-xl text-xs font-bold shadow-lg border transition-all duration-300 hover:shadow-xl transform hover:scale-105';

  //   // Colores modernos usando la paleta IEBEM
  //   const statusColors: { [key: string]: string } = {
  //     'active': 'bg-gradient-to-r from-success/20 to-success/10 text-success border-success/30 shadow-success/20',
  //     'activo': 'bg-gradient-to-r from-success/20 to-success/10 text-success border-success/30 shadow-success/20',
  //     'inactive': 'bg-gradient-to-r from-danger/20 to-danger/10 text-danger border-danger/30 shadow-danger/20',
  //     'inactivo': 'bg-gradient-to-r from-danger/20 to-danger/10 text-danger border-danger/30 shadow-danger/20',
  //     'pending': 'bg-gradient-to-r from-warning/20 to-warning/10 text-warning border-warning/30 shadow-warning/20',
  //     'pendiente': 'bg-gradient-to-r from-warning/20 to-warning/10 text-warning border-warning/30 shadow-warning/20',
  //     'completed': 'bg-gradient-to-r from-iebem-primary/20 to-iebem-primary/10 text-iebem-primary border-iebem-primary/30 shadow-iebem-primary/20',
  //     'completado': 'bg-gradient-to-r from-iebem-primary/20 to-iebem-primary/10 text-iebem-primary border-iebem-primary/30 shadow-iebem-primary/20',
  //     'en_proceso': 'bg-gradient-to-r from-info/20 to-info/10 text-info border-info/30 shadow-info/20',
  //     'proceso': 'bg-gradient-to-r from-info/20 to-info/10 text-info border-info/30 shadow-info/20'
  //   };

  //   const colorClass = statusColors[value?.toString().toLowerCase()] || 'bg-gradient-to-r from-iebem-dark/20 to-iebem-dark/10 text-iebem-dark border-iebem-dark/30 shadow-iebem-dark/20';
  //   return `${baseClasses} ${colorClass}`;
  // }

  // Método moderno para acciones con colores IEBEM
  // getModernActionClasses(action: TableAction): string {
  //   const baseClasses = 'inline-flex items-center justify-center border-2 font-bold';

  //   switch (action.color) {
  //     case 'primary':
  //       return `${baseClasses} bg-gradient-to-r from-iebem-primary to-iebem-secondary text-white border-transparent hover:from-iebem-secondary hover:to-iebem-primary shadow-lg shadow-iebem-primary/30`;
  //     case 'secondary':
  //       return `${baseClasses} bg-gradient-to-r from-iebem-secondary to-iebem-gold text-white border-transparent hover:from-iebem-gold hover:to-iebem-secondary shadow-lg shadow-iebem-secondary/30`;
  //     case 'danger':
  //       return `${baseClasses} bg-gradient-to-r from-danger to-red-600 text-white border-transparent hover:from-red-600 hover:to-danger shadow-lg shadow-danger/30`;
  //     default:
  //       return `${baseClasses} bg-gradient-to-r from-iebem-dark to-gray-700 text-white border-transparent hover:from-gray-700 hover:to-iebem-dark shadow-lg shadow-iebem-dark/30`;
  //   }
  // }


  //--------------

  // Métodos simplificados para agregar al table.component.ts

  // Columnas para desktop (las más importantes)
  // getDesktopColumns(): TableColumn[] {
  //   const priorityColumns = ['firstName', 'lastName', 'email', 'department', 'position', 'status'];
  //   return this.columns.filter(column => priorityColumns.includes(column.key));
  // }

  // Ancho responsivo para columnas
  // getResponsiveWidth(column: TableColumn): string {
  //   const widths: { [key: string]: string } = {
  //     'firstName': '120px',
  //     'lastName': '140px',
  //     'email': '180px',
  //     'department': '130px',
  //     'position': '140px',
  //     'status': '90px'
  //   };
  //   return widths[column.key] || column.width || '120px';
  // }

  // Formatear valores para mobile
  // formatMobileValue(value: any, type: string): string {
  //   if (value == null) return '-';

  //   switch (type) {
  //     case 'currency':
  //       return new Intl.NumberFormat('es-MX', {
  //         style: 'currency',
  //         currency: 'MXN'
  //       }).format(value);
  //     default:
  //       return value.toString();
  //   }
  // }

  // Badges modernos con colores IEBEM
  // getModernBadgeClasses(value: any): string {
  //   const baseClasses = 'inline-flex items-center px-3 py-1 rounded-full text-xs font-bold';

  //   const statusColors: { [key: string]: string } = {
  //     'active': 'bg-success bg-opacity-20 text-success',
  //     'activo': 'bg-success bg-opacity-20 text-success',
  //     'inactive': 'bg-danger bg-opacity-20 text-danger',
  //     'inactivo': 'bg-danger bg-opacity-20 text-danger',
  //     'pending': 'bg-warning bg-opacity-20 text-warning',
  //     'pendiente': 'bg-warning bg-opacity-20 text-warning'
  //   };

  //   const colorClass = statusColors[value?.toString().toLowerCase()] || 'bg-gray-100 text-gray-800';
  //   return `${baseClasses} ${colorClass}`;
  // }

  // Acciones modernas con colores IEBEM
  // getModernActionClasses(action: TableAction): string {
  //   const baseClasses = 'border transition-all duration-200 font-medium';

  //   switch (action.color) {
  //     case 'primary':
  //       return `${baseClasses} bg-iebem-primary text-white border-iebem-primary hover:bg-iebem-dark`;
  //     case 'secondary':
  //       return `${baseClasses} bg-iebem-secondary text-white border-iebem-secondary hover:opacity-80`;
  //     case 'danger':
  //       return `${baseClasses} bg-danger text-white border-danger hover:bg-red-600`;
  //     default:
  //       return `${baseClasses} bg-gray-600 text-white border-gray-600 hover:bg-gray-700`;
  //   }
  // }

  //------------------------------

  // Métodos simplificados para agregar al table.component.ts

// Columnas para desktop (las más importantes)
getDesktopColumns(): TableColumn[] {
  const priorityColumns = ['firstName', 'lastName', 'email', 'department', 'position', 'status'];
  return this.columns.filter(column => priorityColumns.includes(column.key));
}

// Ancho responsivo para columnas
getResponsiveWidth(column: TableColumn): string {
  const widths: { [key: string]: string } = {
    'firstName': '120px',
    'lastName': '140px', 
    'email': '180px',
    'department': '130px',
    'position': '140px',
    'status': '90px'
  };
  return widths[column.key] || column.width || '120px';
}

// Formatear valores para mobile
formatMobileValue(value: any, type: string): string {
  if (value == null) return '-';
  
  switch (type) {
    case 'currency':
      return new Intl.NumberFormat('es-MX', { 
        style: 'currency', 
        currency: 'MXN'
      }).format(value);
    default:
      return value.toString();
  }
}

// Badges sólidos con colores IEBEM (sin gradientes)
getModernBadgeClasses(value: any): string {
  const baseClasses = 'inline-flex items-center px-3 py-1 rounded-xl text-xs font-bold';
  
  const statusColors: { [key: string]: string } = {
    'active': 'bg-success bg-opacity-20 text-success border border-success border-opacity-30',
    'activo': 'bg-success bg-opacity-20 text-success border border-success border-opacity-30',
    'inactive': 'bg-danger bg-opacity-20 text-danger border border-danger border-opacity-30',
    'inactivo': 'bg-danger bg-opacity-20 text-danger border border-danger border-opacity-30',
    'pending': 'bg-warning bg-opacity-20 text-warning border border-warning border-opacity-30',
    'pendiente': 'bg-warning bg-opacity-20 text-warning border border-warning border-opacity-30'
  };
  
  const colorClass = statusColors[value?.toString().toLowerCase()] || 'bg-gray-100 text-gray-800 border border-gray-300';
  return `${baseClasses} ${colorClass}`;
}

// Acciones sólidas con colores IEBEM (como en el formulario)
getModernActionClasses(action: TableAction): string {
  const baseClasses = 'border transition-all duration-200 font-medium hover:shadow-lg';
  
  switch (action.color) {
    case 'primary':
      return `${baseClasses} bg-iebem-primary text-white border-iebem-primary hover:bg-iebem-dark`;
    case 'secondary':
      return `${baseClasses} bg-iebem-secondary text-white border-iebem-secondary hover:opacity-80`;
    case 'danger':
      return `${baseClasses} bg-danger text-white border-danger hover:bg-red-600`;
    default:
      return `${baseClasses} bg-gray-600 text-white border-gray-600 hover:bg-gray-700`;
  }
}

}