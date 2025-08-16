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

// Re-exportar todo lo público de UI (usa el index.ts de ui con alias ya aplicado)
export * from './ui';
