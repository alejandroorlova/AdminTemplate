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
  selector: 'app-iebem-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit, OnDestroy {
  @Input()
  set isOpen(value: boolean) {
    this._isOpen = value;
    this.updateBodyScroll();
  }
  get isOpen(): boolean { return this._isOpen; }
  private _isOpen = true;

  @Input() config: SidebarConfig = {
    logo: { icon: 'graduation-cap', title: 'IEBEM', subtitle: 'Admin Panel' },
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

  isCollapsed = false;
  isDesktop = true;
  expandedItems = new Set<string>();
  currentRoute = '';
  private destroy$ = new Subject<void>();

  constructor(private router: Router) {}

  ngOnInit(): void {
    if (this.config.persistCollapsedState) this.restoreCollapsedState();
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd || e instanceof NavigationError), takeUntil(this.destroy$))
      .subscribe(event => {
        if (event instanceof NavigationEnd) {
          this.currentRoute = event.url;
          this.updateExpandedItems();
          if (!this.isDesktop && this.isOpen) {
            this.collapseAllSubmenus();
            setTimeout(() => this.closeSidebar(), 100);
          }
        } else if (event instanceof NavigationError) {
          if (!this.isDesktop && this.isOpen) setTimeout(() => this.closeSidebar(), 500);
        }
      });
    this.checkScreenSize();
    this.updateBodyScroll();
  }

  ngOnDestroy(): void {
    this.destroy$.next(); this.destroy$.complete();
    document.body.classList.remove('sidebar-mobile-open');
    document.body.style.overflow = '';
  }

  @HostListener('window:resize') onResize(): void { this.checkScreenSize(); this.updateBodyScroll(); }
  @HostListener('document:click', ['$event']) onDocumentClick(event: Event): void {
    if (!this.isDesktop && this.isOpen) {
      const target = event.target as HTMLElement;
      const sidebar = target.closest('[data-role="sidebar"]');
      const headerButton = target.closest('button');
      const header = target.closest('header');
      if (!sidebar && !header && !headerButton) this.closeSidebar();
    }
  }

  trackByItemId(_: number, item: SidebarMenuItem) { return item.id; }
  hasChildren(item: SidebarMenuItem) { return !!(item.children && item.children.length); }
  isExpanded(id: string) { return this.expandedItems.has(id); }
  isItemActive(item: SidebarMenuItem): boolean {
    if (item.route) return this.currentRoute === item.route || this.currentRoute.startsWith(item.route + '/');
    if (item.children) return item.children.some(c => this.isItemActive(c));
    return false;
  }
  isItemVisible(item: SidebarMenuItem) { return !item.hidden; }
  get logoConfig() { return this.config.logo || { icon: 'graduation-cap', title: 'IEBEM', subtitle: 'Admin Panel' }; }

  handleItemClick(item: SidebarMenuItem) {
    if (item.disabled) return;
    if (this.hasChildren(item)) this.toggleExpansion(item.id);
    if (item.onClick) item.onClick();
    if (item.route && !this.hasChildren(item)) {
      if (item.target === '_blank') window.open(item.route, '_blank');
      else this.router.navigate([item.route]);
    }
    // Cerrar inmediatamente en móvil tras seleccionar una opción (hoja)
    if (!this.isDesktop && item.route && !this.hasChildren(item)) {
      this.collapseAllSubmenus();
      this.closeSidebar();
    }
    this.itemClick.emit(item);
  }
  // Click en enlaces con routerLink (anclas del template)
  onNavigateClick(_event: MouseEvent, item: SidebarMenuItem) {
    if (!this.isDesktop) {
      this.collapseAllSubmenus();
      // Cerrar sin esperar a NavigationEnd
      this.closeSidebar();
    }
  }
  handleLogoClick() { if (this.logoConfig.onClick) this.logoConfig.onClick(); this.logoClick.emit(); }
  toggleExpansion(id: string) { if (!this.isDesktop || !this.isCollapsed) { this.expandedItems.has(id) ? this.expandedItems.delete(id) : (this.expandedItems.clear(), this.expandedItems.add(id)); } }
  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;
    if (this.isCollapsed) this.expandedItems.clear(); else this.updateExpandedItems();
    if (this.config.persistCollapsedState) this.saveCollapsedState();
    this.collapseChange.emit(this.isCollapsed);
  }
  closeSidebar() {
    if (!this.isDesktop) this.collapseAllSubmenus();
    this.toggleSidebar.emit();
    this.updateBodyScroll();
  }
  collapseAllSubmenus() { this.expandedItems.clear(); }
  getSidebarLinkClasses(): string { return this.isCollapsed ? 'px-3 py-3 justify-center' : 'px-4 py-4'; }
  private updateBodyScroll() {
    if (!this.isDesktop) {
      if (this.isOpen) { document.body.classList.add('sidebar-mobile-open'); document.body.style.overflow = 'hidden'; this.collapseAllSubmenus(); }
      else { document.body.classList.remove('sidebar-mobile-open'); document.body.style.overflow = ''; }
    } else { document.body.classList.remove('sidebar-mobile-open'); document.body.style.overflow = ''; }
  }
  private updateExpandedItems() {
    if (this.isCollapsed && this.isDesktop) return;
    let found = false;
    this.config.items.forEach(item => {
      if (item.children && !found) {
        const hasActive = item.children.some(c => this.isItemActive(c));
        if (hasActive) { this.expandedItems.clear(); this.expandedItems.add(item.id); found = true; }
      }
    });
  }
  private checkScreenSize() {
    const wasDesktop = this.isDesktop;
    this.isDesktop = window.innerWidth >= 1024;
    if (!this.isDesktop) {
      this.isCollapsed = false;
      if (wasDesktop && !this.isDesktop) { this.collapseAllSubmenus(); this.closeSidebar(); }
    } else if (!wasDesktop && this.isDesktop && !this.isOpen) {
      this.toggleSidebar.emit(); setTimeout(() => this.updateExpandedItems(), 100);
    }
  }
  private saveCollapsedState() { try { localStorage.setItem('sidebar-collapsed', JSON.stringify(this.isCollapsed)); } catch {} }
  private restoreCollapsedState() { try { const s = localStorage.getItem('sidebar-collapsed'); if (s !== null) this.isCollapsed = JSON.parse(s); } catch {} }
}
