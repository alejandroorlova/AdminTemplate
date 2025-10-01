// iebem-ui: Modern Select (library)
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormFieldComponent } from '../form-field/form-field.component';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  Input,
  Output,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export interface SelectOption {
  value: any;
  label: string;
  disabled?: boolean;
  icon?: string;
  description?: string;
}

@Component({
  selector: 'app-iebem-modern-select',
  standalone: true,
  imports: [CommonModule, FormsModule, FormFieldComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './modern-select.component.html',
  styleUrls: ['./modern-select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ModernSelectComponent),
      multi: true
    }
  ]
})
export class ModernSelectComponent implements ControlValueAccessor {
  @Input() label = '';
  @Input() placeholder = 'Selecciona una opción';
  @Input() options: SelectOption[] = [];
  @Input() required = false;
  @Input() error = '';
  @Input() hint = '';
  @Input() id = '';
  @Input() searchable = false;

  @Output() opened = new EventEmitter<void>();
  @Output() closed = new EventEmitter<void>();

  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;

  value: any = null;
  isOpen = false;
  touched = false;
  searchTerm = '';
  selectedOption: SelectOption | null = null;

  private onChangeCallback = (value: any) => {};
  private onTouchedCallback = () => {};

  ngOnInit(): void {
    if (!this.id) this.id = `iebem-ms-${Math.random().toString(36).slice(2, 9)}`;
  }

  get showError(): boolean {
    const hasExternalError = !!(this.error && this.error.trim());
    const isEmpty = this.value === null || this.value === undefined || this.value === '';
    return hasExternalError || (this.required && isEmpty && this.touched);
  }

  get triggerClasses(): string {
    const variant = this.showError ? 'input-error' : 'input-default';
    const layout = 'relative w-full flex items-center justify-between cursor-pointer';
    const openClasses = this.isOpen ? 'ring-2 ring-inset ring-iebem-primary' : '';
    return [variant, layout, openClasses].filter(Boolean).join(' ');
  }

  get arrowClasses(): string {
    const base = 'fas fa-chevron-down text-gray-400 text-sm transition-transform duration-200';
    return this.isOpen ? `${base} rotate-180` : base;
  }

  toggleDropdown(): void {
    if (this.isOpen) { this.closeDropdown(); return; }
    this.isOpen = true;
    this.searchTerm = '';
    this.opened.emit();
    if (this.searchable) {
      setTimeout(() => this.searchInput?.nativeElement?.focus(), 0);
    }
  }

  closeDropdown(): void {
    this.isOpen = false;
    this.searchTerm = '';
    this.touched = true;
    this.onTouchedCallback();
    this.closed.emit();
  }

  selectOption(option: SelectOption): void {
    if (option.disabled) return;
    this.selectedOption = option;
    this.value = option.value;
    this.onChangeCallback(this.value);
    this.closeDropdown();
  }

  onSearchChange(): void {}

  getFilteredOptions(): SelectOption[] {
    if (!this.searchable || !this.searchTerm) return this.options;
    const q = this.searchTerm.toLowerCase();
    return this.options.filter(o =>
      o.label.toLowerCase().includes(q) || (!!o.description && o.description.toLowerCase().includes(q))
    );
  }

  getOptionClasses(option: SelectOption): string {
    const base = 'w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:bg-gray-50';
    const selected = this.isSelected(option) ? 'bg-iebem-light text-iebem-dark' : '';
    const disabled = option.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';
    return `${base} ${selected} ${disabled}`;
  }

  isSelected(option: SelectOption): boolean { return this.value === option.value; }

  // CVA
  writeValue(value: any): void {
    this.value = value;
    this.selectedOption = this.options.find(o => o.value === value) || null;
  }
  registerOnChange(fn: (value: any) => void): void { this.onChangeCallback = fn; }
  registerOnTouched(fn: () => void): void { this.onTouchedCallback = fn; }
  setDisabledState(isDisabled: boolean): void {}
}
