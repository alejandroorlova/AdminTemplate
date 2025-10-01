import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface ConfirmOptions {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  danger?: boolean; // style highlight
}

export interface ConfirmRequest extends Required<ConfirmOptions> { resolver: (v: boolean) => void }

@Injectable({ providedIn: 'root' })
export class ConfirmDialogService {
  private _req$ = new Subject<ConfirmRequest>();
  requests$ = this._req$.asObservable();

  confirm(opts: ConfirmOptions): Promise<boolean> {
    return new Promise<boolean>(resolve => {
      const req: ConfirmRequest = {
        title: opts.title || 'Confirmar',
        message: opts.message,
        confirmText: opts.confirmText || 'Confirmar',
        cancelText: opts.cancelText || 'Cancelar',
        danger: opts.danger ?? false,
        resolver: resolve
      };
      this._req$.next(req);
    });
  }
}

