import { Component, OnInit, AfterViewInit, ViewChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

// Importar nuestros componentes UI
import { InputComponent } from '../../shared/ui/input/input.component';
import { DatePickerComponent } from '../../shared/ui/date-picker/date-picker.component';
import { FileUploadComponent } from '../../shared/ui/file-upload/file-upload.component';
import { MaskedInputComponent } from '../../shared/ui/masked-input/masked-input.component';
import { ModernSelectComponent, SelectOption } from '../../shared';
import { TableComponent, TableColumn, TableConfig, TableAction } from '../../shared/ui/table/table.component';

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputComponent,
    DatePickerComponent,
    ModernSelectComponent,
    FileUploadComponent,
    MaskedInputComponent,
    TableComponent
  ],
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss']
})
export class EmployeesComponent implements OnInit {

  @ViewChild('actionsTpl') actionsTpl!: TemplateRef<any>;

  // Estado de la aplicación
  activeTab: 'form' | 'list' = 'form';
  employeeForm!: FormGroup;
  isSubmitting = false;
  loadingEmployees = false;

  // Modal de eliminación
  showDeleteModal = false;
  employeeToDelete: any = null;

  loading = false;

  // Opciones para selects
  departmentOptions: SelectOption[] = [
    {
      value: 'administracion',
      label: 'Administración',
      icon: 'building',
      description: 'Gestión administrativa y operativa'
    },
    {
      value: 'recursos-humanos',
      label: 'Recursos Humanos',
      icon: 'users',
      description: 'Personal y desarrollo humano'
    },
    {
      value: 'educacion-basica',
      label: 'Educación Básica',
      icon: 'chalkboard-teacher',
      description: 'Primaria y secundaria'
    },
    {
      value: 'educacion-media',
      label: 'Educación Media Superior',
      icon: 'graduation-cap',
      description: 'Preparatoria y bachillerato'
    },
    {
      value: 'finanzas',
      label: 'Finanzas',
      icon: 'calculator',
      description: 'Contabilidad y presupuestos'
    },
    {
      value: 'tecnologia',
      label: 'Tecnología',
      icon: 'laptop',
      description: 'Sistemas y soporte técnico'
    }
  ];

  positionOptions: SelectOption[] = [
    {
      value: 'director',
      label: 'Director General',
      icon: 'crown',
      description: 'Máxima autoridad institucional'
    },
    {
      value: 'subdirector',
      label: 'Subdirector',
      icon: 'user-tie',
      description: 'Apoyo a la dirección general'
    },
    {
      value: 'coordinador',
      label: 'Coordinador',
      icon: 'tasks',
      description: 'Coordinación de áreas específicas'
    },
    {
      value: 'profesor',
      label: 'Profesor',
      icon: 'chalkboard-teacher',
      description: 'Docencia y enseñanza'
    },
    {
      value: 'administrativo',
      label: 'Personal Administrativo',
      icon: 'clipboard',
      description: 'Apoyo administrativo'
    },
    {
      value: 'contador',
      label: 'Contador',
      icon: 'calculator',
      description: 'Área contable y fiscal'
    },
    {
      value: 'secretaria',
      label: 'Secretaria',
      icon: 'phone',
      description: 'Asistencia ejecutiva'
    }
  ];

  stateOptions: SelectOption[] = [
    {
      value: 'morelos',
      label: 'Morelos',
      icon: 'map-marker-alt',
      description: 'Estado de Morelos'
    },
    {
      value: 'cdmx',
      label: 'Ciudad de México',
      icon: 'city',
      description: 'Capital del país'
    },
    {
      value: 'puebla',
      label: 'Puebla',
      icon: 'map-marker-alt',
      description: 'Estado de Puebla'
    },
    {
      value: 'guerrero',
      label: 'Guerrero',
      icon: 'map-marker-alt',
      description: 'Estado de Guerrero'
    },
    {
      value: 'mexico',
      label: 'Estado de México',
      icon: 'map-marker-alt',
      description: 'Estado de México'
    }
  ];

  genderOptions: SelectOption[] = [
    {
      value: 'M',
      label: 'Masculino',
      icon: 'mars',
      description: 'Género masculino'
    },
    {
      value: 'F',
      label: 'Femenino',
      icon: 'venus',
      description: 'Género femenino'
    }
  ];

  // Datos de ejemplo (en producción vendrían de un servicio)
  employees = [
    {
      id: 1,
      firstName: 'Juan Carlos',
      lastName: 'Pérez Martínez',
      email: 'juan.perez@iebem.edu.mx',
      phone: '(777) 123-4567',
      department: 'Tecnología',
      position: 'Desarrollador Senior',
      salary: 45000,
      hireDate: '2022-03-15',
      status: 'activo'
    },
    {
      id: 2,
      firstName: 'María Elena',
      lastName: 'García López',
      email: 'maria.garcia@iebem.edu.mx',
      phone: '(777) 987-6543',
      department: 'Educación',
      position: 'Directora Académica',
      salary: 55000,
      hireDate: '2021-08-20',
      status: 'activo'
    },
    {
      id: 3,
      firstName: 'Carlos Antonio',
      lastName: 'López Torres',
      email: 'carlos.lopez@iebem.edu.mx',
      phone: '(777) 456-7890',
      department: 'Administración',
      position: 'Contador General',
      salary: 38000,
      hireDate: '2020-11-10',
      status: 'pendiente'
    },
    {
      id: 4,
      firstName: 'Ana Sofía',
      lastName: 'Torres Ruiz',
      email: 'ana.torres@iebem.edu.mx',
      phone: '(777) 321-9876',
      department: 'Recursos Humanos',
      position: 'Especialista en RRHH',
      salary: 42000,
      hireDate: '2023-01-15',
      status: 'activo'
    },
    {
      id: 5,
      firstName: 'Luis Fernando',
      lastName: 'Morales Silva',
      email: 'luis.morales@iebem.edu.mx',
      phone: '(777) 654-3210',
      department: 'Mantenimiento',
      position: 'Jefe de Mantenimiento',
      salary: 35000,
      hireDate: '2019-06-12',
      status: 'inactivo'
    }
  ];

  // Configuración de columnas para la tabla
  employeeColumns: TableColumn[] = [
    {
      key: 'firstName',
      title: 'Nombre',
      type: 'text',
      sortable: true,
      filterable: true,
      width: '140px'
    },
    {
      key: 'lastName',
      title: 'Apellidos',
      type: 'text',
      sortable: true,
      filterable: true,
      width: '160px'
    },
    {
      key: 'email',
      title: 'Email',
      type: 'text',
      sortable: true,
      filterable: true,
      width: '200px'
    },
    {
      key: 'phone',
      title: 'Teléfono',
      type: 'text',
      sortable: false,
      width: '130px'
    },
    {
      key: 'department',
      title: 'Departamento',
      type: 'text',
      sortable: true,
      filterable: true,
      width: '140px'
    },
    {
      key: 'position',
      title: 'Puesto',
      type: 'text',
      sortable: true,
      width: '160px'
    },
    { key: 'salary', title: 'Salario', type: 'number', align: 'right', sortable: true, width: '120px', format: 'currency' },

    { key: 'hireDate', title: 'Ingreso', type: 'date', sortable: true, width: '110px', /* format: 'date' */ },
    { key: 'status', title: 'Estado', type: 'badge', sortable: true, align: 'center', width: '100px' },
    { key: 'actions', title: 'Acciones', type: 'text', align: 'center', width: '160px' }
  ];

  // Configuración de la tabla
  // Configuración de la tabla
  tableConfig: TableConfig = {
    headerStyle: 'primary',
    pagination: {
      enabled: true,
      pageSize: 8
    },
    sorting: {
      enabled: true
    },
    filtering: {
      enabled: true,
      globalSearch: true
    }
  };

  // Acciones disponibles
  // Acciones disponibles para cada empleado
  employeeActions: TableAction[] = [
    {
      key: 'edit',
      label: 'Editar',
      icon: 'edit',
      color: 'primary'
    },
    {
      key: 'view',
      label: 'Ver',
      icon: 'eye',
      color: 'secondary'
    },
    {
      key: 'delete',
      label: 'Eliminar',
      icon: 'trash',
      color: 'danger'
    }
  ];

  constructor(private fb: FormBuilder) {
    this.employeeForm = this.createForm();
  }

  ngAfterViewInit(): void {
    const cols = [...this.employeeColumns];
    const i = cols.findIndex(c => c.key === 'actions');
    if (i >= 0) {
      cols[i] = { ...cols[i], cellTemplate: this.actionsTpl };
      this.employeeColumns = cols; // dispara cambio
    }
  }

  ngOnInit(): void {
    // Inicialización adicional si es necesaria
  }

  createForm(): FormGroup {
    return this.fb.group({
      // Información Personal
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      curp: ['', [Validators.required]],
      rfc: ['', [Validators.required]],

      // Información Laboral
      department: ['', [Validators.required]],
      position: ['', [Validators.required]],
      salary: ['', [Validators.required, Validators.min(1)]],
      hireDate: ['', [Validators.required]],

      // Dirección
      street: ['', [Validators.required]],
      postalCode: ['', [Validators.required]],
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],

      // Información Adicional
      gender: ['', [Validators.required]],
      birthDate: ['', [Validators.required]],
      emergencyContact: ['', [Validators.required]],
      emergencyPhone: ['', [Validators.required]]
    });
  }

  onFilesSelected(files: File[]): void {
    console.log('Archivos seleccionados:', files);
  }

  // Métodos del formulario
  onSubmit() {
    if (this.employeeForm.valid) {
      this.isSubmitting = true;

      // Simular guardado
      setTimeout(() => {
        const newEmployee = {
          id: this.employees.length + 1,
          ...this.employeeForm.value,
          status: 'activo'
        };

        this.employees.push(newEmployee);
        this.employeeForm.reset();
        this.isSubmitting = false;

        // Cambiar a la lista para ver el empleado agregado
        this.activeTab = 'list';

        // Mostrar mensaje de éxito (podrías usar un toast)
        alert('Empleado registrado correctamente');
      }, 2000);
    } else {
      this.employeeForm.markAllAsTouched();
    }
  }

  onReset(): void {
    this.employeeForm.reset();
  }

  private markFormGroupTouched(): void {
    Object.keys(this.employeeForm.controls).forEach(key => {
      const control = this.employeeForm.get(key);
      control?.markAsTouched();
    });
  }

  getFieldError(fieldName: string): string {
    const field = this.employeeForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) return `${this.getFieldLabel(fieldName)} es requerido`;
      if (field.errors['email']) return 'Formato de email inválido';
      if (field.errors['minlength']) return `Mínimo ${field.errors['minlength'].requiredLength} caracteres`;
      if (field.errors['min']) return 'El valor debe ser mayor a 0';
    }
    return '';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: Record<string, string> = {
      firstName: 'Nombre',
      lastName: 'Apellidos',
      email: 'Email',
      phone: 'Teléfono',
      curp: 'CURP',
      rfc: 'RFC',
      department: 'Departamento',
      position: 'Puesto',
      salary: 'Salario',
      hireDate: 'Fecha de contratación',
      street: 'Dirección',
      postalCode: 'Código postal',
      city: 'Ciudad',
      state: 'Estado',
      gender: 'Género',
      birthDate: 'Fecha de nacimiento',
      emergencyContact: 'Contacto de emergencia',
      emergencyPhone: 'Teléfono de emergencia'
    };
    return labels[fieldName] || fieldName;
  }

  // Eventos
  onRowClick(row: any) {
    console.log('Fila clickeada:', row);
    // Navegar a detalle del empleado
  }

  onActionClick(event: { action: TableAction, row: any }) {
    console.log('Acción:', event.action.key, 'Empleado:', event.row.name);

    switch (event.action.key) {
      case 'edit':
        this.editEmployee(event.row);
        break;
      case 'delete':
        this.deleteEmployee(event.row);
        break;
    }
  }



  onFilterChange(searchTerm: string) {
    console.log('Buscar:', searchTerm);
  }



  // Métodos de acciones
  // private editEmployee(employee: any) {
  //   console.log('Editando empleado:', employee);
  //   // Implementar lógica de edición
  // }

  private deleteEmployee(employee: any) {
    if (confirm(`¿Estás seguro de eliminar a ${employee.name}?`)) {
      const index = this.employees.findIndex(emp => emp.id === employee.id);
      if (index > -1) {
        this.employees.splice(index, 1);
        console.log('Empleado eliminado');
      }
    }
  }

  // Métodos de la tabla
  onEmployeeRowClick(employee: any) {
    console.log('Empleado seleccionado:', employee);
    // Podrías navegar a un detalle o mostrar modal
  }

  onEmployeeActionClick(event: { action: TableAction, row: any }) {
    const { action, row } = event;

    switch (action.key) {
      case 'edit':
        this.editEmployee(row);
        break;
      case 'view':
        this.viewEmployee(row);
        break;
      case 'delete':
        this.showDeleteConfirmation(row);
        break;
    }
  }

  onSortChange(event: { column: string, direction: 'asc' | 'desc' }) {
    console.log('Ordenar por:', event.column, event.direction);
  }



  onPageChange(page: number) {
    console.log('Cambiar a página:', page);
  }

  // Métodos de acciones de empleados
  private editEmployee(employee: any) {
    console.log('Editando empleado:', employee);
    // Cargar datos en el formulario y cambiar a tab de formulario
    this.employeeForm.patchValue(employee);
    this.activeTab = 'form';
  }

  private viewEmployee(employee: any) {
    console.log('Viendo empleado:', employee);
    // Mostrar modal de detalle o navegar a vista detallada
  }

  private showDeleteConfirmation(employee: any) {
    this.employeeToDelete = employee;
    this.showDeleteModal = true;
  }

  confirmDelete() {
    if (this.employeeToDelete) {
      const index = this.employees.findIndex(emp => emp.id === this.employeeToDelete.id);
      if (index > -1) {
        this.employees.splice(index, 1);
        console.log('Empleado eliminado:', this.employeeToDelete);
      }
    }
    this.cancelDelete();
  }

  cancelDelete() {
    this.showDeleteModal = false;
    this.employeeToDelete = null;
  }

  // Métodos de estadísticas
  getActiveEmployeesCount(): number {
    return this.employees.filter(emp => emp.status === 'activo').length;
  }

  getPendingEmployeesCount(): number {
    return this.employees.filter(emp => emp.status === 'pendiente').length;
  }

  getDepartmentsCount(): number {
    const departments = new Set(this.employees.map(emp => emp.department));
    return departments.size;
  }

  // Método de exportación
  exportEmployees() {
    console.log('Exportando empleados...');

    // Crear CSV simple
    const headers = ['Nombre', 'Apellidos', 'Email', 'Departamento', 'Puesto', 'Salario'];
    const csvContent = [
      headers.join(','),
      ...this.employees.map(emp => [
        emp.firstName,
        emp.lastName,
        emp.email,
        emp.department,
        emp.position,
        emp.salary
      ].join(','))
    ].join('\n');

    // Descargar archivo
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'empleados_iebem.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
