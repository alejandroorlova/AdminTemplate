import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-iebem-pagination',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pagination.component.html'
})
export class PaginationComponent {
  @Input() totalItems = 0;
  @Input() pageSize = 10;
  @Input() currentPage = 1;
  @Input() boundaryCount = 1;
  @Input() siblingCount = 1;
  @Input() showFirstLast = true;
  @Input() showPrevNext = true;
  @Input() size: 'sm' | 'md' | 'lg' = 'md';

  @Output() pageChange = new EventEmitter<number>();

  get totalPages(): number { return Math.max(1, Math.ceil(this.totalItems / Math.max(1, this.pageSize))); }
  get isFirst(): boolean { return this.currentPage <= 1; }
  get isLast(): boolean { return this.currentPage >= this.totalPages; }

  private range(start: number, end: number): number[] { return Array.from({ length: end - start + 1 }, (_, i) => start + i); }

  get pages(): (number | '...')[] {
    const total = this.totalPages;
    const c = this.currentPage;
    const boundary = this.boundaryCount;
    const sibling = this.siblingCount;
    const startList = this.range(1, Math.min(boundary, total));
    const endList = this.range(Math.max(total - boundary + 1, boundary + 1), total);
    const start = Math.max(boundary + 1, c - sibling);
    const end = Math.min(total - boundary, c + sibling);
    const middle = start <= end ? this.range(start, end) : [];
    const list: (number | '...')[] = [...startList];
    if (start > boundary + 1) list.push('...');
    list.push(...middle);
    if (end < total - boundary) list.push('...');
    list.push(...endList);
    return list;
  }

  goTo(page: any) {
    if (typeof page !== 'number') return;
    if (page < 1 || page > this.totalPages || page === this.currentPage) return;
    this.currentPage = page;
    this.pageChange.emit(this.currentPage);
  }
  first() { if (!this.isFirst) this.goTo(1); }
  last() { if (!this.isLast) this.goTo(this.totalPages); }
  prev() { if (!this.isFirst) this.goTo(this.currentPage - 1); }
  next() { if (!this.isLast) this.goTo(this.currentPage + 1); }

  btnClass(active = false): string {
    const size = this.size === 'sm' ? 'btn-sm' : this.size === 'lg' ? 'btn-lg' : 'btn-md';
    return active ? `btn-primary ${size}` : `btn-outline ${size}`;
  }
}
