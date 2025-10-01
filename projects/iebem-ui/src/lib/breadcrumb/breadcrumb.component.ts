import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BreadcrumbItem } from './breadcrumb.types';

@Component({
  selector: 'app-iebem-breadcrumb',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './breadcrumb.component.html'
})
export class BreadcrumbComponent {
  @Input() items: BreadcrumbItem[] = [];
  @Input() separator: 'slash' | 'chevron' = 'chevron';
  @Input() ariaLabel = 'Breadcrumb';
  @Input() truncate = true; // truncar labels largos

  isLast(i: number) { return i === this.items.length - 1; }
}

