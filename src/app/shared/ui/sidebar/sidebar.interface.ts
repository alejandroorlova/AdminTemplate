// shared/ui/sidebar/sidebar.component.ts - ACTUALIZADO
import { Component, Input, Output, EventEmitter, OnInit, HostListener, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

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
}

export interface SidebarLogo {
  icon: string;
  title: string;
  subtitle?: string;
  image?: string;
  onClick?: () => void;
}

export interface SidebarConfig {
  logo?: SidebarLogo;
  version?: string;
  copyright?: string;
  collapsible?: boolean;
  persistCollapsedState?: boolean;
  items: SidebarMenuItem[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarComponent implements OnInit {
  @Input() isOpen = true;
  @Input() config: SidebarConfig = {
    logo: {
      icon: 'graduation-cap',
      title: 'IEBEM',
      subtitle: 'Admin Panel'
    },
    version: '1.0.0',
    copyright: 'IEBEM © 2025',
    collapsible: true,
    persistCollapsedState: true,
    items: []
  };
  
  @Output() toggleSidebar = new EventEmitter<void>();
  @Output() itemClick = new EventEmitter<SidebarMenuItem>();
  @Output() collapseChange = new EventEmitter<boolean>();
  @Output() logoClick = new EventEmitter<void>();

  // Variables internas
  isCollapsed = false;
  isDesktop = true;
  expandedItems = new Set<string>();
  currentRoute = '';
  version = '1.0.0'; // Mantener compatibilidad

  constructor(private router: Router) {}

  ngOnInit(): void {
    console.log('Sidebar init - isOpen:', this.isOpen); // Debug
    
    // Restaurar estado colapsado si está habilitado
    if (this.config.persistCollapsedState) {
      this.restoreCollapsedState();
    }

    // Subscribe to route changes
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.currentRoute = event.url;
        this.updateExpandedItems();
      });

    this.currentRoute = this.router.url;
    this.updateExpandedItems();
    this.checkScreenSize();
    
    // Manejar el estado del sidebar en móvil
    this.updateBodyScroll();
  }

  @HostListener('window:resize')
  onResize(): void {
    this.checkScreenSize();
    this.updateBodyScroll();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    // Cerrar sidebar en mobile si se hace click fuera
    if (!this.isDesktop && this.isOpen) {
      const target = event.target as HTMLElement;
      const sidebar = target.closest('.sidebar-container');
      if (!sidebar) {
        this.closeSidebar();
      }
    }
  }

  trackByItemId(index: number, item: SidebarMenuItem): string {
    return item.id;
  }

  hasChildren(item: SidebarMenuItem): boolean {
    return !!(item.children && item.children.length > 0);
  }

  isExpanded(itemId: string): boolean {
    return this.expandedItems.has(itemId);
  }

  isItemActive(item: SidebarMenuItem): boolean {
    if (item.route) {
      return this.currentRoute === item.route || 
             this.currentRoute.startsWith(item.route + '/');
    }
    
    if (item.children) {
      return item.children.some(child => this.isItemActive(child));
    }
    
    return false;
  }

  isItemVisible(item: SidebarMenuItem): boolean {
    if (item.hidden) return false;
    
    // Aquí podrías agregar lógica de permisos
    // if (item.permission && !this.hasPermission(item.permission)) {
    //   return false;
    // }
    
    return true;
  }

  // Getter para el logo con valores por defecto
  get logoConfig() {
    return this.config.logo || {
      icon: 'graduation-cap',
      title: 'IEBEM',
      subtitle: 'Admin Panel'
    };
  }

  handleItemClick(item: SidebarMenuItem): void {
    if (item.disabled) return;

    // Manejar expansión/colapso de items con children
    if (this.hasChildren(item)) {
      this.toggleExpansion(item.id);
    }

    // Ejecutar función onClick personalizada
    if (item.onClick) {
      item.onClick();
    }

    // Navegar si tiene ruta y no tiene children
    if (item.route && !this.hasChildren(item)) {
      if (item.target === '_blank') {
        window.open(item.route, '_blank');
      } else {
        this.router.navigate([item.route]);
      }
      
      // Cerrar sidebar en mobile después de navegación
      if (!this.isDesktop) {
        this.closeSidebar();
      }
    }

    // Emitir evento
    this.itemClick.emit(item);
  }

  handleLogoClick(): void {
    if (this.logoConfig.onClick) {
      this.logoConfig.onClick();
    }
    this.logoClick.emit();
  }

  toggleExpansion(itemId: string): void {
    // En móvil, siempre permitir expansión
    if (!this.isDesktop || !this.isCollapsed) {
      if (this.expandedItems.has(itemId)) {
        // Si está expandido, colapsarlo
        this.expandedItems.delete(itemId);
      } else {
        // Si no está expandido, cerrar todos los otros y abrir este
        this.expandedItems.clear();
        this.expandedItems.add(itemId);
      }
    }
  }

  toggleCollapse(): void {
    this.isCollapsed = !this.isCollapsed;
    
    // Cerrar todos los items expandidos cuando se colapsa
    if (this.isCollapsed) {
      this.expandedItems.clear();
    } else {
      // Re-expandir items basado en ruta actual
      this.updateExpandedItems();
    }
    
    // Guardar estado si está habilitado
    if (this.config.persistCollapsedState) {
      this.saveCollapsedState();
    }
    
    this.collapseChange.emit(this.isCollapsed);
  }

  closeSidebar(): void {
    console.log('Sidebar closeSidebar called'); // Debug
    this.toggleSidebar.emit();
    this.updateBodyScroll();
  }

  private updateBodyScroll(): void {
    console.log('UpdateBodyScroll - isDesktop:', this.isDesktop, 'isOpen:', this.isOpen); // Debug
    
    // Prevenir scroll del body cuando sidebar está abierto en móvil
    if (!this.isDesktop) {
      if (this.isOpen) {
        document.body.classList.add('sidebar-mobile-open');
        document.body.style.overflow = 'hidden';
      } else {
        document.body.classList.remove('sidebar-mobile-open');
        document.body.style.overflow = '';
      }
    } else {
      // En desktop, siempre permitir scroll
      document.body.classList.remove('sidebar-mobile-open');
      document.body.style.overflow = '';
    }
  }

  getSidebarLinkClasses(): string {
    return this.isCollapsed 
      ? 'px-3 py-3 justify-center' 
      : 'px-4 py-4';
  }

  getTooltipText(item: SidebarMenuItem): string | null {
    if (this.isCollapsed) {
      return item.tooltip || item.label;
    }
    return item.tooltip || null;
  }

  private updateExpandedItems(): void {
    if (this.isCollapsed && this.isDesktop) return;
    
    // Encontrar items padre que deberían estar expandidos basado en la ruta actual
    // Pero solo expandir uno a la vez
    let foundActiveParent = false;
    this.config.items.forEach(item => {
      if (item.children && !foundActiveParent) {
        const hasActiveChild = item.children.some(child => this.isItemActive(child));
        if (hasActiveChild) {
          this.expandedItems.clear(); // Cerrar todos los otros
          this.expandedItems.add(item.id);
          foundActiveParent = true;
        }
      }
    });
  }

  private checkScreenSize(): void {
    const wasDesktop = this.isDesktop;
    this.isDesktop = window.innerWidth >= 1024; // lg breakpoint
    
    // En móvil, nunca colapsar el sidebar, solo cerrar/abrir
    if (!this.isDesktop) {
      this.isCollapsed = false;
      // Si cambió de desktop a móvil, cerrar el sidebar
      if (wasDesktop && !this.isDesktop) {
        this.closeSidebar();
      }
    } else {
      // Si cambió de móvil a desktop, abrir el sidebar
      if (!wasDesktop && this.isDesktop && !this.isOpen) {
        this.toggleSidebar.emit();
      }
    }
  }

  private saveCollapsedState(): void {
    try {
      localStorage.setItem('sidebar-collapsed', JSON.stringify(this.isCollapsed));
    } catch (error) {
      console.warn('Could not save sidebar collapsed state:', error);
    }
  }

  private restoreCollapsedState(): void {
    try {
      const saved = localStorage.getItem('sidebar-collapsed');
      if (saved !== null) {
        this.isCollapsed = JSON.parse(saved);
      }
    } catch (error) {
      console.warn('Could not restore sidebar collapsed state:', error);
    }
  }
}