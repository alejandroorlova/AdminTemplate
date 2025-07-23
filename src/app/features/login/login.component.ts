// login.component.ts - SOLO MAQUETADO (Sin lógica de autenticación)
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

// Importar componentes personalizados
import { InputComponent } from '../../shared/ui/input/input.component';
import { ButtonComponent } from '../../shared/ui/button/button.component';
import { CheckboxComponent } from '../../shared/ui/checkbox/checkbox.component';
import { ModalComponent, ModalConfig, ModalButton } from '../../shared/ui/modal/modal.component';
import { LoaderComponent, LoaderConfig } from '../../shared/ui/loader/loader.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputComponent,
    ButtonComponent,
    CheckboxComponent,
    ModalComponent,
    LoaderComponent
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  resetPasswordForm!: FormGroup;
  
  // Estados del componente (solo para UI)
  isLoading = false;
  showPassword = false;
  showForgotPasswordModal = false;
  resetEmailSent = false;
  
  // Configuraciones para UI
  loaderConfig: LoaderConfig = {
    message: 'Iniciando sesión...',
    submessage: 'Verificando credenciales',
    type: 'loading',
    showProgress: false,
    showCancel: false,
    theme: 'light',
    size: 'md'
  };

  forgotPasswordModalConfig: ModalConfig = {
    size: 'md',
    closable: true,
    backdrop: true,
    keyboard: true,
    centered: true,
    animation: 'fade'
  };

  resetModalButtons: ModalButton[] = [
    {
      label: 'Cancelar',
      action: 'cancel',
      type: 'secondary'
    },
    {
      label: 'Enviar enlace',
      action: 'send',
      type: 'primary',
      icon: 'paper-plane'
    }
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForms();
  }

  private initializeForms(): void {
    // Formulario principal de login
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });

    // Formulario de recuperación de contraseña
    this.resetPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  // Métodos de validación (solo para mostrar errores de UI)
  get emailError(): string {
    const email = this.loginForm.get('email');
    if (email?.hasError('required') && email?.touched) {
      return 'El correo electrónico es requerido';
    }
    if (email?.hasError('email') && email?.touched) {
      return 'Ingrese un correo electrónico válido';
    }
    return '';
  }

  get passwordError(): string {
    const password = this.loginForm.get('password');
    if (password?.hasError('required') && password?.touched) {
      return 'La contraseña es requerida';
    }
    if (password?.hasError('minlength') && password?.touched) {
      return 'La contraseña debe tener al menos 6 caracteres';
    }
    return '';
  }

  get resetEmailError(): string {
    const email = this.resetPasswordForm.get('email');
    if (email?.hasError('required') && email?.touched) {
      return 'El correo electrónico es requerido';
    }
    if (email?.hasError('email') && email?.touched) {
      return 'Ingrese un correo electrónico válido';
    }
    return '';
  }

  // Métodos de UI (sin lógica real)
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    console.log('Formulario de login enviado:', this.loginForm.value);
    if (this.loginForm.valid && !this.isLoading) {
      // Solo simular loading para UI
      this.isLoading = true;
      
      // Simular delay y redirigir al dashboard para mostrar el layout
      setTimeout(() => {
        this.isLoading = false;
        this.router.navigate(['/dashboard']);
      }, 10000);
    } else {
      // Marcar campos como touched para mostrar errores
      this.loginForm.markAllAsTouched();
    }
  }

  onForgotPassword(): void {
    this.showForgotPasswordModal = true;
    this.resetEmailSent = false;
    this.resetPasswordForm.reset();
  }

  onModalButtonClick(action: string): void {
    switch (action) {
      case 'cancel':
      case 'close':
        this.showForgotPasswordModal = false;
        break;
      case 'send':
        this.handlePasswordReset();
        break;
    }
  }

  private handlePasswordReset(): void {
    if (this.resetPasswordForm.valid) {
      // Simular envío para UI
      setTimeout(() => {
        this.resetEmailSent = true;
        this.updateModalForSuccess();
      }, 1500);
    } else {
      this.resetPasswordForm.markAllAsTouched();
    }
  }

  private updateModalForSuccess(): void {
    this.resetModalButtons = [
      {
        label: 'Entendido',
        action: 'close',
        type: 'primary',
        icon: 'check'
      }
    ];
  }

  onModalClosed(): void {
    this.showForgotPasswordModal = false;
    this.resetEmailSent = false;
    this.resetPasswordForm.reset();
    
    // Restaurar botones originales
    this.resetModalButtons = [
      {
        label: 'Cancelar',
        action: 'cancel',
        type: 'secondary'
      },
      {
        label: 'Enviar enlace',
        action: 'send',
        type: 'primary',
        icon: 'paper-plane'
      }
    ];
  }

  // Métodos para redes sociales (solo navegación de ejemplo)
  loginWithGoogle(): void {
    console.log('Login with Google - Solo UI');
    // Para maquetado, redirigir al dashboard
    this.router.navigate(['/dashboard']);
  }

  loginWithMicrosoft(): void {
    console.log('Login with Microsoft - Solo UI');
    // Para maquetado, redirigir al dashboard
    this.router.navigate(['/dashboard']);
  }

  // Método para registro (solo navegación)
  goToRegister(): void {
    console.log('Ir a registro - Solo UI');
    // Puedes crear una ruta de registro más adelante
  }
}