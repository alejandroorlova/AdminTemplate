export type ToastType = 'success' | 'info' | 'warning' | 'danger';

export interface ToastOptions {
  id?: string;
  title?: string;
  message: string;
  type?: ToastType;
  duration?: number; // ms
  dismissible?: boolean;
}

export interface ToastInternal extends Required<Omit<ToastOptions, 'id'>> { id: string }

