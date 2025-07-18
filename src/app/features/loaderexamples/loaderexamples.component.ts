import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderComponent, LoaderConfig } from '../../shared/ui/loader/loader.component';


@Component({
  selector: 'app-loaderexamples',
  standalone: true,
  imports: [CommonModule, LoaderComponent],
  templateUrl: './loaderexamples.component.html',
  styleUrl: './loaderexamples.component.scss'
})
export class LoaderexamplesComponent {

  // Estados del loader
  showLoader = false;
  currentLoaderConfig: LoaderConfig = {};
  currentLoaderType = '';
  private progressInterval: any;

  // Getter para saber si hay algún loader activo
  get isAnyLoaderActive(): boolean {
    return this.showLoader;
  }

  // ===== LOADERS BÁSICOS =====

  showBasicLoader() {
    this.currentLoaderType = 'Loader Básico';
    this.currentLoaderConfig = {
      message: 'Cargando información...',
      submessage: 'Por favor espere un momento',
      type: 'default',
      size: 'md'
    };
    this.showLoader = true;

    // Auto cerrar después de 3 segundos
    setTimeout(() => {
      this.hideLoader();
    }, 3000);
  }

  showProgressLoader() {
    this.currentLoaderType = 'Loader con Progreso';
    this.currentLoaderConfig = {
      message: 'Procesando datos...',
      submessage: 'Analizando información del IEBEM',
      type: 'processing',
      showProgress: true,
      progress: 0,
      size: 'lg'
    };
    this.showLoader = true;

    // Simular progreso incremental
    this.startProgressSimulation(4000);
  }

  showUploadLoader() {
    this.currentLoaderType = 'Subida de Archivo';
    this.currentLoaderConfig = {
      message: 'Subiendo documento...',
      submessage: 'empleados-nuevos.xlsx - No cierre la ventana',
      type: 'upload',
      showProgress: true,
      progress: 0,
      showCancel: true,
      size: 'md'
    };
    this.showLoader = true;

    this.startProgressSimulation(5000);
  }

  showDownloadLoader() {
    this.currentLoaderType = 'Descarga';
    this.currentLoaderConfig = {
      message: 'Descargando reporte...',
      submessage: 'reporte-empleados-iebem.pdf',
      type: 'download',
      showProgress: true,
      progress: 0,
      size: 'md'
    };
    this.showLoader = true;

    this.startProgressSimulation(3500);
  }

  showSavingLoader() {
    this.currentLoaderType = 'Guardando';
    this.currentLoaderConfig = {
      message: 'Guardando cambios...',
      submessage: 'Actualizando base de datos del IEBEM',
      type: 'saving',
      size: 'md'
    };
    this.showLoader = true;

    setTimeout(() => {
      this.hideLoader();
    }, 2500);
  }

  showProcessingLoader() {
    this.currentLoaderType = 'Procesando';
    this.currentLoaderConfig = {
      message: 'Procesando información...',
      submessage: 'Calculando estadísticas de empleados',
      type: 'processing',
      size: 'lg'
    };
    this.showLoader = true;

    setTimeout(() => {
      this.hideLoader();
    }, 4000);
  }

  // ===== CASOS DE USO ESPECÍFICOS =====

  simulateLoadEmployees() {
    this.currentLoaderType = 'Cargando Empleados';
    this.currentLoaderConfig = {
      message: 'Cargando empleados...',
      submessage: 'Consultando base de datos del IEBEM',
      type: 'loading',
      size: 'md'
    };
    this.showLoader = true;

    setTimeout(() => {
      // Simular cambio de mensaje
      this.updateLoaderMessage('Aplicando filtros...', 'Organizando información');

      setTimeout(() => {
        this.hideLoader();
        this.showSuccessMessage('✅ 156 empleados cargados correctamente');
      }, 1500);
    }, 2000);
  }

  simulateSaveEmployee() {
    this.currentLoaderType = 'Guardando Empleado';
    this.currentLoaderConfig = {
      message: 'Guardando empleado...',
      submessage: 'Validando información personal',
      type: 'saving',
      size: 'md'
    };
    this.showLoader = true;

    // Simular fases del guardado
    setTimeout(() => {
      this.updateLoaderMessage('Verificando datos...', 'Validando CURP y RFC');
    }, 1000);

    setTimeout(() => {
      this.updateLoaderMessage('Guardando en base de datos...', 'Almacenando información');
    }, 2000);

    setTimeout(() => {
      this.updateLoaderMessage('¡Empleado guardado!', 'Registro completado exitosamente');

      setTimeout(() => {
        this.hideLoader();
      }, 1500);
    }, 3000);
  }

  simulateExportExcel() {
    this.currentLoaderType = 'Exportando Excel';
    this.currentLoaderConfig = {
      message: 'Exportando empleados...',
      submessage: 'Preparando datos para exportación',
      type: 'download',
      showProgress: true,
      progress: 0,
      size: 'md'
    };
    this.showLoader = true;

    // Simular progreso con fases
    this.simulatePhaseProgress([
      { message: 'Recopilando datos...', submessage: 'Consultando información de empleados', progress: 25 },
      { message: 'Generando Excel...', submessage: 'Aplicando formato y estilos', progress: 60 },
      { message: 'Preparando descarga...', submessage: 'Optimizando archivo', progress: 90 },
      { message: '¡Descarga lista!', submessage: 'empleados-iebem.xlsx generado', progress: 100 }
    ], 800);
  }

  simulateImportEmployees() {
    this.currentLoaderType = 'Importando Empleados';
    this.currentLoaderConfig = {
      message: 'Importando empleados...',
      submessage: 'Iniciando proceso de importación',
      type: 'upload',
      showProgress: true,
      progress: 0,
      showCancel: true,
      size: 'lg'
    };
    this.showLoader = true;

    this.simulatePhaseProgress([
      { message: 'Leyendo archivo...', submessage: 'Procesando empleados-nuevos.xlsx', progress: 15 },
      { message: 'Validando datos...', submessage: 'Verificando CURP, RFC y emails', progress: 35 },
      { message: 'Verificando duplicados...', submessage: 'Comparando con base de datos', progress: 55 },
      { message: 'Guardando empleados...', submessage: 'Insertando 43 registros nuevos', progress: 80 },
      { message: 'Enviando notificaciones...', submessage: 'Informando a recursos humanos', progress: 95 },
      { message: '¡Importación completa!', submessage: '43 empleados importados exitosamente', progress: 100 }
    ], 1200);
  }

  simulateGenerateReport() {
    this.currentLoaderType = 'Generando Reporte';
    this.currentLoaderConfig = {
      message: 'Generando reporte...',
      submessage: 'Iniciando análisis de datos',
      type: 'processing',
      showProgress: true,
      progress: 0,
      size: 'lg'
    };
    this.showLoader = true;

    this.simulatePhaseProgress([
      { message: 'Recopilando datos...', submessage: 'Consultando información de empleados', progress: 20 },
      { message: 'Calculando estadísticas...', submessage: 'Analizando departamentos y puestos', progress: 40 },
      { message: 'Generando gráficos...', submessage: 'Creando visualizaciones de datos', progress: 65 },
      { message: 'Creando documento PDF...', submessage: 'Aplicando plantilla institucional', progress: 85 },
      { message: '¡Reporte generado!', submessage: 'reporte-empleados-2024.pdf listo', progress: 100 }
    ], 1000);
  }

  simulateSystemBackup() {
    this.currentLoaderType = 'Backup del Sistema';
    this.currentLoaderConfig = {
      message: 'Creando backup...',
      submessage: 'Iniciando copia de seguridad completa',
      type: 'upload',
      showProgress: true,
      progress: 0,
      size: 'lg'
    };
    this.showLoader = true;

    this.simulatePhaseProgress([
      { message: 'Conectando con servidor...', submessage: 'Estableciendo conexión segura', progress: 10 },
      { message: 'Extrayendo datos...', submessage: 'Copiando información de empleados', progress: 30 },
      { message: 'Comprimiendo archivos...', submessage: 'Optimizando tamaño del backup', progress: 50 },
      { message: 'Subiendo al servidor...', submessage: 'Transfiriendo 2.3 GB de datos', progress: 75 },
      { message: 'Verificando integridad...', submessage: 'Validando copia de seguridad', progress: 90 },
      { message: '¡Backup completado!', submessage: 'Copia guardada en servidor seguro', progress: 100 }
    ], 1500);
  }

  // ===== MÉTODOS DE UTILIDAD =====

  cancelCurrentLoader() {
    this.hideLoader();
    this.showSuccessMessage('❌ Operación cancelada por el usuario');
  }

  private hideLoader() {
    this.showLoader = false;
    this.currentLoaderType = '';
    this.clearProgressInterval();
  }

  private updateLoaderMessage(message: string, submessage: string) {
    this.currentLoaderConfig = {
      ...this.currentLoaderConfig,
      message,
      submessage
    };
  }

  private updateLoaderProgress(progress: number) {
    this.currentLoaderConfig = {
      ...this.currentLoaderConfig,
      progress
    };
  }

  private startProgressSimulation(duration: number) {
    this.clearProgressInterval();

    const interval = 100; // Actualizar cada 100ms
    const increment = 100 / (duration / interval);
    let currentProgress = 0;

    this.progressInterval = setInterval(() => {
      currentProgress += increment + (Math.random() * 5); // Progreso variable

      if (currentProgress >= 100) {
        currentProgress = 100;
        this.updateLoaderProgress(currentProgress);
        this.clearProgressInterval();

        setTimeout(() => {
          this.hideLoader();
        }, 500);
      } else {
        this.updateLoaderProgress(currentProgress);
      }
    }, interval);
  }

  private simulatePhaseProgress(phases: any[], phaseDelay: number) {
    this.clearProgressInterval();

    let currentPhase = 0;

    const executePhase = () => {
      if (currentPhase < phases.length) {
        const phase = phases[currentPhase];
        this.currentLoaderConfig = {
          ...this.currentLoaderConfig,
          message: phase.message,
          submessage: phase.submessage,
          progress: phase.progress
        };

        currentPhase++;

        if (currentPhase < phases.length) {
          setTimeout(executePhase, phaseDelay);
        } else {
          // Última fase, cerrar después de un momento
          setTimeout(() => {
            this.hideLoader();
          }, 1500);
        }
      }
    };

    executePhase();
  }

  private clearProgressInterval() {
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
      this.progressInterval = null;
    }
  }

  private showSuccessMessage(message: string) {
    // Aquí podrías mostrar una notificación toast
    console.log(message);
    // O implementar tu sistema de notificaciones
  }

  // Cleanup al destruir el componente
  ngOnDestroy() {
    this.clearProgressInterval();
  }
}
