import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
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

  constructor() {
    this.checkScreenSize();
    window.addEventListener('resize', () => this.checkScreenSize());
  }

  private checkScreenSize(): void {
    const mobile = window.innerWidth < 1024;
    this.isMobile.set(mobile);
    
    if (mobile) {
      this.isSidebarOpen.set(false);
    } else {
      this.isSidebarOpen.set(true);
    }
  }

  toggleSidebar(): void {
    this.isSidebarOpen.update(value => !value);
  }

  closeSidebar(): void {
    if (this.isMobile()) {
      this.isSidebarOpen.set(false);
    }
  }
}