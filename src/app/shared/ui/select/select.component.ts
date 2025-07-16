import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';

export interface SelectOption {
  value: any;
  label: string;
  disabled?: boolean;
}

@Component({
  selector: 'app-select',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './select.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true
    }
  ]
})
export class SelectComponent implements ControlValueAccessor {
  @Input() label = '';
  @Input() placeholder = 'Selecciona una opción';
  @Input() options: SelectOption[] = [];
  @Input() disabled = false;
  @Input() required = false;
  @Input() error = '';
  @Input() hint = '';
  @Input() id = '';

  value = '';
  isFocused = false;

  private onChangeCallback = (value: any) => {};
  private onTouchedCallback = () => {};

  get selectClasses(): string {
    const baseClasses = 'block w-full rounded-xl border-0 py-3 px-4 pr-10 shadow-sm ring-1 ring-inset transition-all duration-200 focus:ring-2 focus:ring-inset text-gray-900 appearance-none cursor-pointer';
    
    let stateClasses = '';
    if (this.error) {
      stateClasses = 'ring-red-300 focus:ring-red-500 bg-red-50';
    } else if (this.isFocused) {
      stateClasses = 'ring-iebem-primary focus:ring-iebem-primary bg-white';
    } else {
      stateClasses = 'ring-gray-300 focus:ring-iebem-primary bg-white hover:ring-gray-400';
    }

    const disabledClasses = this.disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed ring-gray-200' : '';

    return `${baseClasses} ${stateClasses} ${disabledClasses}`;
  }

  onChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.value = target.value;
    this.onChangeCallback(this.value);
  }

  onBlur(): void {
    this.isFocused = false;
    this.onTouchedCallback();
  }

  onFocus(): void {
    this.isFocused = true;
  }

  writeValue(value: any): void {
    this.value = value || '';
  }

  registerOnChange(fn: (value: any) => void): void {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouchedCallback = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}