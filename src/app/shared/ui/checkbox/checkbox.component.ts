// checkbox.component.ts
import { 
  Component, 
  Input, 
  Output, 
  EventEmitter, 
  ChangeDetectionStrategy,
  ViewEncapsulation,
  forwardRef,
  ChangeDetectorRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export type CheckboxVariant = 
  | 'primary' 
  | 'secondary' 
  | 'accent' 
  | 'success' 
  | 'warning' 
  | 'danger' 
  | 'info'
  | 'dark'
  | 'light'
  | 'gradient';

export type CheckboxSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export type CheckboxLabelPosition = 'left' | 'right';

@Component({
  selector: 'app-checkbox',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxComponent),
      multi: true
    }
  ]
})
export class CheckboxComponent implements ControlValueAccessor {
  @Input() variant: CheckboxVariant = 'primary';
  @Input() size: CheckboxSize = 'md';
  @Input() label: string = '';
  @Input() labelPosition: CheckboxLabelPosition = 'right';
  @Input() disabled: boolean = false;
  @Input() indeterminate: boolean = false;
  @Input() required: boolean = false;
  @Input() error: string = '';
  @Input() hint: string = '';
  @Input() id: string = '';
  @Input() name: string = '';
  @Input() ariaLabel: string = '';
  @Input() ariaDescribedBy: string = '';
  @Input() tabIndex: number = 0;
  
  // Agregar input para checked para compatibilidad
  @Input() 
  set checked(value: boolean) {
    this._checked = value;
    this.cdr.markForCheck();
  }
  get checked(): boolean {
    return this._checked;
  }
  private _checked: boolean = false;
  
  @Output() change = new EventEmitter<boolean>();
  @Output() focus = new EventEmitter<void>();
  @Output() blur = new EventEmitter<void>();

  // ControlValueAccessor
  private onChange = (value: boolean) => {};
  private onTouched = () => {};

  constructor(private cdr: ChangeDetectorRef) {}

  // Genera un ID único si no se proporciona
  get checkboxId(): string {
    return this.id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;
  }

  get containerClasses(): string {
    return [
      'checkbox-container inline-flex items-center gap-3',
      this.labelPosition === 'left' ? 'flex-row-reverse' : 'flex-row',
      this.disabled ? 'disabled' : '',
      'transition-all duration-200 ease-in-out'
    ].filter(Boolean).join(' ');
  }

  get checkboxClasses(): string {
    return [
      'custom-checkbox relative inline-flex items-center justify-center',
      'border-2 rounded-md transition-all duration-200 ease-in-out',
      'focus-within:ring-2 focus-within:ring-offset-2',
      this.sizeClasses,
      this.variantClasses,
      this.stateClasses,
      this.checked ? 'checked' : '',
      this.indeterminate ? 'indeterminate' : ''
    ].filter(Boolean).join(' ');
  }

  get labelClasses(): string {
    return [
      'label select-none transition-colors duration-200 cursor-pointer',
      this.sizeTextClasses,
      this.disabled ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:text-gray-900',
      'font-medium leading-none'
    ].filter(Boolean).join(' ');
  }

  get sizeClasses(): string {
    const sizes = {
      xs: 'w-4 h-4',
      sm: 'w-5 h-5',
      md: 'w-6 h-6',
      lg: 'w-7 h-7',
      xl: 'w-8 h-8 checkbox-xl'
    };
    return sizes[this.size];
  }

  get sizeTextClasses(): string {
    const sizes = {
      xs: 'text-xs',
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
      xl: 'text-xl'
    };
    return sizes[this.size];
  }

  get iconSizeClasses(): string {
    const sizes = {
      xs: 'w-2.5 h-2.5',
      sm: 'w-3 h-3',
      md: 'w-4 h-4',
      lg: 'w-5 h-5',
      xl: 'w-6 h-6'
    };
    return sizes[this.size];
  }

  get variantClasses(): string {
    if (!this.checked && !this.indeterminate) {
      return 'border-gray-300 bg-white hover:border-gray-400 hover:shadow-sm';
    }

    const variants = {
      primary: 'bg-iebem-primary border-iebem-primary text-white focus-within:ring-iebem-primary/20 hover:bg-iebem-primary/90 hover:border-iebem-primary/90',
      secondary: 'bg-iebem-secondary border-iebem-secondary text-white focus-within:ring-iebem-secondary/20 hover:bg-iebem-secondary/90 hover:border-iebem-secondary/90',
      accent: 'bg-iebem-accent border-iebem-accent text-white focus-within:ring-iebem-accent/20 hover:bg-iebem-accent/90 hover:border-iebem-accent/90',
      success: 'bg-success border-success text-white focus-within:ring-success/20 hover:bg-success/90 hover:border-success/90',
      warning: 'bg-warning border-warning text-white focus-within:ring-warning/20 hover:bg-warning/90 hover:border-warning/90',
      danger: 'bg-danger border-danger text-white focus-within:ring-danger/20 hover:bg-danger/90 hover:border-danger/90',
      info: 'bg-info border-info text-white focus-within:ring-info/20 hover:bg-info/90 hover:border-info/90',
      dark: 'bg-iebem-dark border-iebem-dark text-white focus-within:ring-iebem-dark/20 hover:bg-iebem-dark/90 hover:border-iebem-dark/90',
      light: 'bg-iebem-light border-iebem-light text-iebem-dark focus-within:ring-iebem-primary/20 hover:bg-iebem-light/90 hover:border-iebem-light/90',
      gradient: 'bg-gradient-to-br from-iebem-primary to-iebem-accent border-transparent text-white focus-within:ring-iebem-primary/20 hover:from-iebem-primary/90 hover:to-iebem-accent/90'
    };
    return variants[this.variant];
  }

  get stateClasses(): string {
    const classes = [];
    
    if (this.disabled) {
      classes.push('opacity-50 cursor-not-allowed');
    } else {
      classes.push('cursor-pointer');
    }
    
    if (this.error) {
      classes.push('!border-danger focus-within:!ring-danger/20');
    }
    
    return classes.join(' ');
  }

  get hasHelperText(): boolean {
    return !!(this.error || this.hint);
  }

  get helperTextClasses(): string {
    return [
      'helper-text mt-2 text-sm flex items-start gap-1',
      this.error ? 'text-danger error' : 'text-gray-500'
    ].join(' ');
  }

  get helperText(): string {
    return this.error || this.hint;
  }

  onCheckboxChange(event: Event): void {
    if (this.disabled) return;

    const target = event.target as HTMLInputElement;
    this.checked = target.checked;
    this.indeterminate = false; // Reset indeterminate when user clicks
    
    this.onChange(this.checked);
    this.change.emit(this.checked);
    this.cdr.markForCheck();
  }

  onFocus(): void {
    this.focus.emit();
  }

  onBlur(): void {
    this.onTouched();
    this.blur.emit();
  }

  onLabelClick(): void {
    if (this.disabled) return;
    
    this.checked = !this.checked;
    this.indeterminate = false;
    
    this.onChange(this.checked);
    this.change.emit(this.checked);
    this.cdr.markForCheck();
  }

  // ControlValueAccessor implementation
  writeValue(value: boolean): void {
    this.checked = !!value;
    this.cdr.markForCheck();
  }

  registerOnChange(fn: (value: boolean) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this.cdr.markForCheck();
  }
}