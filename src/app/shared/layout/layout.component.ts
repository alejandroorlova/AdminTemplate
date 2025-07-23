// layout.component.ts - ACTUALIZADO
import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent, SidebarConfig, SidebarMenuItem } from '../ui/sidebar/sidebar.component';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent, HeaderComponent],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent {
  isSidebarOpen = signal(true);
  isMobile = signal(false);

  // Configuración del nuevo sidebar con submenús
  sidebarConfig: SidebarConfig = {
    logo: {
      icon: 'graduation-cap',
      title: 'IEBEM',
      subtitle: 'Admin Panel'
    },
    version: '2.1.0',
    copyright: 'IEBEM © 2025',
    collapsible: true,
    persistCollapsedState: true,
    items: [
      {
        id: 'dashboard',
        label: 'Dashboard',
        icon: 'chart-line',
        route: '/dashboard',
        tooltip: 'Panel principal de control'
      },
      {
        id: 'login',
        label: 'Login',
        icon: 'chart-line',
        route: '/login',
        tooltip: 'Iniciar sesión'
      },
      {
        id: 'divider-1',
        label: '',
        icon: '',
        divider: true
      },
      {
        id: 'employees',
        label: 'Empleados',
        icon: 'users',
        tooltip: 'Gestión de empleados',
        children: [
          {
            id: 'employees-list',
            label: 'Lista de Empleados',
            icon: 'address-book',
            route: '/employees',
            tooltip: 'Ver todos los empleados'
          },
          {
            id: 'employees-add',
            label: 'Nuevo Empleado',
            icon: 'user-plus',
            route: '/employees/add',
            tooltip: 'Registrar nuevo empleado'
          },
          {
            id: 'employees-reports',
            label: 'Reportes',
            icon: 'chart-bar',
            route: '/employees/reports',
            tooltip: 'Reportes de empleados'
          }
        ]
      },
      {
        id: 'components',
        label: 'Componentes UI',
        icon: 'puzzle-piece',
        tooltip: 'Librería de componentes',
        children: [
          {
            id: 'buttons',
            label: 'Botones',
            icon: 'mouse-pointer',
            route: '/button-examples',
            tooltip: 'Ejemplos de botones'
          },
          {
            id: 'checkboxes',
            label: 'CheckBoxes',
            icon: 'check-square',
            route: '/checkbox-examples',
            tooltip: 'Ejemplos de checkboxes'
          },
          {
            id: 'modals',
            label: 'Modales',
            icon: 'window-maximize',
            route: '/modal',
            tooltip: 'Componentes modales'
          },
          {
            id: 'loaders',
            label: 'Loaders',
            icon: 'spinner',
            route: '/loader',
            tooltip: 'Indicadores de carga'
          }
        ]
      },
      {
        id: 'divider-2',
        label: '',
        icon: '',
        divider: true
      },
      {
        id: 'settings',
        label: 'Configuración',
        icon: 'cog',
        route: '/settings',
        tooltip: 'Configuración del sistema'
      },
      {
        id: 'help',
        label: 'Ayuda',
        icon: 'question-circle',
        tooltip: 'Centro de ayuda',
        onClick: () => this.showHelp()
      }
    ]
  };

  constructor() {
    this.checkScreenSize();
    window.addEventListener('resize', () => this.checkScreenSize());
  }

  private checkScreenSize(): void {
    const mobile = window.innerWidth < 1024;
    this.isMobile.set(mobile);
    
    // En móvil, cerrar el sidebar por defecto
    if (mobile) {
      this.isSidebarOpen.set(false);
    } else {
      // En desktop, abrir el sidebar por defecto
      this.isSidebarOpen.set(true);
    }
  }

  toggleSidebar(): void {
    console.log('Layout: toggleSidebar called, current state:', this.isSidebarOpen()); // Debug
    this.isSidebarOpen.update(value => !value);
    console.log('Layout: toggleSidebar new state:', this.isSidebarOpen()); // Debug
  }

  closeSidebar(): void {
    this.isSidebarOpen.set(false);
    console.log('Sidebar closed'); // Debug
  }

  // Manejar clicks en items del sidebar
  onSidebarItemClick(item: SidebarMenuItem): void {
    console.log('Item clicked:', item);
    
    // Cerrar sidebar en mobile después de navegación
    if (this.isMobile() && item.route) {
      this.closeSidebar();
    }
  }

  // Manejar cambios de colapso
  onSidebarCollapseChange(isCollapsed: boolean): void {
    console.log('Sidebar collapsed:', isCollapsed);
    // Aquí puedes manejar cambios en el layout si es necesario
  }

  // Manejar click en logo
  onLogoClick(): void {
    console.log('Logo clicked');
    // Navegar al dashboard o página principal
  }

  // Mostrar ayuda
  private showHelp(): void {
    // Implementar modal de ayuda o navegación
    alert('Centro de Ayuda - Aquí se abriría un modal con ayuda contextual');
  }
}