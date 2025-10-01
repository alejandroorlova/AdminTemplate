import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, ViewChild, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { OverlayModule } from '@angular/cdk/overlay';
import { A11yModule } from '@angular/cdk/a11y';

export interface ModalConfig {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closable?: boolean;
  backdrop?: boolean;
  keyboard?: boolean;
  centered?: boolean;
  animation?: 'fade' | 'slide' | 'zoom';
  theme?: 'light' | 'dark';
  buttonsAlign?: 'start' | 'center' | 'end';
}

export interface ModalButton {
  label: string;
  action: string;
  type?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'info' | 'dark' | 'light' | 'accent' | 'outline';
  disabled?: boolean;
  loading?: boolean;
  icon?: string;
  size?: 'sm' | 'md' | 'lg';
}

@Component({
  selector: 'app-iebem-modal',
  standalone: true,
  imports: [CommonModule, OverlayModule, A11yModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  animations: [
    trigger('modalAnimation', [
      state('in', style({ opacity: 1, transform: 'scale(1) translateY(0)' })),
      transition('void => *', [
        style({ opacity: 0, transform: 'scale(0.8) translateY(-20px)' }),
        animate('300ms cubic-bezier(0.4, 0, 0.2, 1)')
      ]),
      transition('* => void', [
        animate('200ms cubic-bezier(0.4, 0, 0.2, 1)', style({ opacity: 0, transform: 'scale(0.8) translateY(-20px)' }))
      ])
    ]),
    trigger('backdropAnimation', [
      state('in', style({ opacity: 1 })),
      transition('void => *', [ style({ opacity: 0 }), animate('300ms ease-out') ]),
      transition('* => void', [ animate('200ms ease-in', style({ opacity: 0 })) ])
    ])
  ]
})
export class ModalComponent implements OnInit, OnDestroy {
  @Input() isOpen: boolean = false;
  @Input() title: string = '';
  @Input() subtitle: string = '';
  @Input() icon: string = '';
  @Input() iconColor: string = 'iebem-primary';
  @Input() config: ModalConfig = {};
  @Input() buttons: ModalButton[] = [];
  @Input() loading: boolean = false;
  @Input() customClass: string = '';

  @Output() opened = new EventEmitter<void>();
  @Output() closed = new EventEmitter<void>();
  @Output() buttonClick = new EventEmitter<string>();
  @Output() backdropClick = new EventEmitter<void>();

  @ViewChild('modalContent', { static: false }) modalContent!: ElementRef;
  @ViewChild('dialog', { static: false }) dialogRef?: ElementRef<HTMLElement>;

  private previousActiveElement: HTMLElement | null = null;
  private isAnimating = false;

  private defaultConfig: ModalConfig = {
    size: 'md', closable: true, backdrop: false, keyboard: false, centered: true, animation: 'fade', theme: 'light', buttonsAlign: 'end'
  };

  ngOnInit(): void {
    this.config = { ...this.defaultConfig, ...this.config };
    if (this.isOpen) this.onOpenSideEffects();
  }
  ngOnDestroy(): void { this.enableBodyScroll(); }

  open() {
    if (this.isOpen || this.isAnimating) return;
    this.isOpen = true; this.isAnimating = true; this.onOpenSideEffects();
    setTimeout(() => { this.isAnimating = false; this.opened.emit(); }, 300);
  }

  close() {
    if (!this.isOpen || this.isAnimating) return;
    this.isAnimating = true;
    setTimeout(() => { this.isOpen = false; this.isAnimating = false; this.onCloseSideEffects(); this.closed.emit(); }, 200);
  }

  onEsc(): void { /* keyboard close deshabilitado por config */ }
  onBackdropClick() { this.backdropClick.emit(); if (this.config.backdrop && this.config.closable) this.close(); }
  onButtonClick(action: string) { this.buttonClick.emit(action); }

  getModalSizeClass(): string {
    const map = { sm: 'max-w-sm', md: 'max-w-md', lg: 'max-w-lg', xl: 'max-w-2xl', full: 'max-w-full mx-4' } as const;
    return map[(this.config.size || 'md') as keyof typeof map];
  }
  getModalPositionClass(): string { return this.config.centered ? 'items-center' : 'items-start pt-20'; }
  getFooterLayoutClasses(): string {
    const align = this.config.buttonsAlign || 'end';
    const justify = align === 'start' ? 'sm:justify-start' : align === 'center' ? 'sm:justify-center' : 'sm:justify-end';
    return ['flex flex-col sm:flex-row gap-3', justify].join(' ');
  }
  getButtonClasses(btn: ModalButton): string {
    const v = { primary:'btn-primary', secondary:'btn-secondary', danger:'btn-danger', success:'btn-success', warning:'btn-warning', info:'btn-info', dark:'btn-dark', light:'btn-light', accent:'btn-accent', outline:'btn-outline' } as const;
    const s = { sm:'btn-sm', md:'btn-md', lg:'btn-lg' } as const;
    return [v[(btn.type||'primary') as keyof typeof v], s[(btn.size||'md') as keyof typeof s], 'btn-shadow', 'disabled:opacity-50 disabled:cursor-not-allowed'].join(' ');
  }
  getIconColorClass(): string {
    const map = { 'iebem-primary':'text-iebem-primary','iebem-secondary':'text-iebem-secondary','danger':'text-danger','success':'text-success','warning':'text-warning','info':'text-info' } as const;
    return map[(this.iconColor as keyof typeof map)] || 'text-iebem-primary';
  }

  private onOpenSideEffects() { this.saveFocus(); this.disableBodyScroll(); queueMicrotask(()=> this.dialogRef?.nativeElement?.focus()); }
  private onCloseSideEffects() { this.restoreFocus(); this.enableBodyScroll(); }
  private saveFocus() { this.previousActiveElement = document.activeElement as HTMLElement; }
  private restoreFocus() { this.previousActiveElement?.focus?.(); this.previousActiveElement = null; }
  private disableBodyScroll() { document.body.classList.add('body--locked'); }
  private enableBodyScroll() { document.body.classList.remove('body--locked'); }
}

