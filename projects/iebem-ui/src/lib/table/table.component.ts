import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableColumn, TableConfig, TableAction } from './table.interfaces';

@Component({
  selector: 'app-iebem-table',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit, OnChanges {
  @Input() data: any[] = [];
  @Input() columns: TableColumn[] = [];
  @Input() config: TableConfig = {};
  @Input() actions: TableAction[] = [];
  @Input() loading: boolean = false;
  @Input() title: string = '';
  @Input() subtitle: string = '';
  @Input() emptyMessage: string = 'No hay datos disponibles';

  @Output() rowClick = new EventEmitter<any>();
  @Output() actionClick = new EventEmitter<{ action: TableAction, row: any }>();
  @Output() sortChange = new EventEmitter<{ column: string, direction: 'asc' | 'desc' }>();
  @Output() filterChange = new EventEmitter<string>();
  @Output() pageChange = new EventEmitter<number>();

  processedData: any[] = [];
  currentPage: number = 1;
  pageSize: number = 10;
  totalItems: number = 0;
  globalSearch: string = '';
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  trackByIndex = (index: number) => index;

  ngOnInit(): void {
    this.applyDefaults();
    this.updateProcessedData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] || changes['config']) this.updateProcessedData();
  }

  private applyDefaults(): void {
    this.config = {
      hoverable: true,
      striped: false,
      bordered: false,
      compact: false,
      stickyHeader: false,
      headerStyle: 'glass',
      pagination: { enabled: true, pageSize: 10 },
      sorting: { enabled: true },
      filtering: { enabled: true, globalSearch: true },
      ...this.config
    };
    this.pageSize = this.config.pagination?.pageSize || 10;
    if (this.config.sorting?.defaultSort) {
      this.sortColumn = this.config.sorting.defaultSort.column;
      this.sortDirection = this.config.sorting.defaultSort.direction;
    }
  }

  private updateProcessedData(): void {
    let result = [...this.data];
    if (this.globalSearch && this.config.filtering?.globalSearch) result = this.applyGlobalSearch(result);
    if (this.sortColumn && this.config.sorting?.enabled) result = this.applySort(result);
    this.totalItems = result.length;
    if (this.config.pagination?.enabled) {
      const start = (this.currentPage - 1) * this.pageSize;
      result = result.slice(start, start + this.pageSize);
    }
    this.processedData = result;
  }

  private applyGlobalSearch(rows: any[]): any[] {
    const q = this.globalSearch.toLowerCase();
    return rows.filter(row => this.columns.some(c => String(row[c.key] ?? '').toLowerCase().includes(q)));
  }

  private applySort(rows: any[]): any[] {
    const col = this.sortColumn;
    const dir = this.sortDirection === 'asc' ? 1 : -1;
    return [...rows].sort((a, b) => {
      const va = a[col]; const vb = b[col];
      if (va == null && vb == null) return 0;
      if (va == null) return -1 * dir;
      if (vb == null) return 1 * dir;
      if (typeof va === 'number' && typeof vb === 'number') return (va - vb) * dir;
      return String(va).localeCompare(String(vb)) * dir;
    });
  }

  toggleSort(col: TableColumn): void {
    if (!this.config.sorting?.enabled || !col.sortable) return;
    if (this.sortColumn === col.key) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = col.key;
      this.sortDirection = 'asc';
    }
    this.sortChange.emit({ column: this.sortColumn, direction: this.sortDirection });
    this.updateProcessedData();
  }

  onSearchChange(): void {
    this.filterChange.emit(this.globalSearch);
    this.currentPage = 1;
    this.updateProcessedData();
  }

  onPageChange(page: number): void {
    if (page < 1) return;
    const totalPages = this.getTotalPages();
    if (page > totalPages) return;
    this.currentPage = page;
    this.pageChange.emit(page);
    this.updateProcessedData();
  }

  getTotalPages(): number {
    if (!this.config.pagination?.enabled) return 1;
    return Math.max(1, Math.ceil(this.totalItems / this.pageSize));
  }

  onRowClick(row: any): void { this.rowClick.emit(row); }
  onAction(action: TableAction, row: any, ev?: Event): void { if (ev) ev.stopPropagation(); this.actionClick.emit({ action, row }); }

  getColumnValue(row: any, key: string): any { return row?.[key]; }

  getHeaderStyleClass(): string {
    const style = this.config.headerStyle || 'glass';
    return {
      primary: 'tbl-head tbl-head--primary',
      glass: 'tbl-head tbl-head--glass',
      gradient: 'tbl-head tbl-head--gradient',
      soft: 'tbl-head tbl-head--soft',
    }[style];
  }

  // Librería: utilidades para acciones y columnas
  hasActionsColumn(): boolean {
    return this.columns.some(c => c.type === 'actions' || c.key === 'actions');
  }

  getRenderColumns(): TableColumn[] { return this.columns; }

  getActionBtnClasses(action: TableAction): string {
    const colorKey = (action.color as string | undefined) || (action as any).variant || (action as any).type;
    const map: Record<string, string> = {
      primary: 'btn-primary',
      secondary: 'btn-secondary',
      success: 'btn-success',
      warning: 'btn-warning',
      danger: 'btn-danger',
      info: 'btn-info',
      dark: 'btn-dark',
      light: 'btn-light',
      outline: 'btn-outline'
    };
    const base = (colorKey && map[colorKey]) ? map[colorKey] : 'btn-outline';
    return `${base} btn-icon tbl-action-btn`;
  }
}
