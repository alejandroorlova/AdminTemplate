// button.component.ts
import { 
  Component, 
  Input, 
  Output, 
  EventEmitter, 
  ChangeDetectionStrategy,
  ViewEncapsulation
} from '@angular/core';
import { CommonModule } from '@angular/common';

export type ButtonVariant = 
  | 'primary' 
  | 'secondary' 
  | 'accent' 
  | 'success' 
  | 'warning' 
  | 'danger' 
  | 'info'
  | 'dark'
  | 'light'
  | 'outline-primary'
  | 'outline-secondary'
  | 'outline-danger'
  | 'ghost'
  | 'link'
  | 'gradient';

export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export type ButtonType = 'button' | 'submit' | 'reset';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent {
  @Input() variant: ButtonVariant = 'primary';
  @Input() size: ButtonSize = 'md';
  @Input() type: ButtonType = 'button';
  @Input() disabled: boolean = false;
  @Input() loading: boolean = false;
  @Input() fullWidth: boolean = false;
  @Input() icon: string = '';
  @Input() iconPosition: 'left' | 'right' = 'left';
  @Input() rounded: boolean = false;
  @Input() shadow: boolean = true;
  @Input() href: string = '';
  @Input() target: string = '';
  @Input() ariaLabel: string = '';
  @Input() tooltip: string = '';
  @Input() label: string = ''; // Nueva propiedad para el texto del botón
  
  @Output() click = new EventEmitter<Event>();

  get buttonClasses(): string {
    const classes = [
      'btn-base',
      this.sizeClasses,
      this.variantClasses,
      this.widthClasses,
      this.shadowClasses,
    ];
    if (this.rounded) classes.push('rounded-full');
    if (this.disabled) classes.push('opacity-50 cursor-not-allowed');
    return classes.filter(Boolean).join(' ');
  }

  get sizeClasses(): string {
    const sizes = {
      xs: 'btn-xs',
      sm: 'btn-sm',
      md: 'btn-md',
      lg: 'btn-lg',
      xl: 'btn-xl'
    } as const;
    return sizes[this.size];
  }

  get variantClasses(): string {
    const variants = {
      primary: 'btn-primary',
      secondary: 'btn-secondary',
      accent: 'btn-accent',
      success: 'btn-success',
      warning: 'btn-warning',
      danger: 'btn-danger',
      info: 'btn-info',
      dark: 'btn-dark',
      light: 'btn-light',
      'outline-primary': 'btn-outline',
      'outline-secondary': 'btn-outline-secondary',
      'outline-danger': 'btn-outline-danger',
      ghost: 'btn-ghost',
      link: 'btn-link',
      gradient: 'btn-gradient'
    } as const;
    return variants[this.variant];
  }

  get shapeClasses(): string {
    return this.rounded ? 'rounded-full' : 'rounded-xl';
  }

  get widthClasses(): string {
    return this.fullWidth ? 'w-full' : '';
  }

  get shadowClasses(): string {
    if (!this.shadow || this.variant === 'link' || this.variant === 'ghost') {
      return '';
    }
    return 'btn-shadow';
  }

  onClick(event: Event): void {
    if (!this.disabled && !this.loading) {
      if (event.type === 'keydown') {
        event.preventDefault();
      }
      this.click.emit(event);
    }
  }
}
