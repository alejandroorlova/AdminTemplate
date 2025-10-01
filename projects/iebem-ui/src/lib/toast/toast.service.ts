import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ToastInternal, ToastOptions, ToastType } from './toast.types';

@Injectable({ providedIn: 'root' })
export class ToastService {
  private _toasts$ = new Subject<ToastInternal>();
  toasts$ = this._toasts$.asObservable();

  private genId() { return Math.random().toString(36).slice(2) + Date.now().toString(36); }

  private create(opts: ToastOptions | string, type: ToastType = 'info') {
    const base: ToastOptions = typeof opts === 'string' ? { message: opts } : opts;
    const toast: ToastInternal = {
      id: base.id || this.genId(),
      title: base.title || '',
      message: base.message,
      type: base.type || type,
      duration: base.duration ?? 3500,
      dismissible: base.dismissible ?? true
    };
    this._toasts$.next(toast);
  }

  success(opts: ToastOptions | string) { this.create(opts, 'success'); }
  info(opts: ToastOptions | string) { this.create(opts, 'info'); }
  warning(opts: ToastOptions | string) { this.create(opts, 'warning'); }
  danger(opts: ToastOptions | string) { this.create(opts, 'danger'); }
}
