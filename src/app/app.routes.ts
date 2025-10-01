// app.routes.ts - CONFIGURACIÓN CORRECTA
import { Routes } from '@angular/router';
import { LayoutComponent } from './shared/layout/layout.component';

export const routes: Routes = [
  // 🔓 RUTA DE LOGIN - INDEPENDIENTE (SIN LAYOUT)
  {
    path: 'login',
    loadComponent: () => import('./features/login/login.component').then(m => m.LoginComponent),
    title: 'IEBEM - Iniciar Sesión'
  },
  
  // 🔒 RUTAS CON LAYOUT (SIDEBAR + HEADER)
  {
    path: '',
    component: LayoutComponent, // ← AQUÍ es donde se aplica el layout
    children: [
      {
        path: '',
        redirectTo: '/dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
        title: 'IEBEM - Dashboard'
      },
      {
        path: 'employees',
        loadComponent: () => import('./features/employees/employees.component').then(m => m.EmployeesComponent),
        title: 'IEBEM - Empleados'
      },
      {
        path: 'modal',
        loadComponent: () => import('./features/modalexamples/modalexamples.component').then(m => m.ModalexamplesComponent),
        title: 'IEBEM - Ejemplos de Modales'
      },
      {
        path: 'loader',
        loadComponent: () => import('./features/loaderexamples/loaderexamples.component').then(m => m.LoaderexamplesComponent),
        title: 'IEBEM - Ejemplos de Loaders'
      },
      {
        path: 'button-examples',
        loadComponent: () => import('./features/buttonexamples/buttonexamples.component').then(m => m.ButtonExamplesComponent),
        title: 'IEBEM - Ejemplos de Botones'
      },
      {
        path: 'checkbox-examples',
        loadComponent: () => import('./features/checkbox-examples/checkbox-examples.component').then(m => m.CheckboxExamplesComponent),
        title: 'IEBEM - Ejemplos de Checkboxes'
      },
      {
        path: 'notifications',
        loadComponent: () => import('./features/notifications/notifications.component').then(m => m.NotificationsComponent),
        title: 'IEBEM - Notificaciones y Confirmaciones'
      }
    ]
  },
  
  // 🚫 RUTA POR DEFECTO
  {
    path: '**',
    redirectTo: '/login' // ← Cambié esto para ir a login por defecto
  }
];
