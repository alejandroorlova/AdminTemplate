import { Component, Input, OnInit, OnDestroy, OnChanges, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { animate, style, transition, trigger } from '@angular/animations';

export interface LoaderConfig {
  message?: string;
  submessage?: string;
  type?: 'default' | 'upload' | 'download' | 'processing' | 'saving' | 'loading' | 'simple';
  showProgress?: boolean;
  progress?: number;
  showCancel?: boolean;
  theme?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
}

@Component({
  selector: 'app-iebem-loader',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-in', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('200ms ease-out', style({ opacity: 0 }))
      ])
    ]),
    trigger('scaleIn', [
      transition(':enter', [
        style({ transform: 'scale(0.8)', opacity: 0 }),
        animate('400ms cubic-bezier(0.4, 0, 0.2, 1)', style({ transform: 'scale(1)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ transform: 'scale(0.8)', opacity: 0 }))
      ])
    ])
  ]
})
export class LoaderComponent implements OnInit, OnDestroy, OnChanges {
  @Input() isVisible: boolean = false;
  @Input() config: LoaderConfig = {};

  defaultConfig: LoaderConfig = {
    message: 'Cargando...',
    submessage: 'Por favor espere un momento',
    type: 'default',
    showProgress: false,
    progress: 0,
    showCancel: false,
    theme: 'light',
    size: 'md'
  };

  get finalConfig(): LoaderConfig {
    return { ...this.defaultConfig, ...this.config };
  }

  get loaderIcon(): string {
    const icons = {
      default: 'fas fa-spinner',
      upload: 'fas fa-cloud-upload-alt',
      download: 'fas fa-cloud-download-alt',
      processing: 'fas fa-cogs',
      saving: 'fas fa-save',
      loading: 'fas fa-circle-notch',
      simple: 'fas fa-circle-notch'
    } as const;
    return icons[(this.finalConfig.type || 'default') as keyof typeof icons];
  }

  get isSimpleLoader(): boolean {
    return this.finalConfig.type === 'simple';
  }

  get loaderSize(): string {
    const sizes = { sm: 'w-12 h-12', md: 'w-16 h-16', lg: 'w-20 h-20' } as const;
    return sizes[(this.finalConfig.size || 'md') as keyof typeof sizes];
  }

  get containerClasses(): string {
    const base = 'fixed inset-0 z-[1060] flex items-center justify-center';
    const theme = this.finalConfig.theme === 'dark' ? 'bg-black/70' : 'bg-black/50';
    return `${base} ${theme} backdrop-blur-sm`;
  }

  ngOnInit() {
    if (this.isVisible) this.disableBodyScroll();
  }
  ngOnDestroy() { this.enableBodyScroll(); }
  ngOnChanges() { this.isVisible ? this.disableBodyScroll() : this.enableBodyScroll(); }

  private disableBodyScroll() {
    document.body.style.overflow = 'hidden';
    document.body.style.height = '100vh';
  }
  private enableBodyScroll() {
    document.body.style.overflow = '';
    document.body.style.height = '';
  }

  onCancel() {
    this.isVisible = false;
  }
}

