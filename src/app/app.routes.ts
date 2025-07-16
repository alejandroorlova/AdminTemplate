import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { 
    path: 'dashboard', 
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent) 
  },
  { 
    path: 'employees', 
    loadComponent: () => import('./features/employees/employees.component').then(m => m.EmployeesComponent) 
  },
  { 
    path: 'payroll', 
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent) 
  },
  { 
    path: 'configuration', 
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent) 
  },
  { path: '**', redirectTo: '/dashboard' }
];