// Tipos y interfaces comunes para todos los componentes UI

// Opciones para selects
export interface SelectOption {
  value: any;
  label: string;
  disabled?: boolean;
  icon?: string;
  description?: string;
}

// Colores del sistema basados en la paleta IEBEM
export type SystemColor = 
  | 'primary' 
  | 'secondary' 
  | 'danger' 
  | 'success' 
  | 'warning' 
  | 'info'
  | 'dark'
  | 'light';

// Tamaños estándar para componentes
export type ComponentSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

// Variantes de botón
export type ButtonVariant = 'solid' | 'outline' | 'ghost' | 'link';

// Estados de componentes
export type ComponentState = 'default' | 'disabled' | 'loading' | 'error' | 'success';

// Alineación de texto
export type TextAlign = 'left' | 'center' | 'right';

// Tipos de input
export type InputType = 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'date' | 'time' | 'datetime-local';

// Validación de formularios
export interface ValidationState {
  isValid: boolean;
  error?: string;
  touched?: boolean;
}

// Configuración base para componentes de formulario
export interface FormComponentConfig {
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  error?: string;
  hint?: string;
  id?: string;
}

// Badge/Chip configuration
export interface BadgeConfig {
  color?: SystemColor;
  variant?: 'solid' | 'outline' | 'soft';
  size?: ComponentSize;
  rounded?: boolean;
}

// Iconos comunes del sistema
export interface IconConfig {
  name: string;
  size?: ComponentSize;
  color?: SystemColor;
}