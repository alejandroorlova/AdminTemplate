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
    path: 'modal', 
    loadComponent: () => import('./features/modalexamples/modalexamples.component').then(m => m.ModalexamplesComponent) 
  },
  { 
    path: 'configuration', 
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent) 
  },
  { path: '**', redirectTo: '/dashboard' }
];