// header.component.ts - CON DEBUG
import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  @Output() toggleSidebar = new EventEmitter<void>();

  onToggleSidebar(): void {
    console.log('Header: onToggleSidebar called'); // ← AGREGAR ESTE LOG
    this.toggleSidebar.emit();
    console.log('Header: toggleSidebar event emitted'); // ← AGREGAR ESTE LOG
  }
}