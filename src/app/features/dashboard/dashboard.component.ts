import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  // Datos del dashboard
  stats = {
    totalEmployees: 1234,
    activeEmployees: 1156,
    monthlyPayroll: 2500000,
    pendingTasks: 23
  };

  recentEmployees = [
    {
      name: 'María González Pérez',
      position: 'Profesora de Matemáticas',
      department: 'Educación Básica',
      status: 'Activo',
      avatar: 'MG'
    },
    {
      name: 'Roberto Silva Martín',
      position: 'Contador General',
      department: 'Administración',
      status: 'Activo',
      avatar: 'RS'
    },
    {
      name: 'Ana Rodríguez López',
      position: 'Coordinadora de RH',
      department: 'Recursos Humanos',
      status: 'Pendiente',
      avatar: 'AR'
    }
  ];

  quickActions = [
    {
      title: 'Procesar Nómina',
      description: 'Calcular y generar pagos del mes actual',
      icon: 'calculator',
      color: 'bg-iebem-primary',
      action: () => console.log('Procesar nómina')
    },
    {
      title: 'Nuevo Empleado',
      description: 'Registrar un nuevo empleado al sistema',
      icon: 'user-plus',
      color: 'bg-iebem-secondary',
      action: () => console.log('Nuevo empleado')
    },
    {
      title: 'Generar Reportes',
      description: 'Crear informes y estadísticas',
      icon: 'chart-bar',
      color: 'bg-iebem-accent',
      action: () => console.log('Generar reportes')
    }
  ];
}