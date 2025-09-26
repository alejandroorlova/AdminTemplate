// Utilidades CSS para generar clases dinámicamente
import { SystemColor, ComponentSize, ButtonVariant } from '../types/common.types';

export class CssUtils {
  
  // Generar clases para botones según la configuración
  static getButtonClasses(
    color: SystemColor = 'primary', 
    variant: ButtonVariant = 'solid',
    size: ComponentSize = 'md',
    disabled = false,
    customClasses = ''
  ): string {
    const baseClasses = 'btn-base';
    
    // Clases por variante y color
    const variantClasses = this.getButtonVariantClasses(color, variant);
    
    // Clases por tamaño
    const sizeClasses = this.getComponentSizeClasses(size, 'button');
    
    // Estado disabled
    const stateClasses = disabled ? 'opacity-60 cursor-not-allowed' : '';
    
    return `${baseClasses} ${variantClasses} ${sizeClasses} ${stateClasses} ${customClasses}`.trim();
  }
  
  private static getButtonVariantClasses(color: SystemColor, variant: ButtonVariant): string {
    const colorMap = {
      primary: 'btn-primary',
      secondary: 'btn-secondary', 
      danger: 'btn-danger',
      success: 'bg-success text-white hover:bg-green-600',
      warning: 'bg-warning text-white hover:bg-yellow-600',
      info: 'bg-info text-white hover:bg-blue-600',
      dark: 'bg-gray-800 text-white hover:bg-gray-900',
      light: 'bg-gray-100 text-gray-800 hover:bg-gray-200'
    };
    
    const outlineMap = {
      primary: 'btn-outline border-iebem-primary text-iebem-primary hover:bg-iebem-primary hover:text-white',
      secondary: 'btn-outline border-iebem-secondary text-iebem-secondary hover:bg-iebem-secondary hover:text-white',
      danger: 'btn-outline border-danger text-danger hover:bg-danger hover:text-white',
      success: 'btn-outline border-success text-success hover:bg-success hover:text-white',
      warning: 'btn-outline border-warning text-warning hover:bg-warning hover:text-white',
      info: 'btn-outline border-info text-info hover:bg-info hover:text-white',
      dark: 'btn-outline border-gray-800 text-gray-800 hover:bg-gray-800 hover:text-white',
      light: 'btn-outline border-gray-300 text-gray-600 hover:bg-gray-100'
    };
    
    switch (variant) {
      case 'solid':
        return colorMap[color] || colorMap.primary;
      case 'outline':
        return outlineMap[color] || outlineMap.primary;
      case 'ghost':
        return `bg-transparent text-${color} hover:bg-${color} hover:bg-opacity-10`;
      case 'link':
        return `bg-transparent text-${color} hover:underline p-0`;
      default:
        return colorMap[color] || colorMap.primary;
    }
  }
  
  // Generar clases para inputs según estado
  static getInputClasses(
    hasError = false,
    focused = false,
    disabled = false,
    size: ComponentSize = 'md',
    customClasses = ''
  ): string {
    const baseClasses = 'input-base';
    
    // Estados
    let stateClasses = '';
    if (hasError) {
      stateClasses = 'error';
    } else if (focused) {
      stateClasses = 'ring-2 ring-iebem-primary border-iebem-primary';
    }
    
    // Tamaño
    const sizeClasses = this.getComponentSizeClasses(size, 'input');
    
    // Disabled
    const disabledClasses = disabled ? 'disabled' : '';
    
    return `${baseClasses} ${stateClasses} ${sizeClasses} ${disabledClasses} ${customClasses}`.trim();
  }
  
  // Generar clases para badges
  static getBadgeClasses(
    color: SystemColor = 'primary',
    variant: 'solid' | 'outline' | 'soft' = 'soft',
    size: ComponentSize = 'sm',
    customClasses = ''
  ): string {
    const baseClasses = 'badge-base';
    
    const variantClasses = this.getBadgeVariantClasses(color, variant);
    const sizeClasses = this.getComponentSizeClasses(size, 'badge');
    
    return `${baseClasses} ${variantClasses} ${sizeClasses} ${customClasses}`.trim();
  }
  
  private static getBadgeVariantClasses(color: SystemColor, variant: string): string {
    const softMap = {
      primary: 'bg-iebem-primary bg-opacity-10 text-iebem-primary',
      secondary: 'bg-iebem-secondary bg-opacity-10 text-iebem-secondary',
      success: 'badge-success',
      danger: 'badge-danger', 
      warning: 'badge-warning',
      info: 'bg-info bg-opacity-10 text-info',
      dark: 'bg-gray-800 bg-opacity-10 text-gray-800',
      light: 'bg-gray-100 text-gray-600'
    };
    
    const solidMap = {
      primary: 'bg-iebem-primary text-white',
      secondary: 'bg-iebem-secondary text-white',
      success: 'bg-success text-white',
      danger: 'bg-danger text-white',
      warning: 'bg-warning text-white',
      info: 'bg-info text-white',
      dark: 'bg-gray-800 text-white',
      light: 'bg-gray-200 text-gray-800'
    };
    
    switch (variant) {
      case 'solid':
        return solidMap[color] || solidMap.primary;
      case 'soft':
        return softMap[color] || softMap.primary;
      case 'outline':
        return `border border-${color} text-${color} bg-transparent`;
      default:
        return softMap[color] || softMap.primary;
    }
  }
  
  // Generar clases de tamaño para diferentes componentes
  private static getComponentSizeClasses(size: ComponentSize, component: string): string {
    const sizeMap = {
      button: {
        xs: 'px-2 py-1 text-xs',
        sm: 'px-3 py-2 text-sm', 
        md: 'px-4 py-2 text-base',
        lg: 'px-6 py-3 text-lg',
        xl: 'px-8 py-4 text-xl'
      },
      input: {
        xs: 'px-2 py-1 text-xs',
        sm: 'px-3 py-2 text-sm',
        md: 'px-4 py-3 text-base',
        lg: 'px-6 py-4 text-lg',
        xl: 'px-8 py-5 text-xl'
      },
      badge: {
        xs: 'px-1 py-0.5 text-xs',
        sm: 'px-2 py-1 text-xs',
        md: 'px-3 py-1 text-sm',
        lg: 'px-4 py-2 text-base',
        xl: 'px-6 py-3 text-lg'
      }
    };
    
    return sizeMap[component as keyof typeof sizeMap]?.[size] || '';
  }
  
  // Utilidades para clases condicionales
  static conditionalClasses(condition: boolean, trueClasses: string, falseClasses = ''): string {
    return condition ? trueClasses : falseClasses;
  }
  
  // Combinar múltiples clases
  static combineClasses(...classes: (string | undefined | null | false)[]): string {
    return classes
      .filter(Boolean)
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim();
  }
  
  // Validar color del sistema
  static isValidSystemColor(color: string): color is SystemColor {
    const validColors: SystemColor[] = ['primary', 'secondary', 'danger', 'success', 'warning', 'info', 'dark', 'light'];
    return validColors.includes(color as SystemColor);
  }
}