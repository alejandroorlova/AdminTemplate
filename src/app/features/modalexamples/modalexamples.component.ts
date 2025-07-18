import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ModalComponent, ModalConfig, ModalButton } from '../../shared/ui/modal/modal.component';

@Component({
  selector: 'app-modalexamples',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ModalComponent
  ],
  templateUrl: './modalexamples.component.html',
  styleUrl: './modalexamples.component.scss'
})
export class ModalexamplesComponent {

  // Estados de los modales
  showInfoModal = false;
  showConfirmModal = false;
  showFormModal = false;
  showViewModal = false;
  showDeleteModal = false;
  isNotificationVisible = false;

  // Estados de carga y datos
  formLoading = false;
  selectedEmployee: any = null;
  employeeToDelete: any = null;

  // Notificaciones
  showNotification = false;
  notificationMessage = '';

  // Formulario
  employeeForm: FormGroup;

  // Datos de ejemplo
  employees = [
    {
      id: 1,
      name: 'Juan Carlos Pérez',
      email: 'juan.perez@iebem.edu.mx',
      position: 'Desarrollador Senior',
      department: 'Tecnología',
      phone: '(777) 123-4567'
    },
    {
      id: 2,
      name: 'María Elena García',
      email: 'maria.garcia@iebem.edu.mx',
      position: 'Coordinadora Académica',
      department: 'Educación',
      phone: '(777) 987-6543'
    },
    {
      id: 3,
      name: 'Carlos López Torres',
      email: 'carlos.lopez@iebem.edu.mx',
      position: 'Contador General',
      department: 'Administración',
      phone: '(777) 456-7890'
    }
  ];

  // Configuraciones de modales
  infoConfig: ModalConfig = {
    size: 'md',
    centered: true
  };

  confirmConfig: ModalConfig = {
    size: 'sm',
    centered: true
  };

  formConfig: ModalConfig = {
    size: 'lg',
    centered: true
  };

  viewConfig: ModalConfig = {
    size: 'xl',
    centered: true
  };

  deleteConfig: ModalConfig = {
    size: 'sm',
    centered: true
  };

  // Botones de modales
  infoButtons: ModalButton[] = [
    {
      label: 'Entendido',
      action: 'close',
      type: 'primary',
      icon: 'check'
    }
  ];

  confirmButtons: ModalButton[] = [
    {
      label: 'Cancelar',
      action: 'cancel',
      type: 'secondary'
    },
    {
      label: 'Confirmar',
      action: 'confirm',
      type: 'primary',
      icon: 'check'
    }
  ];

  formButtons: ModalButton[] = [
    {
      label: 'Cancelar',
      action: 'cancel',
      type: 'secondary'
    },
    {
      label: 'Guardar Cambios',
      action: 'save',
      type: 'primary',
      icon: 'save'
    }
  ];

  viewButtons: ModalButton[] = [
    {
      label: 'Editar',
      action: 'edit',
      type: 'primary',
      icon: 'edit'
    },
    {
      label: 'Cerrar',
      action: 'close',
      type: 'secondary'
    }
  ];

  deleteButtons: ModalButton[] = [
    {
      label: 'Cancelar',
      action: 'cancel',
      type: 'secondary'
    },
    {
      label: 'Eliminar',
      action: 'delete',
      type: 'danger',
      icon: 'trash'
    }
  ];

  constructor(private fb: FormBuilder) {
    this.employeeForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      position: ['', Validators.required],
      department: ['', Validators.required],
      salary: ['', [Validators.required, Validators.min(1)]]
    });
  }

  // Métodos para abrir modales
  openInfoModal() {
    this.showInfoModal = true;
  }

  openConfirmModal() {
    this.showConfirmModal = true;
  }

  openFormModal() {
    this.employeeForm.reset();
    this.showFormModal = true;
  }

  openDeleteModal() {
    this.showDeleteModal = true;
  }

  // Métodos para empleados
  viewEmployee(employee: any) {
    this.selectedEmployee = employee;
    this.showViewModal = true;
  }

  editEmployee(employee: any) {
    this.selectedEmployee = employee;
    this.employeeForm.patchValue(employee);
    this.showFormModal = true;
  }

  deleteEmployee(employee: any) {
    this.employeeToDelete = employee;
    this.showDeleteModal = true;
  }

  // Manejadores de eventos de modales
  onInfoModalButton(action: string) {
    if (action === 'close') {
      this.showInfoModal = false;
    }
  }

  onConfirmModalButton(action: string) {
    if (action === 'cancel') {
      this.showConfirmModal = false;
    } else if (action === 'confirm') {
      this.showConfirmModal = false;
      this.displayNotification('Acción confirmada correctamente');
    }
  }

  onFormModalButton(action: string) {
    if (action === 'cancel') {
      this.onFormModalClose();
    } else if (action === 'save') {
      this.saveEmployee();
    }
  }

  onFormModalClose() {
    this.showFormModal = false;
    this.selectedEmployee = null;
    this.employeeForm.reset();
    this.formLoading = false;
  }

  onViewModalButton(action: string) {
    if (action === 'edit') {
      this.showViewModal = false;
      setTimeout(() => {
        this.editEmployee(this.selectedEmployee);
      }, 300);
    } else if (action === 'close') {
      this.showViewModal = false;
      this.selectedEmployee = null;
    }
  }

  onDeleteModalButton(action: string) {
    if (action === 'cancel') {
      this.showDeleteModal = false;
      this.employeeToDelete = null;
    } else if (action === 'delete') {
      this.confirmDelete();
    }
  }

  // Métodos de acciones
  saveEmployee() {
    if (this.employeeForm.valid) {
      this.formLoading = true;

      // Simular guardado
      setTimeout(() => {
        if (this.selectedEmployee) {
          // Editar empleado existente
          const index = this.employees.findIndex(emp => emp.id === this.selectedEmployee.id);
          if (index > -1) {
            this.employees[index] = { ...this.selectedEmployee, ...this.employeeForm.value };
          }
          this.displayNotification('Empleado actualizado correctamente');
        } else {
          // Agregar nuevo empleado
          const newEmployee = {
            id: this.employees.length + 1,
            ...this.employeeForm.value
          };
          this.employees.push(newEmployee);
          this.displayNotification('Empleado agregado correctamente');
        }

        this.onFormModalClose();
      }, 2000);
    } else {
      this.employeeForm.markAllAsTouched();
    }
  }

  confirmDelete() {
    if (this.employeeToDelete) {
      const index = this.employees.findIndex(emp => emp.id === this.employeeToDelete.id);
      if (index > -1) {
        this.employees.splice(index, 1);
        this.displayNotification('Empleado eliminado correctamente');
      }
      this.showDeleteModal = false;
      this.employeeToDelete = null;
    }
  }

  // Métodos de utilidad
  displayNotification(message: string) {
    this.notificationMessage = message;
    this.isNotificationVisible = true;

    // Auto ocultar después de 3 segundos
    setTimeout(() => {
      this.hideNotification();
    }, 3000);
  }

  hideNotification() {
    this.isNotificationVisible = false;
  }
}
