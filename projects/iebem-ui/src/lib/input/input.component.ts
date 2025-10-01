// iebem-ui: Input component (library)
import { CommonModule } from '@angular/common';
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

export type LibInputType =
  | 'text'
  | 'email'
  | 'password'
  | 'number'
  | 'tel'
  | 'url'
  | 'date'
  | 'time'
  | 'datetime-local';

@Component({
  selector: 'app-iebem-input',
  standalone: true,
  imports: [CommonModule, FormFieldComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true
    }
  ]
})
export class InputComponent implements ControlValueAccessor {
  @Input() label = '';
  @Input() type: LibInputType = 'text';
  @Input() placeholder = '';
  @Input() uppercase = false;
  @Input() disabled = false;
  @Input() readonly = false;
  @Input() required = false;
  @Input() error = '';
  @Input() hint = '';
  @Input() icon = '';
  @Input() suffixIcon = '';
  @Input() id = '';

  @Output() focus = new EventEmitter<void>();
  @Output() blur = new EventEmitter<void>();

  @ViewChild('inputEl') inputEl!: ElementRef<HTMLInputElement>;

  value: string = '';
  touched = false;
  showPassword = false;

  private onChange: (val: any) => void = () => {};
  private onTouched: () => void = () => {};

  ngOnInit(): void {
    if (!this.id) {
      this.id = `iebem-input-${Math.random().toString(36).slice(2, 9)}`;
    }
  }

  get inputType(): string {
    if (this.type === 'password') {
      return this.showPassword ? 'text' : 'password';
    }
    return this.type;
  }

  get inputClasses(): string {
    const variant = this.error ? 'input-error' : 'input-default';
    const padLeft = this.icon ? 'pl-10' : 'pl-4';
    const padRight = (this.suffixIcon || this.type === 'password') ? 'pr-10' : 'pr-4';
    const padY = 'py-3';
    const disabled = this.disabled ? 'input-disabled' : '';
    const transform = this.uppercase && this.type !== 'password' ? 'uppercase' : '';
    return [variant, padLeft, padRight, padY, disabled, transform].filter(Boolean).join(' ');
  }

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    const raw = target.value ?? '';
    const next = this.uppercase && this.type !== 'password' ? raw.toUpperCase() : raw;
    if (next !== raw) {
      target.value = next;
    }
    this.value = next;
    this.onChange(next);
  }

  onFocus(): void {
    this.focus.emit();
  }

  onBlur(): void {
    if (!this.touched) {
      this.touched = true;
    }
    this.onTouched();
    this.blur.emit();
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  // CVA
  writeValue(val: any): void {
    const str = val == null ? '' : String(val);
    this.value = this.uppercase && this.type !== 'password' ? str.toUpperCase() : str;
  }
  registerOnChange(fn: any): void { this.onChange = fn; }
  registerOnTouched(fn: any): void { this.onTouched = fn; }
  setDisabledState?(isDisabled: boolean): void { this.disabled = isDisabled; }
}
