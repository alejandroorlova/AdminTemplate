import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastContainerComponent, ToastService, ConfirmDialogComponent, ConfirmDialogService } from 'iebem-ui';

@Component({
  selector: 'app-notifications-demo',
  standalone: true,
  imports: [CommonModule, ToastContainerComponent, ConfirmDialogComponent],
  templateUrl: './notifications.component.html'
})
export class NotificationsComponent {
  constructor(private toast: ToastService, private confirm: ConfirmDialogService) {}

  showToasts() {
    this.toast.success({ title: 'Éxito', message: 'Operación realizada correctamente' });
    this.toast.info('Información general para el usuario.');
    this.toast.warning({ title: 'Atención', message: 'Revisa los campos marcados' });
    this.toast.danger({ title: 'Error', message: 'Ocurrió un problema al guardar' });
  }

  showSuccess() { this.toast.success('Guardado correctamente'); }
  showInfo() { this.toast.info('Información general'); }
  showWarning() { this.toast.warning('Revisa los campos'); }
  showDanger() { this.toast.danger('Error inesperado'); }

  async askDelete() {
    const ok = await this.confirm.confirm({
      title: 'Eliminar registro',
      message: '¿Seguro que deseas eliminar este elemento?',
      confirmText: 'Eliminar',
      cancelText: 'Cancelar',
      danger: true,
    });
    if (ok) this.toast.success('Elemento eliminado'); else this.toast.info('Acción cancelada');
  }
}
