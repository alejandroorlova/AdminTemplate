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
    path: 'loader', 
    loadComponent: () => import('./features/loaderexamples/loaderexamples.component').then(m => m.LoaderexamplesComponent) 
  },
  { 
    path: 'button-examples', 
    loadComponent: () => import('./features/buttonexamples/buttonexamples.component').then(m => m.ButtonExamplesComponent) 
  },
  { 
    path: 'checkbox-examples', 
    loadComponent: () => import('./features/checkbox-examples/checkbox-examples.component').then(m => m.CheckboxExamplesComponent) 
  },
  { path: '**', redirectTo: '/dashboard' }
];