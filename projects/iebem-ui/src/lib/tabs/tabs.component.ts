import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface TabItem {
  id?: string;
  label: string;
  icon?: string;
  disabled?: boolean;
  badge?: string | number;
}

@Component({
  selector: 'app-iebem-tabs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tabs.component.html'
})
export class TabsComponent {
  @Input() tabs: TabItem[] = [];
  @Input() activeIndex = 0;
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() fitted = false; // que se repartan el ancho

  @Output() activeIndexChange = new EventEmitter<number>();
  @Output() tabSelected = new EventEmitter<number>();

  sizes = {
    sm: { btn: 'px-3 py-2 text-sm', gap: 'gap-3', badge: 'text-[10px] px-1.5 py-0.5' },
    md: { btn: 'px-4 py-2.5 text-sm', gap: 'gap-4', badge: 'text-xs px-2 py-0.5' },
    lg: { btn: 'px-5 py-3 text-base', gap: 'gap-5', badge: 'text-sm px-2.5 py-0.5' },
  } as const;

  select(i: number) {
    const t = this.tabs[i];
    if (!t || t.disabled) return;
    this.activeIndex = i;
    this.activeIndexChange.emit(i);
    this.tabSelected.emit(i);
  }

  btnClass(i: number, t: TabItem): string {
    const base = `relative ${this.sizes[this.size].btn} transition-colors duration-150 border-b-2`;
    const state = t.disabled
      ? 'text-gray-400 border-transparent cursor-not-allowed'
      : (i === this.activeIndex
          ? 'text-iebem-primary border-iebem-primary'
          : 'text-gray-600 hover:text-gray-800 border-transparent hover:border-gray-300');
    const fit = this.fitted ? 'flex-1 text-center' : '';
    return [base, state, fit].filter(Boolean).join(' ');
  }
}

