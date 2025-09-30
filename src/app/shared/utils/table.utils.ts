// Utilidades para el componente Table
import { TableColumn } from '../ui/table/table.interfaces';

// Configuración de columnas responsivas
export interface ResponsiveConfig {
  criticalColumns: string[];
  desktopColumns: string[];
  mobileColumns: string[];
  columnWidths: { [key: string]: string };
}

// Configuración por defecto para empleados
export const defaultEmployeeResponsiveConfig: ResponsiveConfig = {
  criticalColumns: ['firstName', 'lastName', 'email', 'status'],
  desktopColumns: ['firstName', 'lastName', 'email', 'department', 'position', 'status'],
  mobileColumns: ['firstName', 'lastName', 'status'],
  columnWidths: {
    'firstName': '120px',
    'lastName': '140px',
    'email': '180px',
    'phone': '120px',
    'department': '130px',
    'position': '140px',
    'salary': '100px',
    'hireDate': '100px',
    'status': '90px'
  }
};

export class TableUtils {
  
  // Obtener columnas para desktop
  static getDesktopColumns(columns: TableColumn[], config: ResponsiveConfig = defaultEmployeeResponsiveConfig): TableColumn[] {
    return columns.filter(column => config.desktopColumns.includes(column.key));
  }

  // Obtener columnas para móvil
  static getMobileColumns(columns: TableColumn[], config: ResponsiveConfig = defaultEmployeeResponsiveConfig): TableColumn[] {
    return columns.filter(column => config.mobileColumns.includes(column.key));
  }

  // Obtener columnas críticas
  static getCriticalColumns(columns: TableColumn[], config: ResponsiveConfig = defaultEmployeeResponsiveConfig): TableColumn[] {
    return columns.filter(column => config.criticalColumns.includes(column.key));
  }

  // Obtener ancho responsivo
  static getResponsiveWidth(column: TableColumn, config: ResponsiveConfig = defaultEmployeeResponsiveConfig): string {
    return config.columnWidths[column.key] || column.width || '120px';
  }

  // Verificar si una columna es crítica
  static isCriticalColumn(columnKey: string, config: ResponsiveConfig = defaultEmployeeResponsiveConfig): boolean {
    return config.criticalColumns.includes(columnKey);
  }

  // Formatear valores para móvil (versiones compactas)
  static formatMobileValue(value: any, type: string): string {
    if (value == null) return '-';

    switch (type) {
      case 'date':
        return new Date(value).toLocaleDateString('es-ES', {
          month: 'short',
          day: 'numeric',
          year: '2-digit'
        });
      case 'currency':
        return new Intl.NumberFormat('es-MX', {
          style: 'currency',
          currency: 'MXN',
          notation: 'compact'
        }).format(value);
      case 'number':
        if (typeof value === 'number' && value > 1000) {
          return new Intl.NumberFormat('es-ES', {
            notation: 'compact'
          }).format(value);
        }
        return new Intl.NumberFormat('es-ES').format(value);
      default:
        return value.toString();
    }
  }

  // Generar clases para badges con colores IEBEM
  static getBadgeClasses(value: any): string {
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

  // Generar clases para botones de acción
  static getActionClasses(color?: string): string {
    const baseClasses = 'border transition-all duration-200 font-medium hover:shadow-lg';

    switch (color) {
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
