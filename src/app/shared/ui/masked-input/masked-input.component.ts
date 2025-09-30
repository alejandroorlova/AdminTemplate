import { Component, Input, forwardRef, ChangeDetectionStrategy } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormFieldComponent } from '../form-field/form-field.component';

export type MaskType = 'phone' | 'rfc' | 'curp' | 'postal' | 'custom';

@Component({
  selector: 'app-masked-input',
  standalone: true,
  imports: [CommonModule,FormFieldComponent],
  templateUrl: './masked-input.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MaskedInputComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MaskedInputComponent implements ControlValueAccessor {
  @Input() label = '';
  @Input() maskType: MaskType = 'custom';
  @Input() customMask = '';
  @Input() placeholder = '';
  @Input() uppercase = true; // por defecto true para mantener RFC/CURP en mayúsculas
  @Input() disabled = false;
  @Input() readonly = false;
  @Input() required = false;
  @Input() error = '';
  @Input() hint = '';
  @Input() icon = '';
  @Input() id = '';
  @Input() validatePattern = true;

  value = '';
  displayValue = '';
  isFocused = false;
  touched = false;
  isValid: boolean | null = null;

  private onChange = (value: string) => {};
  private onTouched = () => {};

  // Máscaras predefinidas
  private masks: Record<MaskType, string> = {
    phone: '(000) 000-0000',
    rfc: 'AAAA000000AAA',
    curp: 'AAAA000000AAAAAA00',
    postal: '00000',
    custom: this.customMask
  };

  // Patrones de validación
  private patterns: Record<MaskType, RegExp> = {
    phone: /^\(\d{3}\) \d{3}-\d{4}$/,
    rfc: /^[A-Z]{3,4}\d{6}[A-Z0-9]{3}$/,
    curp: /^[A-Z]{4}\d{6}[HM][A-Z]{5}[A-Z0-9]\d$/,
    postal: /^\d{5}$/,
    custom: new RegExp('.*')
  };

  // Ejemplos para mostrar
  private examples: Record<MaskType, string> = {
    phone: '(777) 123-4567',
    rfc: 'XAXX010101000',
    curp: 'CURP180901HPLXXX09',
    postal: '62000',
    custom: ''
  };

  get currentMask(): string {
    return this.maskType === 'custom' ? this.customMask : this.masks[this.maskType];
  }

  get example(): string {
    return this.examples[this.maskType];
  }

  get inputClasses(): string {
    // Base y variantes estandarizadas
    const variant = this.error
      ? 'input-error'
      : this.isValid === true
        ? 'input-success'
        : 'input-default';

    // Reservar espacio para iconos
    const padLeft = this.icon ? 'pl-10' : 'pl-4';
    const padRight = 'pr-10'; // siempre reservamos para el icono de validación
    const padY = 'py-3';

    const disabled = this.disabled ? 'input-disabled' : '';
    const transform = this.uppercase ? 'uppercase' : '';

    return [variant, padLeft, padRight, padY, disabled, 'font-mono', transform].filter(Boolean).join(' ');
  }

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    const inputValue = target.value;
    
    // Aplicar máscara
    const maskedValue = this.applyMask(inputValue);
    this.displayValue = maskedValue;
    
    // Extraer valor limpio (sin caracteres de máscara)
    this.value = this.extractCleanValue(maskedValue);
    
    // Validar patrón si está habilitado
    if (this.validatePattern) {
      this.validateInput();
    }
    
    this.onChange(this.value);
  }

  onKeyDown(event: KeyboardEvent): void {
    // Permitir teclas de navegación y control
    const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'Home', 'End', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];
    
    if (allowedKeys.includes(event.key) || event.ctrlKey || event.metaKey) {
      return;
    }

    // Validar entrada según el tipo de máscara
    const char = event.key;
    const isValidChar = this.isValidCharForMask(char);
    
    if (!isValidChar) {
      event.preventDefault();
    }
  }

  private isValidCharForMask(char: string): boolean {
    switch (this.maskType) {
      case 'phone':
        return /\d/.test(char);
      case 'rfc':
        return /[A-Za-z0-9]/.test(char);
      case 'curp':
        return /[A-Za-z0-9]/.test(char);
      case 'postal':
        return /\d/.test(char);
      default:
        return true;
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
        // Espera un dígito
        if (/\d/.test(valueChar)) {
          maskedValue += valueChar;
          valueIndex++;
        } else {
          break;
        }
      } else if (maskChar === 'A') {
        // Espera una letra
        if (/[A-Z]/.test(valueChar)) {
          maskedValue += valueChar;
          valueIndex++;
        } else if (/\d/.test(valueChar) && (this.maskType === 'rfc' || this.maskType === 'curp')) {
          // Para RFC y CURP, algunos caracteres pueden ser números
          maskedValue += valueChar;
          valueIndex++;
        } else {
          break;
        }
      } else {
        // Carácter fijo de la máscara
        maskedValue += maskChar;
      }
    }

    return maskedValue;
  }

  private extractCleanValue(maskedValue: string): string {
    // Extraer solo caracteres alfanuméricos
    return maskedValue.replace(/[^\w]/g, '');
  }

  private validateInput(): void {
    if (!this.value) {
      this.isValid = null;
      return;
    }

    const pattern = this.patterns[this.maskType];
    this.isValid = pattern.test(this.displayValue);
  }

  onBlur(): void {
    this.isFocused = false;
    this.touched = true;
    this.onTouched();
  }

  onFocus(): void {
    this.isFocused = true;
  }

  writeValue(value: string): void {
    this.value = value || '';
    this.displayValue = this.applyMask(this.value);
    if (this.validatePattern) {
      this.validateInput();
    }
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
