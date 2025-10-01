import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbComponent, BreadcrumbItem } from 'iebem-ui';

@Component({
  selector: 'app-breadcrumb-demo',
  standalone: true,
  imports: [CommonModule, BreadcrumbComponent],
  templateUrl: './breadcrumb.component.html'
})
export class BreadcrumbDemoComponent {
  basic: BreadcrumbItem[] = [
    { label: 'Inicio', route: '/dashboard', icon: 'home' },
    { label: 'Empleados', route: '/employees', icon: 'users' },
    { label: 'Lista', icon: 'list' }
  ];

  long: BreadcrumbItem[] = [
    { label: 'Configuración', route: '/settings', icon: 'cog' },
    { label: 'Preferencias de usuario y notificaciones muy largas', route: '/settings' },
    { label: 'Edición' }
  ];
}

