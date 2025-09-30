// button-examples.component.ts
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonComponent, ButtonVariant, ButtonSize } from 'iebem-ui';

@Component({
  selector: 'app-button-examples',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './buttonexamples.component.html',
  styleUrls: ['./buttonexamples.component.scss']
})
export class ButtonExamplesComponent {
  activeSection = 'variants';
  
  sections = [
    { id: 'variants', name: 'Variantes' },
    { id: 'sizes', name: 'Tamaños' },
    { id: 'icons', name: 'Iconos' },
    { id: 'states', name: 'Estados' },
    { id: 'links', name: 'Enlaces' },
    { id: 'use-cases', name: 'Casos de Uso' },
    { id: 'interactive', name: 'Interactivo' }
  ];

  sizes: ButtonSize[] = ['xs', 'sm', 'md', 'lg', 'xl'];
  
  allVariants: ButtonVariant[] = [
    'primary', 'secondary', 'accent', 'success', 'warning', 'danger', 
    'info', 'dark', 'light', 'outline-primary', 'outline-secondary', 
    'outline-danger', 'ghost', 'link', 'gradient'
  ];

  iconOptions = [
    { name: 'Guardar', class: 'fas fa-save' },
    { name: 'Editar', class: 'fas fa-edit' },
    { name: 'Eliminar', class: 'fas fa-trash' },
    { name: 'Descargar', class: 'fas fa-download' },
    { name: 'Subir', class: 'fas fa-upload' },
    { name: 'Usuario', class: 'fas fa-user' },
    { name: 'Configuración', class: 'fas fa-cog' },
    { name: 'Buscar', class: 'fas fa-search' },
    { name: 'Cerrar', class: 'fas fa-times' },
    { name: 'Más', class: 'fas fa-plus' }
  ];

  // Propiedades para la sección interactiva
  selectedVariant: ButtonVariant = 'primary';
  selectedSize: ButtonSize = 'md';
  selectedIcon = '';
  buttonText = ''; // Nueva propiedad para el texto personalizado
  isDisabled = false;
  isLoading = false;
  isFullWidth = false;
  isRounded = false;

  getSizeDescription(size: ButtonSize): string {
    const descriptions: Record<ButtonSize, string> = {
      xs: 'Extra pequeño - px-2.5 py-1.5',
      sm: 'Pequeño - px-3 py-2',
      md: 'Mediano - px-4 py-2.5',
      lg: 'Grande - px-6 py-3',
      xl: 'Extra grande - px-8 py-4'
    };
    return descriptions[size];
  }

  onTestButtonClick(): void {
    if (!this.isDisabled && !this.isLoading) {
      alert('¡Botón clickeado! 🎉');
    }
  }

  getDisplayText(): string {
    if (this.isLoading) {
      return 'Cargando...';
    }
    return this.buttonText || 'Botón de Prueba';
  }

  generateCode(): string {
    const attributes = [];
    
    if (this.selectedVariant !== 'primary') {
      attributes.push(`variant="${this.selectedVariant}"`);
    }
    
    if (this.selectedSize !== 'md') {
      attributes.push(`size="${this.selectedSize}"`);
    }
    
    if (this.selectedIcon) {
      attributes.push(`icon="${this.selectedIcon}"`);
    }
    
    if (this.isDisabled) {
      attributes.push('[disabled]="true"');
    }
    
    if (this.isLoading) {
      attributes.push('[loading]="true"');
    }
    
    if (this.isFullWidth) {
      attributes.push('[fullWidth]="true"');
    }
    
    if (this.isRounded) {
      attributes.push('[rounded]="true"');
    }

    const attributeString = attributes.length > 0 ? ' ' + attributes.join('\n  ') : '';
    const displayText = this.getDisplayText();
    
    return `<app-button${attributeString}>
  ${displayText}
</app-button>`;
  }
}
