// modal.component.ts
import { 
  Component, 
  Input, 
  Output, 
  EventEmitter, 
  OnInit, 
  OnDestroy, 
  ViewChild, 
  ElementRef, 
  HostListener,
  ChangeDetectionStrategy 
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { animate, state, style, transition, trigger } from '@angular/animations';

// Interfaces para el modal
export interface ModalConfig {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closable?: boolean;
  backdrop?: boolean;
  keyboard?: boolean;
  centered?: boolean;
  animation?: 'fade' | 'slide' | 'zoom';
  theme?: 'light' | 'dark';
}

export interface ModalButton {
  label: string;
  action: string;
  type?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning';
  disabled?: boolean;
  loading?: boolean;
  icon?: string;
}

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  animations: [
    trigger('modalAnimation', [
      state('in', style({
        opacity: 1,
        transform: 'scale(1) translateY(0)'
      })),
      transition('void => *', [
        style({
          opacity: 0,
          transform: 'scale(0.8) translateY(-20px)'
        }),
        animate('300ms cubic-bezier(0.4, 0, 0.2, 1)')
      ]),
      transition('* => void', [
        animate('200ms cubic-bezier(0.4, 0, 0.2, 1)', style({
          opacity: 0,
          transform: 'scale(0.8) translateY(-20px)'
        }))
      ])
    ]),
    trigger('backdropAnimation', [
      state('in', style({ opacity: 1 })),
      transition('void => *', [
        style({ opacity: 0 }),
        animate('300ms ease-out')
      ]),
      transition('* => void', [
        animate('200ms ease-in', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class ModalComponent implements OnInit, OnDestroy {
  
  // Input properties
  @Input() isOpen: boolean = false;
  @Input() title: string = '';
  @Input() subtitle: string = '';
  @Input() icon: string = '';
  @Input() iconColor: string = 'iebem-primary';
  @Input() config: ModalConfig = {};
  @Input() buttons: ModalButton[] = [];
  @Input() loading: boolean = false;
  @Input() customClass: string = '';
  
  // Output events
  @Output() opened = new EventEmitter<void>();
  @Output() closed = new EventEmitter<void>();
  @Output() buttonClick = new EventEmitter<string>();
  @Output() backdropClick = new EventEmitter<void>();
  
  // ViewChild references
  @ViewChild('modalContent', { static: false }) modalContent!: ElementRef;
  @ViewChild('firstFocusable', { static: false }) firstFocusable!: ElementRef;
  
  // Internal state
  private previousActiveElement: HTMLElement | null = null;
  private isAnimating: boolean = false;
  
  // Default configuration
  private defaultConfig: ModalConfig = {
    size: 'md',
    closable: true,
    backdrop: true,
    keyboard: true,
    centered: true,
    animation: 'fade',
    theme: 'light'
  };

  ngOnInit() {
    this.config = { ...this.defaultConfig, ...this.config };
    
    if (this.isOpen) {
      this.handleOpen();
    }
  }

  ngOnDestroy() {
    this.restoreFocus();
    this.enableBodyScroll();
  }

  // Keyboard event handler
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (!this.isOpen) return;

    switch (event.key) {
      case 'Escape':
        if (this.config.keyboard && this.config.closable) {
          this.close();
        }
        break;
      case 'Tab':
        this.handleTabKey(event);
        break;
    }
  }

  // Public methods
  open() {
    if (this.isOpen || this.isAnimating) return;
    
    this.isOpen = true;
    this.isAnimating = true;
    this.handleOpen();
    
    setTimeout(() => {
      this.isAnimating = false;
      this.opened.emit();
    }, 300);
  }

  close() {
    if (!this.isOpen || this.isAnimating) return;
    
    this.isAnimating = true;
    
    setTimeout(() => {
      this.isOpen = false;
      this.isAnimating = false;
      this.handleClose();
      this.closed.emit();
    }, 200);
  }

  // Event handlers
  onButtonClick(action: string) {
    this.buttonClick.emit(action);
  }

  onBackdropClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      this.backdropClick.emit();
      if (this.config.closable && this.config.backdrop) {
        this.close();
      }
    }
  }

  // Utility methods
  getModalSizeClass(): string {
    const sizeClasses = {
      'sm': 'max-w-sm',
      'md': 'max-w-md',
      'lg': 'max-w-lg',
      'xl': 'max-w-2xl',
      'full': 'max-w-full mx-4'
    };
    return sizeClasses[this.config.size || 'md'];
  }

  getModalPositionClass(): string {
    return this.config.centered ? 'items-center' : 'items-start pt-20';
  }

  getButtonClasses(button: ModalButton): string {
    const baseClasses = 'px-4 py-2 rounded-xl font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
    
    const typeClasses = {
      'primary': 'bg-iebem-primary text-white hover:bg-iebem-dark focus:ring-iebem-primary',
      'secondary': 'bg-iebem-secondary text-white hover:opacity-80 focus:ring-iebem-secondary',
      'danger': 'bg-danger text-white hover:bg-red-600 focus:ring-danger',
      'success': 'bg-success text-white hover:bg-green-600 focus:ring-success',
      'warning': 'bg-warning text-white hover:bg-yellow-600 focus:ring-warning'
    };
    
    const typeClass = typeClasses[button.type || 'primary'];
    return `${baseClasses} ${typeClass}`;
  }

  getIconColorClass(): string {
    const colorClasses = {
      'iebem-primary': 'text-iebem-primary',
      'iebem-secondary': 'text-iebem-secondary',
      'danger': 'text-danger',
      'success': 'text-success',
      'warning': 'text-warning',
      'info': 'text-info'
    };
    return colorClasses[this.iconColor as keyof typeof colorClasses] || 'text-iebem-primary';
  }

  // Private methods
  private handleOpen() {
    this.saveFocus();
    this.disableBodyScroll();
    
    // Focus first focusable element after animation
    setTimeout(() => {
      this.focusFirstElement();
    }, 300);
  }

  private handleClose() {
    this.restoreFocus();
    this.enableBodyScroll();
  }

  private saveFocus() {
    this.previousActiveElement = document.activeElement as HTMLElement;
  }

  private restoreFocus() {
    if (this.previousActiveElement) {
      this.previousActiveElement.focus();
      this.previousActiveElement = null;
    }
  }

  focusFirstElement() {
    if (this.firstFocusable?.nativeElement) {
      this.firstFocusable.nativeElement.focus();
    } else {
      const firstFocusableElement = this.modalContent?.nativeElement?.querySelector(
        'button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (firstFocusableElement) {
        (firstFocusableElement as HTMLElement).focus();
      }
    }
  }

  private handleTabKey(event: KeyboardEvent) {
    if (!this.modalContent) return;

    const focusableElements = this.modalContent.nativeElement.querySelectorAll(
      'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    if (event.shiftKey) {
      if (document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      }
    } else {
      if (document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }
  }

  private disableBodyScroll() {
    document.body.style.overflow = 'hidden';
  }

  private enableBodyScroll() {
    document.body.style.overflow = '';
  }

  // Método público para enfocar el primer elemento
// focusFirstElement() {
//   if (this.firstFocusable?.nativeElement) {
//     // Si hay un elemento marcado como #firstFocusable, enfocarlo
//     this.firstFocusable.nativeElement.focus();
//   } else {
//     // Si no, buscar el primer elemento focusable en el modal
//     const firstFocusableElement = this.modalContent?.nativeElement?.querySelector(
//       'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
//     );
//     if (firstFocusableElement) {
//       (firstFocusableElement as HTMLElement).focus();
//     }
//   }
// }
}