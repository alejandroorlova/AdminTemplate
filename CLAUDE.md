# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the IEBEM Administrative System, an Angular 19 application for educational administration built for Instituto de Estudios Básicos Educativos del Estado de México. The project uses TailwindCSS for styling, FontAwesome for icons, and follows modern Angular patterns with standalone components.

## Development Commands

### Basic Development
```bash
ng serve                    # Start development server on http://localhost:4200
ng build                    # Build for development
ng build --configuration production  # Build for production
ng test                     # Run unit tests with Karma
```

### Code Generation
```bash
ng generate component component-name
ng generate service service-name
ng generate module module-name
```

## Architecture Overview

### Project Structure
- **src/app/features/** - Feature modules (dashboard, login, employees, examples)
- **src/app/shared/** - Shared components and utilities
  - **shared/ui/** - Reusable UI components (buttons, inputs, modals, tables)
  - **shared/layout/** - Layout components (main layout with sidebar/header)
  - **shared/types/** - TypeScript interfaces and types
  - **shared/utils/** - Utility classes and functions
  - **shared/styles/** - Design system tokens and SCSS utilities

### Routing Architecture
The application uses a **hybrid routing approach**:
- **Login route** - Standalone route without layout (`/login`)
- **Main application routes** - Wrapped in `LayoutComponent` with sidebar and header
- **Lazy loading** - All feature components are lazy-loaded using `loadComponent()`

Key routing pattern in `app.routes.ts`:
```typescript
// Login - no layout
{ path: 'login', loadComponent: () => import('...') }

// Main app - with layout
{
  path: '',
  component: LayoutComponent,  // Provides sidebar + header
  children: [
    { path: 'dashboard', loadComponent: () => import('...') },
    // ... other routes
  ]
}
```

### UI Component System
The project includes a comprehensive custom UI library in `src/app/shared/ui/`:

**Core Components:**
- `ButtonComponent` - Configurable buttons with multiple variants
- `InputComponent`, `SelectComponent`, `ModernSelectComponent` - Form controls
- `ModalComponent` - Reusable modal system
- `TableComponent` with `TableCellComponent` - Data tables
- `LoaderComponent` - Loading states
- `CheckboxComponent`, `DatePickerComponent`, `FileUploadComponent`
- `SidebarComponent` - Navigation sidebar

**Architecture Patterns:**
- **FormControlBase** - Abstract base class implementing `ControlValueAccessor` for form controls
- **Common Types** - Centralized TypeScript interfaces in `shared/types/common.types.ts`
- **Index Exports** - Barrel exports in `shared/ui/index.ts` for clean imports
- **Design System** - SCSS tokens in `shared/styles/design-tokens.scss`

### Styling System

**TailwindCSS Configuration:**
- **Custom IEBEM color palette** defined in `tailwind.config.js`
- **Design tokens** centralized in `src/app/shared/styles/design-tokens.scss`
- **Custom animations** for checkboxes, ripples, gradients
- **Component-specific shadows and spacing**

**Key IEBEM Colors:**
```scss
--iebem-primary: #70795b     // Verde institucional
--iebem-secondary: #b29a7e   // Naranja cálido
--iebem-gold: #F59E0B        // Dorado logo
```

**Global Styles:**
- FontAwesome integration via `angular.json` and global styles
- Google Fonts (Inter, Montserrat) loaded in `styles.scss`
- CSS custom properties for consistent theming
- Utility classes for hover effects and animations

### State Management
- **Service-based state** - No NgRx, uses Angular services
- **Reactive Forms** - Angular reactive forms with custom form controls
- **ControlValueAccessor pattern** - All form components implement CVA

### Build Configuration
- **Angular 19** with latest CLI build system
- **SCSS preprocessing** with component-level styles
- **TailwindCSS** with typography plugin
- **Production budgets** - 500kB initial, 1MB max
- **Development optimization** disabled for faster builds

## Key Development Patterns

### Creating New Components
1. Follow the existing component structure in `shared/ui/`
2. Extend `FormControlBase` for form controls
3. Use common types from `shared/types/common.types.ts`
4. Export new components in `shared/ui/index.ts`
5. Follow IEBEM color palette and design tokens

### Adding New Routes
1. Add route to appropriate section in `app.routes.ts`
2. Use lazy loading with `loadComponent()`
3. Decide if route needs layout (most do) or is standalone (like login)
4. Set meaningful page titles

### Styling Guidelines
1. Use TailwindCSS utilities first
2. Reference design tokens from `design-tokens.scss` for custom styles
3. Follow IEBEM color palette
4. Use existing animation classes where possible

## Testing
- **Karma + Jasmine** for unit testing
- All generated components include `.spec.ts` files
- Test files follow Angular testing patterns