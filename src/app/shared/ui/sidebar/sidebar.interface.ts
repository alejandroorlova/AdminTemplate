// shared/ui/sidebar/sidebar.interface.ts

export interface SidebarMenuItem {
  id: string;
  label: string;
  icon: string;
  route?: string;
  children?: SidebarMenuItem[];
  badge?: string | number;
  disabled?: boolean;
  divider?: boolean;
  hidden?: boolean;
  onClick?: () => void;
  tooltip?: string;
  permission?: string | string[];
  target?: '_blank' | '_self';
  order?: number; // Para ordenamiento
  metadata?: Record<string, any>; // Datos adicionales
}

export interface SidebarLogo {
  icon?: string;
  title: string;
  subtitle?: string;
  image?: string; // URL de imagen del logo
  onClick?: () => void;
  class?: string; // Clases CSS adicionales
}

export interface SidebarConfig {
  logo?: SidebarLogo;
  version?: string;
  copyright?: string;
  collapsible?: boolean;
  persistCollapsedState?: boolean;
  items: SidebarMenuItem[];
  theme?: SidebarTheme;
  animations?: SidebarAnimations;
  accessibility?: SidebarAccessibility;
}

export interface SidebarTheme {
  primary?: string; // Color primario
  secondary?: string; // Color secundario
  background?: string; // Color de fondo
  textColor?: string; // Color del texto
  hoverColor?: string; // Color hover
  activeColor?: string; // Color activo
  borderColor?: string; // Color de bordes
  variant?: 'default' | 'compact' | 'modern' | 'minimal';
}

export interface SidebarAnimations {
  enabled?: boolean;
  duration?: number; // en milisegundos
  easing?: string; // función de timing CSS
  reduceMotion?: boolean; // Respetar preferencias de usuario
}

export interface SidebarAccessibility {
  enableKeyboardNavigation?: boolean;
  announcePageChanges?: boolean;
  highContrast?: boolean;
  focusManagement?: boolean;
  screenReaderSupport?: boolean;
}

export interface SidebarState {
  isOpen: boolean;
  isCollapsed: boolean;
  activeItemId?: string;
  expandedItems: Set<string>;
  currentRoute: string;
  lastInteraction: Date;
}

export interface SidebarEvents {
  onToggle?: (isOpen: boolean) => void;
  onCollapse?: (isCollapsed: boolean) => void;
  onItemClick?: (item: SidebarMenuItem) => void;
  onItemHover?: (item: SidebarMenuItem) => void;
  onItemExpand?: (item: SidebarMenuItem, isExpanded: boolean) => void;
  onLogoClick?: () => void;
  onRouteChange?: (route: string) => void;
}

export interface SidebarAnalytics {
  trackClicks?: boolean;
  trackTimeSpent?: boolean;
  trackNavigation?: boolean;
  customEvents?: Record<string, any>;
}

// Tipos para la configuración de factory
export type SidebarRole = 'admin' | 'user' | 'guest' | 'hr' | 'finance' | 'manager';
export type SidebarSize = 'sm' | 'md' | 'lg' | 'xl';
export type SidebarPosition = 'left' | 'right';
export type SidebarBehavior = 'fixed' | 'overlay' | 'push' | 'slide';

// Configuración avanzada
export interface SidebarAdvancedConfig extends SidebarConfig {
  role?: SidebarRole;
  size?: SidebarSize;
  position?: SidebarPosition;
  behavior?: SidebarBehavior;
  analytics?: SidebarAnalytics;
  permissions?: string[];
  customClasses?: string[];
  onBeforeRender?: (config: SidebarConfig) => SidebarConfig;
  onAfterRender?: (element: HTMLElement) => void;
}

// Utilidades para construcción de menús
export interface MenuGroup {
  id: string;
  label: string;
  icon?: string;
  order?: number;
  items: SidebarMenuItem[];
  collapsed?: boolean;
  permission?: string | string[];
}

export interface BreadcrumbItem {
  id: string;
  label: string;
  route?: string;
  icon?: string;
}

// Configuración para diferentes roles de IEBEM
export interface IEBEMSidebarConfig extends SidebarAdvancedConfig {
  institution?: {
    name: string;
    logo?: string;
    colors?: {
      primary: string;
      secondary: string;
      accent: string;
    };
  };
  modules?: {
    hr?: boolean;
    finance?: boolean;
    academic?: boolean;
    administration?: boolean;
    reports?: boolean;
  };
  userInfo?: {
    name: string;
    role: string;
    department?: string;
    avatar?: string;
  };
}

// Tipos para eventos del ciclo de vida
export type SidebarLifecycleEvent = 
  | 'beforeInit'
  | 'afterInit'
  | 'beforeDestroy'
  | 'afterDestroy'
  | 'beforeToggle'
  | 'afterToggle'
  | 'beforeCollapse'
  | 'afterCollapse';

export interface SidebarLifecycleHook {
  event: SidebarLifecycleEvent;
  handler: (data?: any) => void | Promise<void>;
}

// Configuración de responsive behavior
export interface SidebarResponsive {
  breakpoints?: {
    mobile: number;
    tablet: number;
    desktop: number;
  };
  behavior?: {
    mobile: SidebarBehavior;
    tablet: SidebarBehavior;
    desktop: SidebarBehavior;
  };
  autoCollapse?: {
    mobile: boolean;
    tablet: boolean;
  };
}

// Plugin system (para extensibilidad futura)
export interface SidebarPlugin {
  name: string;
  version: string;
  init: (sidebar: any) => void;
  destroy?: () => void;
  config?: Record<string, any>;
}

// Validación de configuración
export interface SidebarValidationRule {
  field: string;
  rule: 'required' | 'unique' | 'format' | 'custom';
  message: string;
  validator?: (value: any) => boolean;
}

export interface SidebarValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}