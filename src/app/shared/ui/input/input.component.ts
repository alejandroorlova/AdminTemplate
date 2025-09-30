import { Component, Input, forwardRef, ViewChild, ElementRef, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy } from '@angular/core';
import { FormFieldComponent } from '../form-field/form-field.component';
import { FormControlBase } from '../../utils/form-control.base';
import { InputType } from '../../types/common.types';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule, FormFieldComponent],
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputComponent extends FormControlBase implements OnInit {
  @Input() label = '';
  @Input() type: InputType = 'text';
  @Input() placeholder = '';
  @Input() override set disabled(value: boolean) {
    this._disabled = value;
  }
  
  override get disabled(): boolean {
    return this._disabled;
  }
  @Input() readonly = false;
  @Input() required = false;
  @Input() error = '';
  @Input() hint = '';
  @Input() icon = '';
  @Input() suffixIcon = '';
  @Input() id = '';

  @ViewChild('inputElement') inputElement!: ElementRef;

  showPassword = false;

  ngOnInit(): void {
    if (!this.id) {
      this.id = this.generateId();
    }
  }

  getPlaceholderText(): string {
    return this.placeholder;
  }

  getInputType(): string {
    if (this.type === 'password') {
      return this.showPassword ? 'text' : 'password';
    }
    return this.type;
  }


  get inputClasses(): string {
    // Base y variantes estandarizadas desde components.tailwind.scss
    const variant = this.error ? 'input-error' : 'input-default';

    // Ajustes de padding según iconos presentes
    const padLeft = this.icon ? 'pl-10' : 'pl-4';
    const padRight = (this.suffixIcon || this.type === 'password') ? 'pr-10' : 'pr-4';
    const padY = 'py-3';

    // Estado disabled coherente
    const disabled = this.disabled ? 'input-disabled' : '';

    return [variant, padLeft, padRight, padY, disabled].filter(Boolean).join(' ');
  }


  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.onInputHandler(target.value);
  }


  onBlur(): void {
    this.onBlurHandler();
  }

  onFocus(): void {
    this.onFocusHandler();
  }




  override writeValue(value: string): void {
    super.writeValue(value);
  }
}
