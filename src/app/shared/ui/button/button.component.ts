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
    return [
      'inline-flex items-center justify-center',
      'font-medium transition-colors duration-200',
      'focus:outline-none focus:ring-2 focus:ring-offset-2',
      this.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
      this.sizeClasses,
      this.variantClasses,
      this.shapeClasses,
      this.widthClasses,
      this.shadowClasses
    ].join(' ');
  }

  get sizeClasses(): string {
    const sizes = {
      xs: 'px-2.5 py-1.5 text-xs',
      sm: 'px-3 py-2 text-sm',
      md: 'px-4 py-2.5 text-sm',
      lg: 'px-6 py-3 text-base',
      xl: 'px-8 py-4 text-lg'
    };
    return sizes[this.size];
  }

  get variantClasses(): string {
    const variants = {
      primary: 'bg-iebem-primary text-white border border-transparent hover:bg-iebem-dark focus:ring-iebem-primary',
      secondary: 'bg-iebem-secondary text-white border border-transparent hover:bg-opacity-90 focus:ring-iebem-secondary',
      accent: 'bg-iebem-accent text-white border border-transparent hover:bg-opacity-90 focus:ring-iebem-accent',
      success: 'bg-success text-white border border-transparent hover:bg-green-600 focus:ring-success',
      warning: 'bg-warning text-white border border-transparent hover:bg-yellow-600 focus:ring-warning',
      danger: 'bg-danger text-white border border-transparent hover:bg-red-600 focus:ring-danger',
      info: 'bg-info text-white border border-transparent hover:bg-blue-600 focus:ring-info',
      dark: 'bg-iebem-dark text-white border border-transparent hover:bg-gray-600 focus:ring-iebem-dark',
      light: 'bg-iebem-light text-iebem-dark border border-iebem-primary hover:bg-green-100 focus:ring-iebem-primary',
      'outline-primary': 'bg-transparent text-iebem-primary border-2 border-iebem-primary hover:bg-iebem-primary hover:text-white focus:ring-iebem-primary',
      'outline-secondary': 'bg-transparent text-iebem-secondary border-2 border-iebem-secondary hover:bg-iebem-secondary hover:text-white focus:ring-iebem-secondary',
      'outline-danger': 'bg-transparent text-danger border-2 border-danger hover:bg-danger hover:text-white focus:ring-danger',
      ghost: 'bg-transparent text-iebem-primary border border-transparent hover:bg-iebem-light focus:ring-iebem-primary',
      link: 'bg-transparent text-iebem-primary border-none hover:underline focus:ring-iebem-primary p-0',
      gradient: 'bg-gradient-to-r from-iebem-primary to-iebem-secondary text-white border border-transparent hover:shadow-lg focus:ring-iebem-primary'
    };
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
    return 'shadow-sm hover:shadow-md';
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