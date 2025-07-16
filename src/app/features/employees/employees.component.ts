import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

// Importar nuestros componentes UI
import { InputComponent } from '../../shared/ui/input/input.component';
//import { SelectComponent, SelectOption } from '../../shared/ui/select/select.component';
import { FileUploadComponent } from '../../shared/ui/file-upload/file-upload.component';
import { MaskedInputComponent } from '../../shared/ui/masked-input/masked-input.component';
import { ModernSelectComponent,  SelectOption} from '../../shared/ui/modern-select/modern-select.component';

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule,
    InputComponent,
    ModernSelectComponent,
    ModernSelectComponent,
    FileUploadComponent,
    MaskedInputComponent
  ],
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss']
})
export class EmployeesComponent implements OnInit {
  employeeForm: FormGroup;
  isSubmitting = false;

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

  constructor(private fb: FormBuilder) {
    this.employeeForm = this.createForm();
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

  onSubmit(): void {
    if (this.employeeForm.valid) {
      this.isSubmitting = true;
      
      console.log('Datos del formulario:', this.employeeForm.value);
      
      // Simular envío
      setTimeout(() => {
        this.isSubmitting = false;
        alert('¡Empleado registrado exitosamente!');
        this.employeeForm.reset();
      }, 2000);
    } else {
      this.markFormGroupTouched();
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
}