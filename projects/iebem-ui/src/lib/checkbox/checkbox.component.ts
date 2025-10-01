import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, ViewEncapsulation, forwardRef, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export type CheckboxVariant = 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'danger' | 'info' | 'dark' | 'light' | 'gold' | 'gradient';
export type CheckboxSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type CheckboxLabelPosition = 'left' | 'right';

@Component({
  selector: 'app-iebem-checkbox',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss'],
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => CheckboxComponent), multi: true }]
})
export class CheckboxComponent implements ControlValueAccessor, OnInit {
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

  private _checked = false;
  @Input() set checked(value: boolean) { this._checked = value; this.cdr.markForCheck(); }
  get checked(): boolean { return this._checked; }

  @Output() change = new EventEmitter<boolean>();
  @Output() focus = new EventEmitter<void>();
  @Output() blur = new EventEmitter<void>();

  private onChange = (value: boolean) => {};
  private onTouched = () => {};

  constructor(private cdr: ChangeDetectorRef) {}

  private _computedId: string = '';
  ngOnInit(): void {
    this._computedId = this.id && this.id.trim().length > 0
      ? this.id
      : `checkbox-${Math.random().toString(36).slice(2, 11)}`;
  }

  get checkboxId(): string { return this._computedId; }
  get showError(): boolean { const has = !!(this.error && this.error.trim()); const isEmpty = !this.checked; return has || (this.required && isEmpty && this.touched); }

  get containerLabelClasses(): string {
    return [
      'inline-flex items-center gap-3 align-middle',
      'cursor-pointer select-none',
      this.labelPosition === 'left' ? 'flex-row-reverse' : 'flex-row',
      this.disabled ? 'opacity-50 pointer-events-none' : '',
      'transition-all duration-200'
    ].filter(Boolean).join(' ');
  }

  get checkboxClasses(): string {
    const classes = ['chk-base', 'relative z-0', this.sizeClasses];
    const checked = this.checked || this.indeterminate;
    const variantMap: Record<string,string> = {
      primary:'chk-checked-primary', secondary:'chk-checked-secondary', accent:'chk-checked-accent', success:'chk-checked-success', warning:'chk-checked-warning', danger:'chk-checked-danger', info:'chk-checked-info', dark:'chk-checked-dark', light:'chk-checked-light', gold:'chk-checked-warning', gradient:'chk-checked-primary'
    };
    classes.push(checked ? (variantMap[this.variant] || 'chk-checked-primary') : 'chk-unchecked');
    if (this.showError) classes.push('chk-error');
    if (this.disabled) classes.push('chk-disabled');
    return classes.join(' ');
  }

  get labelTextClasses(): string {
    return [
      'relative z-10 pointer-events-auto',
      'text-gray-900 font-medium',
      'transition-colors duration-200',
      this.sizeTextClasses,
      this.disabled ? 'text-gray-400' : 'hover:text-gray-700'
    ].filter(Boolean).join(' ');
  }

  get iconClasses(): string { const base = ['transition-all duration-200']; base.push(this.variant === 'light' ? 'text-gray-800' : 'text-white'); base.push(this.iconSizeClasses); return base.join(' '); }

  get sizeClasses(): string { const s = { xs:'chk-xs', sm:'chk-sm', md:'chk-md', lg:'chk-lg', xl:'chk-xl' } as const; return s[this.size]; }
  get sizeTextClasses(): string { const s = { xs:'text-xs', sm:'text-sm', md:'text-base', lg:'text-lg', xl:'text-xl' }; return s[this.size]; }
  get iconSizeClasses(): string { const s = { xs:'w-2.5 h-2.5', sm:'w-3 h-3', md:'w-4 h-4', lg:'w-5 h-5', xl:'w-6 h-6' }; return s[this.size]; }

  get hasHelperText(): boolean { return !!((this.showError && this.error) || (!this.showError && this.hint)); }
  get helperText(): string { return this.showError ? (this.error || 'Campo requerido') : (this.hint || ''); }
  get helperTextClasses(): string { return ['mt-2 text-sm flex items-start gap-1', this.showError ? 'text-red-600' : 'text-gray-600'].join(' '); }

  onCheckboxChange(event: Event): void { if (this.disabled) return; const target = event.target as HTMLInputElement; this.checked = target.checked; this.indeterminate = false; this.onChange(this.checked); this.change.emit(this.checked); this.cdr.markForCheck(); }
  onFocus(): void { this.focus.emit(); }
  onBlur(): void { this.touched = true; this.onTouched(); this.blur.emit(); }
  // Click sobre el label se maneja de forma nativa por el input dentro del label.
  // Conservamos el método para compatibilidad, pero no lo usamos en la plantilla.
  onLabelClick(): void { /* noop */ }

  writeValue(value: boolean): void { this.checked = !!value; this.cdr.markForCheck(); }
  registerOnChange(fn: (value: boolean) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }
  setDisabledState(isDisabled: boolean): void { this.disabled = isDisabled; this.cdr.markForCheck(); }
}
