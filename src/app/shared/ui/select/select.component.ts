import { Component, Input, forwardRef, ChangeDetectionStrategy } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormFieldComponent } from '../form-field/form-field.component';
import { SelectOption } from '../../types/common.types';

@Component({
  selector: 'app-select',
  standalone: true,
  imports: [CommonModule, FormFieldComponent],
  templateUrl: './select.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
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
  @Input() compareWith?: (a: any, b: any) => boolean;


  value = '';
  isFocused = false;
  trackOpt = (_: number, o: SelectOption) => o?.value ?? o;

  private onChangeCallback = (value: any) => { };
  private onTouchedCallback = () => { };

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
    // Considera que el primer <option> es el placeholder
    const idx = target.selectedIndex - 1;
    const opt = (idx >= 0 && idx < this.options.length) ? this.options[idx] : null;
    this.value = opt ? opt.value : null;
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

  equals(a: any, b: any): boolean {
    return this.compareWith ? this.compareWith(a, b) : a === b;
  }

}