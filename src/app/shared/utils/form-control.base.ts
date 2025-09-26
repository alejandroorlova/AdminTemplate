// Clase base para componentes de formulario con ControlValueAccessor
import { ControlValueAccessor } from '@angular/forms';
import { FormComponentConfig, ValidationState } from '../types/common.types';

export abstract class FormControlBase implements ControlValueAccessor {
  protected _value: any = '';
  protected _disabled = false;
  protected _touched = false;
  protected _focused = false;

  protected onChangeCallback = (value: any) => {};
  protected onTouchedCallback = () => {};

  // Getters y setters comunes
  get value(): any {
    return this._value;
  }

  set value(val: any) {
    if (val !== this._value) {
      this._value = val;
      this.onChangeCallback(val);
    }
  }

  get disabled(): boolean {
    return this._disabled;
  }

  get touched(): boolean {
    return this._touched;
  }

  get focused(): boolean {
    return this._focused;
  }

  // Implementación estándar de ControlValueAccessor
  writeValue(value: any): void {
    this._value = value || '';
  }

  registerOnChange(fn: (value: any) => void): void {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouchedCallback = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this._disabled = isDisabled;
  }

  // Métodos comunes para eventos
  protected onFocusHandler(): void {
    this._focused = true;
  }

  protected onBlurHandler(): void {
    this._focused = false;
    this._touched = true;
    this.onTouchedCallback();
  }

  protected onInputHandler(value: any): void {
    this.value = value;
  }

  // Método para obtener clases CSS base
  protected getBaseClasses(customClasses?: string): string {
    const baseClasses = 'transition-all duration-200 focus:outline-none';
    const disabledClasses = this.disabled ? 'cursor-not-allowed opacity-50' : '';
    const focusClasses = this.focused ? 'ring-2 ring-iebem-primary' : '';
    
    return `${baseClasses} ${disabledClasses} ${focusClasses} ${customClasses || ''}`.trim();
  }

  // Método para generar ID único si no se proporciona
  protected generateId(): string {
    return `form-control-${Math.random().toString(36).substr(2, 9)}`;
  }
}