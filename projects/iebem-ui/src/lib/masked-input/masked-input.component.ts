// iebem-ui: Masked Input component (library)
import { CommonModule } from '@angular/common';
import { FormFieldComponent } from '../form-field/form-field.component';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  forwardRef,
  Input,
  Output,
  ViewEncapsulation
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export type MaskType = 'phone' | 'rfc' | 'curp' | 'postal' | 'custom';

@Component({
  selector: 'app-iebem-masked-input',
  standalone: true,
  imports: [CommonModule, FormFieldComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './masked-input.component.html',
  styleUrls: ['./masked-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MaskedInputComponent),
      multi: true
    }
  ]
})
export class MaskedInputComponent implements ControlValueAccessor {
  @Input() label = '';
  @Input() maskType: MaskType = 'custom';
  @Input() customMask = '';
  @Input() placeholder = '';
  @Input() uppercase = true;
  @Input() disabled = false;
  @Input() readonly = false;
  @Input() required = false;
  @Input() error = '';
  @Input() hint = '';
  @Input() icon = '';
  @Input() id = '';
  @Input() validatePattern = true;

  @Output() focus = new EventEmitter<void>();
  @Output() blur = new EventEmitter<void>();

  value = '';
  displayValue = '';
  touched = false;
  isValid: boolean | null = null;

  private onChange = (value: string) => {};
  private onTouched = () => {};

  private masks: Record<MaskType, string> = {
    phone: '(000) 000-0000',
    rfc: 'AAAA000000AAA',
    curp: 'AAAA000000AAAAAA00',
    postal: '00000',
    custom: this.customMask
  };

  private patterns: Record<MaskType, RegExp> = {
    phone: /^\(\d{3}\) \d{3}-\d{4}$/,
    rfc: /^[A-Z]{3,4}\d{6}[A-Z0-9]{3}$/,
    curp: /^[A-Z]{4}\d{6}[HM][A-Z]{5}[A-Z0-9]\d$/,
    postal: /^\d{5}$/,
    custom: new RegExp('.*')
  };

  ngOnInit(): void {
    if (!this.id) {
      this.id = `iebem-masked-input-${Math.random().toString(36).slice(2, 9)}`;
    }
  }

  get currentMask(): string {
    return this.maskType === 'custom' ? this.customMask : this.masks[this.maskType];
  }

  get inputClasses(): string {
    const variant = this.error
      ? 'input-error'
      : this.isValid === true
        ? 'input-success'
        : 'input-default';
    const padLeft = this.icon ? 'pl-10' : 'pl-4';
    const padRight = 'pr-10';
    const padY = 'py-3';
    const disabled = this.disabled ? 'input-disabled' : '';
    const transform = this.uppercase ? 'uppercase' : '';
    return [variant, padLeft, padRight, padY, disabled, 'font-mono', transform].filter(Boolean).join(' ');
  }

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    const inputValue = target.value ?? '';
    const maskedValue = this.applyMask(inputValue);
    this.displayValue = maskedValue;
    this.value = this.extractCleanValue(maskedValue);
    if (this.validatePattern) {
      this.validateInput();
    }
    this.onChange(this.value);
  }

  onKeyDown(event: KeyboardEvent): void {
    const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'Home', 'End', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];
    if (allowedKeys.includes(event.key) || event.ctrlKey || event.metaKey) return;
    const char = event.key;
    const isValidChar = this.isValidCharForMask(char);
    if (!isValidChar) event.preventDefault();
  }

  private isValidCharForMask(char: string): boolean {
    switch (this.maskType) {
      case 'phone': return /\d/.test(char);
      case 'rfc': return /[A-Za-z0-9]/.test(char);
      case 'curp': return /[A-Za-z0-9]/.test(char);
      case 'postal': return /\d/.test(char);
      default: return true;
    }
  }

  private applyMask(value: string): string {
    const raw = value.replace(/[^\w]/g, '');
    const cleanValue = this.uppercase ? raw.toUpperCase() : raw;
    const mask = this.currentMask;
    let maskedValue = '';
    let valueIndex = 0;
    for (let i = 0; i < mask.length && valueIndex < cleanValue.length; i++) {
      const maskChar = mask[i];
      const valueChar = cleanValue[valueIndex];
      if (maskChar === '0') {
        if (/\d/.test(valueChar)) { maskedValue += valueChar; valueIndex++; } else { break; }
      } else if (maskChar === 'A') {
        if (/[A-Z]/.test(valueChar)) { maskedValue += valueChar; valueIndex++; }
        else if (/\d/.test(valueChar) && (this.maskType === 'rfc' || this.maskType === 'curp')) { maskedValue += valueChar; valueIndex++; }
        else { break; }
      } else {
        maskedValue += maskChar;
      }
    }
    return maskedValue;
  }

  private extractCleanValue(maskedValue: string): string {
    return maskedValue.replace(/[^\w]/g, '');
  }

  private validateInput(): void {
    if (!this.value) { this.isValid = null; return; }
    const pattern = this.patterns[this.maskType];
    this.isValid = pattern.test(this.displayValue);
  }

  onFocus(): void { this.focus.emit(); }
  onBlur(): void { if (!this.touched) this.touched = true; this.onTouched(); this.blur.emit(); }

  // CVA
  writeValue(value: any): void {
    const str = value == null ? '' : String(value);
    this.displayValue = this.applyMask(str);
    this.value = this.extractCleanValue(this.displayValue);
    if (this.validatePattern) this.validateInput();
  }
  registerOnChange(fn: any): void { this.onChange = fn; }
  registerOnTouched(fn: any): void { this.onTouched = fn; }
  setDisabledState?(isDisabled: boolean): void { this.disabled = isDisabled; }
}
