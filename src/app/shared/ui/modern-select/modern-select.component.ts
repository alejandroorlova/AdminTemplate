import { Component, Input, forwardRef, ViewChild, ElementRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormFieldComponent } from '../form-field/form-field.component';
import { SelectOption } from '../../types/common.types';

@Component({
  selector: 'app-modern-select',
  standalone: true,
  imports: [CommonModule, FormsModule, FormFieldComponent],
  templateUrl: './modern-select.component.html',
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
  @Input() id = '';
  @Input() searchable = false; // Por defecto FALSE - búsqueda deshabilitada

  @ViewChild('searchInput') searchInput!: ElementRef;

  value: any = null;
  isOpen = false;
  touched = false;
  searchTerm = '';
  selectedOption: SelectOption | null = null;

  private onChangeCallback = (value: any) => {};
  private onTouchedCallback = () => {};

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
    const baseClasses = 'fas fa-chevron-down text-gray-400 text-sm transition-transform duration-200';
    return this.isOpen ? `${baseClasses} rotate-180` : baseClasses;
  }

  toggleDropdown(): void {
    if (this.isOpen) {
      this.closeDropdown();
      return;
    }
    this.isOpen = true;
    this.searchTerm = '';
    if (this.searchable) {
      setTimeout(() => {
        this.searchInput?.nativeElement?.focus();
      }, 100);
    }
  }

  closeDropdown(): void {
    this.isOpen = false;
    this.searchTerm = '';
    this.touched = true;
    this.onTouchedCallback();
  }

  selectOption(option: SelectOption): void {
    if (option.disabled) return;
    
    this.selectedOption = option;
    this.value = option.value;
    this.onChangeCallback(this.value);
    this.closeDropdown();
  }

  onSearchChange(): void {
    // La búsqueda se maneja en getFilteredOptions()
  }

  getFilteredOptions(): SelectOption[] {
    if (!this.searchable || !this.searchTerm) {
      return this.options;
    }
    
    const searchLower = this.searchTerm.toLowerCase();
    return this.options.filter(option =>
      option.label.toLowerCase().includes(searchLower) ||
      (option.description && option.description.toLowerCase().includes(searchLower))
    );
  }

  getOptionClasses(option: SelectOption): string {
    const baseClasses = 'w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:bg-gray-50';
    const selectedClasses = this.isSelected(option) ? 'bg-iebem-light text-iebem-dark' : '';
    const disabledClasses = option.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';
    
    return `${baseClasses} ${selectedClasses} ${disabledClasses}`;
  }

  isSelected(option: SelectOption): boolean {
    return this.value === option.value;
  }

  writeValue(value: any): void {
    this.value = value;
    this.selectedOption = this.options.find(option => option.value === value) || null;
  }

  registerOnChange(fn: (value: any) => void): void {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouchedCallback = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    // Implementar si es necesario
  }
}
