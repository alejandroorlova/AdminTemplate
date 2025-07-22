// shared/ui/sidebar/sidebar.component.ts - ACTUALIZADO
import { Component, Input, Output, EventEmitter, OnInit, HostListener, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd, NavigationError } from '@angular/router';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

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
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit, OnDestroy {
  @Input() 
  set isOpen(value: boolean) {
    console.log('Sidebar: isOpen changed to:', value); // Debug
    this._isOpen = value;
    this.updateBodyScroll();
  }
  
  get isOpen(): boolean {
    return this._isOpen;
  }
  
  private _isOpen = true;
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
  private destroy$ = new Subject<void>(); // Para cleanup de subscriptions

  constructor(private router: Router) {}

  ngOnInit(): void {
    console.log('Sidebar init - isOpen:', this.isOpen); // Debug
    
    // Restaurar estado colapsado si está habilitado
    if (this.config.persistCollapsedState) {
      this.restoreCollapsedState();
    }

    // Subscribe to route changes para cerrar menú en móvil tras navegación
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd || event instanceof NavigationError),
        takeUntil(this.destroy$)
      )
      .subscribe((event) => {
        if (event instanceof NavigationEnd) {
          console.log('Navigation completed successfully to:', event.url); // Debug
          this.currentRoute = event.url;
          this.updateExpandedItems();
          
          // Cerrar sidebar en móvil después de navegación exitosa
          if (!this.isDesktop && this.isOpen) {
            console.log('Mobile navigation completed - closing sidebar');
            this.collapseAllSubmenus();
            setTimeout(() => {
              this.closeSidebar();
            }, 100);
          }
        } else if (event instanceof NavigationError) {
          console.log('Navigation failed:', event.error); // Debug
          // En caso de error, también cerrar en móvil para no dejar colgado
          if (!this.isDesktop && this.isOpen) {
            console.log('Navigation failed - still closing sidebar in mobile');
            setTimeout(() => {
              this.closeSidebar();
            }, 500); // Más delay en caso de error
          }
        }
      });

    this.currentRoute = this.router.url;
    this.updateExpandedItems();
    this.checkScreenSize();
    
    // Manejar el estado del sidebar en móvil
    this.updateBodyScroll();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    
    // Limpiar estilos del body al destruir el componente
    document.body.classList.remove('sidebar-mobile-open');
    document.body.style.overflow = '';
  }

  @HostListener('window:resize')
  onResize(): void {
    this.checkScreenSize();
    this.updateBodyScroll();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    // SOLUCIÓN: Solo cerrar si estamos en móvil, el sidebar está abierto, 
    // y NO se hizo click en el botón del header o en el sidebar mismo
    if (!this.isDesktop && this.isOpen) {
      const target = event.target as HTMLElement;
      const sidebar = target.closest('.sidebar-container');
      const headerButton = target.closest('button'); // Cualquier botón
      const header = target.closest('header'); // Todo el header
      
      // Solo cerrar si NO se hizo click en sidebar, header o botón
      if (!sidebar && !header && !headerButton) {
        console.log('Document click detected outside sidebar/header, closing sidebar');
        this.closeSidebar();
      } else {
        console.log('Document click detected on:', { sidebar: !!sidebar, header: !!header, button: !!headerButton });
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

    console.log('Item clicked:', item.label, 'Has children:', this.hasChildren(item)); // Debug

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
      console.log('Navigating to:', item.route); // Debug
      
      if (item.target === '_blank') {
        window.open(item.route, '_blank');
      } else {
        // Solo navegar - el router se encargará de cerrar el sidebar en móvil
        this.router.navigate([item.route]);
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
    
    // EN MÓVIL: Colapsar todos los submenús al cerrar sidebar
    if (!this.isDesktop) {
      console.log('Mobile detected - collapsing all submenus before closing');
      this.collapseAllSubmenus();
    }
    
    this.toggleSidebar.emit();
    this.updateBodyScroll();
  }

  // Método público para colapsar todos los submenús
  collapseAllSubmenus(): void {
    console.log('Collapsing all submenus, current expanded:', Array.from(this.expandedItems));
    this.expandedItems.clear();
    console.log('All submenus collapsed');
  }

  private updateBodyScroll(): void {
    console.log('UpdateBodyScroll - isDesktop:', this.isDesktop, 'isOpen:', this.isOpen); // Debug
    
    // Prevenir scroll del body cuando sidebar está abierto en móvil
    if (!this.isDesktop) {
      if (this.isOpen) {
        document.body.classList.add('sidebar-mobile-open');
        document.body.style.overflow = 'hidden';
        
        // NUEVA FUNCIONALIDAD: Al abrir en móvil, colapsar todos los submenús para empezar limpio
        console.log('Mobile sidebar opened - starting with collapsed submenus');
        this.collapseAllSubmenus();
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
      // Si cambió de desktop a móvil, cerrar el sidebar y colapsar submenús
      if (wasDesktop && !this.isDesktop) {
        console.log('Changed from desktop to mobile - closing sidebar and collapsing submenus');
        this.collapseAllSubmenus();
        this.closeSidebar();
      }
    } else {
      // Si cambió de móvil a desktop, abrir el sidebar y restaurar submenús activos
      if (!wasDesktop && this.isDesktop && !this.isOpen) {
        console.log('Changed from mobile to desktop - opening sidebar and updating expanded items');
        this.toggleSidebar.emit();
        // Restaurar submenús basados en la ruta actual
        setTimeout(() => {
          this.updateExpandedItems();
        }, 100);
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