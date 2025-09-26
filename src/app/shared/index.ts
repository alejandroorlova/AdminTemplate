// src/app/shared/index.ts

// Layout & Header
export { HeaderComponent } from './header/header.component';
export { LayoutComponent } from './layout/layout.component';

// Tipos del sidebar (interfaces)
export type {
  SidebarConfig,
  SidebarMenuItem,
  SidebarLogo,
} from './ui/sidebar/sidebar.interface';

// Re-exportar todo lo público de UI
export * from './ui';

// Types and Interfaces comunes
export * from './types/common.types';

// Utilities
export { FormControlBase } from './utils/form-control.base';
export { TableUtils, defaultEmployeeResponsiveConfig } from './utils/table.utils';
export type { ResponsiveConfig } from './utils/table.utils';
export { CssUtils } from './utils/css.utils';
