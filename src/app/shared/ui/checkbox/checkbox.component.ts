// checkbox.component.ts - VERSIÓN DESDE CERO - LIMPIA Y FUNCIONAL
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
  | 'gold'
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
  touched = false;
  
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

  private onChange = (value: boolean) => {};
  private onTouched = () => {};

  constructor(private cdr: ChangeDetectorRef) {}

  get checkboxId(): string {
    return this.id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;
  }

  get showError(): boolean {
    const hasExternalError = !!(this.error && this.error.trim());
    const isEmpty = !this.checked;
    return hasExternalError || (this.required && isEmpty && this.touched);
  }

  get containerClasses(): string {
    return [
      'inline-flex items-center gap-3',
      this.labelPosition === 'left' ? 'flex-row-reverse' : 'flex-row',
      this.disabled ? 'opacity-50 pointer-events-none' : '',
      'transition-all duration-200'
    ].filter(Boolean).join(' ');
  }

  get checkboxClasses(): string {
    const baseClasses = [
      'relative inline-flex items-center justify-center',
      'border-2 rounded-md transition-all duration-200',
      'cursor-pointer select-none',
      this.sizeClasses
    ];

    // Estado no marcado
    if (!this.checked && !this.indeterminate) {
      baseClasses.push('border-gray-300 bg-white hover:border-gray-400');
    } else {
      // Estado marcado - aquí aplicamos los colores específicos
      baseClasses.push(this.getVariantStyles());
    }

    if (this.showError) {
      baseClasses.push('!border-red-500');
    }

    return baseClasses.join(' ');
  }

  private getVariantStyles(): string {
    const variants = {
      primary: 'bg-iebem-primary border-iebem-primary hover:bg-iebem-primary/90',
      secondary: 'bg-iebem-secondary border-iebem-secondary hover:bg-iebem-secondary/90',
      accent: 'bg-iebem-accent border-iebem-accent hover:bg-iebem-accent/90',
      success: 'bg-green-600 border-green-600 hover:bg-green-700',
      warning: 'bg-yellow-500 border-yellow-500 hover:bg-yellow-600',
      danger: 'bg-red-600 border-red-600 hover:bg-red-700',
      info: 'bg-blue-600 border-blue-600 hover:bg-blue-700',
      dark: 'bg-gray-800 border-gray-800 hover:bg-gray-900',
      light: 'bg-gray-100 border-gray-300 hover:bg-gray-200',
      gold: 'bg-yellow-600 border-yellow-600 hover:bg-yellow-700',
      gradient: 'bg-gradient-to-r from-iebem-primary to-iebem-accent border-transparent hover:from-iebem-primary/90 hover:to-iebem-accent/90'
    };
    return variants[this.variant] || variants.primary;
  }

  get labelClasses(): string {
    return [
      'text-gray-900 font-medium cursor-pointer select-none',
      'transition-colors duration-200',
      this.sizeTextClasses,
      this.disabled ? 'text-gray-400' : 'hover:text-gray-700'
    ].filter(Boolean).join(' ');
  }

  get iconClasses(): string {
    const baseClasses = ['transition-all duration-200'];
    
    // Color del ícono basado en el fondo
    if (this.variant === 'light') {
      baseClasses.push('text-gray-800'); // Ícono oscuro para fondo claro
    } else {
      baseClasses.push('text-white'); // Ícono blanco para fondos oscuros
    }
    
    baseClasses.push(this.iconSizeClasses);
    return baseClasses.join(' ');
  }

  get sizeClasses(): string {
    const sizes = {
      xs: 'w-4 h-4',
      sm: 'w-5 h-5',
      md: 'w-6 h-6',
      lg: 'w-7 h-7',
      xl: 'w-8 h-8'
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

  get helperTextClasses(): string {
    return [
      'mt-2 text-sm flex items-start gap-1',
      this.showError ? 'text-red-600' : 'text-gray-600'
    ].join(' ');
  }

  get hasHelperText(): boolean {
    return !!((this.showError && this.error) || (!this.showError && this.hint));
  }

  get helperText(): string {
    return this.showError ? (this.error || 'Campo requerido') : (this.hint || '');
  }

  onCheckboxChange(event: Event): void {
    if (this.disabled) return;

    const target = event.target as HTMLInputElement;
    this.checked = target.checked;
    this.indeterminate = false;
    
    this.onChange(this.checked);
    this.change.emit(this.checked);
    this.cdr.markForCheck();
  }

  onFocus(): void {
    this.focus.emit();
  }

  onBlur(): void {
    this.touched = true;
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
