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
      success: 'btn-success',
      warning: 'btn-warning',
      info: 'btn-info',
      dark: 'btn-dark',
      light: 'btn-light'
    } as const;
    
    const outlineMap = {
      primary: 'btn-outline',
      secondary: 'btn-outline-secondary',
      danger: 'btn-outline-danger',
      success: 'btn-outline', // usar primario como base si no hay variante dedicada
      warning: 'btn-outline',
      info: 'btn-outline',
      dark: 'btn-outline',
      light: 'btn-outline'
    } as const;
    
    switch (variant) {
      case 'solid':
        return colorMap[color] || colorMap.primary;
      case 'outline':
        return outlineMap[color] || outlineMap.primary;
      case 'ghost':
        return 'btn-ghost';
      case 'link':
        return 'btn-link';
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
      primary: 'badge-soft-primary',
      secondary: 'badge-soft-secondary',
      success: 'badge-soft-success',
      danger: 'badge-soft-danger',
      warning: 'badge-soft-warning',
      info: 'badge-base bg-info/10 text-info',
      dark: 'badge-base bg-gray-800/10 text-gray-800',
      light: 'badge-base bg-gray-100 text-gray-600'
    } as const;

    const solidMap = {
      primary: 'badge-solid-primary',
      secondary: 'badge-base bg-iebem-secondary text-white',
      success: 'badge-base bg-success text-white',
      danger: 'badge-solid-danger',
      warning: 'badge-base bg-warning text-white',
      info: 'badge-base bg-info text-white',
      dark: 'badge-base bg-gray-800 text-white',
      light: 'badge-base bg-gray-200 text-gray-800'
    } as const;

    const outlineMap = {
      primary: 'badge-base border-2 border-iebem-primary text-iebem-primary bg-transparent',
      secondary: 'badge-base border-2 border-iebem-secondary text-iebem-secondary bg-transparent',
      success: 'badge-base border-2 border-success text-success bg-transparent',
      danger: 'badge-base border-2 border-danger text-danger bg-transparent',
      warning: 'badge-base border-2 border-warning text-warning bg-transparent',
      info: 'badge-base border-2 border-info text-info bg-transparent',
      dark: 'badge-base border-2 border-gray-800 text-gray-800 bg-transparent',
      light: 'badge-base border-2 border-gray-300 text-gray-600 bg-transparent'
    } as const;

    switch (variant) {
      case 'solid':
        return solidMap[color] || solidMap.primary;
      case 'soft':
        return softMap[color] || softMap.primary;
      case 'outline':
        return outlineMap[color] || outlineMap.primary;
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
