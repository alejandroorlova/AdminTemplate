import { Component, Input, forwardRef, ChangeDetectionStrategy } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormFieldComponent } from '../form-field/form-field.component';

interface SelectOption {
  value: any;
  label: string;
  disabled?: boolean;
}

@Component({
  selector: 'app-iebem-select',
  standalone: true,
  imports: [CommonModule, FormFieldComponent],
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
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
  @Input() uppercase = false;
  @Input() compareWith?: (a: any, b: any) => boolean;

  value: any = '';
  isFocused = false;
  touched = false;

  trackOpt = (_: number, o: SelectOption) => o?.value ?? o;

  private onChangeCallback = (value: any) => {};
  private onTouchedCallback = () => {};

  get showError(): boolean {
    const hasExternalError = !!(this.error && this.error.trim());
    const isEmpty = this.value === null || this.value === undefined || this.value === '';
    return hasExternalError || (this.required && isEmpty && this.touched);
  }

  get selectClasses(): string {
    const variant = this.showError ? 'input-error' : 'input-default';
    const padding = 'py-3 pl-4 pr-10';
    const disabled = this.disabled ? 'input-disabled' : '';
    const transform = this.uppercase ? 'uppercase' : '';
    const base = 'appearance-none cursor-pointer';
    return [variant, padding, disabled, transform, base].filter(Boolean).join(' ');
  }

  onChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const idx = target.selectedIndex - 1; // first option is placeholder
    const opt = idx >= 0 && idx < this.options.length ? this.options[idx] : null;
    this.value = opt ? opt.value : null;
    this.onChangeCallback(this.value);
  }

  onBlur(): void { this.isFocused = false; this.touched = true; this.onTouchedCallback(); }
  onFocus(): void { this.isFocused = true; }

  writeValue(value: any): void { this.value = value ?? ''; }
  registerOnChange(fn: (value: any) => void): void { this.onChangeCallback = fn; }
  registerOnTouched(fn: () => void): void { this.onTouchedCallback = fn; }
  setDisabledState(isDisabled: boolean): void { this.disabled = isDisabled; }

  equals(a: any, b: any): boolean { return this.compareWith ? this.compareWith(a, b) : a === b; }
}
