// checkbox-examples.component.ts
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CheckboxComponent, CheckboxVariant, CheckboxSize, CheckboxLabelPosition } from 'iebem-ui';

@Component({
  selector: 'app-checkbox-examples',
  standalone: true,
  imports: [CommonModule, FormsModule, CheckboxComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './checkbox-examples.component.html',
  styleUrls: ['./checkbox-examples.component.scss']
})
export class CheckboxExamplesComponent {
  activeSection = 'variants';

  sections = [
    { id: 'variants', name: 'Variantes' },
    { id: 'sizes', name: 'Tamaños' },
    { id: 'states', name: 'Estados' },
    { id: 'validation', name: 'Validación' },
    { id: 'use-cases', name: 'Casos de Uso' },
    { id: 'interactive', name: 'Interactivo' }
  ];

  sizes: CheckboxSize[] = ['xs', 'sm', 'md', 'lg', 'xl'];

  allVariants: CheckboxVariant[] = [
    'primary', 'secondary', 'accent', 'success', 'warning', 'danger',
    'info', 'dark', 'light', 'gradient'
  ];

  // Propiedades para la sección interactiva
  selectedVariant: CheckboxVariant = 'primary';
  selectedSize: CheckboxSize = 'md';
  selectedLabelPosition: CheckboxLabelPosition = 'right';
  checkboxLabel = 'Checkbox personalizable';
  isChecked = false;
  isDisabled = false;
  isIndeterminate = false;
  isRequired = false;
  hasError = false;
  errorMessage = 'Este campo es requerido';
  hintMessage = 'Mensaje de ayuda opcional';

  // Modelos independientes para ejemplos visuales
  checkedByVariant: Record<CheckboxVariant, boolean> = {
    primary: false,
    secondary: false,
    accent: false,
    success: false,
    warning: false,
    danger: false,
    info: false,
    dark: false,
    light: false,
    gold: false,
    gradient: false
  };

  checkedBySize: Record<CheckboxSize, boolean> = {
    xs: false,
    sm: false,
    md: false,
    lg: false,
    xl: false
  };

  // Estados para selección múltiple
  allSelected = false;
  someSelected = false;

  // Simulación de elementos para "Seleccionar todos"
  items = [
    { id: 1, name: 'Lectura', selected: false, variant: 'success' as CheckboxVariant },
    { id: 2, name: 'Escritura', selected: false, variant: 'warning' as CheckboxVariant },
    { id: 3, name: 'Eliminación', selected: false, variant: 'danger' as CheckboxVariant },
    { id: 4, name: 'Administración', selected: false, variant: 'info' as CheckboxVariant }
  ];

  constructor() {
    this.updateSelectionState();
  }

  toggleAll(checked: boolean): void {
    this.allSelected = checked;
    this.items.forEach(item => item.selected = checked);
    this.updateSelectionState();
  }

  toggleItem(index: number): void {
    this.items[index].selected = !this.items[index].selected;
    this.updateSelectionState();
  }

  private updateSelectionState(): void {
    const selectedCount = this.items.filter(item => item.selected).length;
    this.allSelected = selectedCount === this.items.length;
    this.someSelected = selectedCount > 0 && selectedCount < this.items.length;
  }

  get isIndeterminateAll(): boolean {
    return this.someSelected && !this.allSelected;
  }

  getSizeDescription(size: CheckboxSize): string {
    const descriptions = {
      xs: 'Extra pequeño - 16px',
      sm: 'Pequeño - 20px',
      md: 'Mediano - 24px',
      lg: 'Grande - 28px',
      xl: 'Extra grande - 32px'
    };
    return descriptions[size];
  }

  onCheckboxChange(checked: boolean): void {
    this.isChecked = checked;
    console.log('Checkbox changed:', checked);
  }

  generateCode(): string {
    const attributes = [];

    if (this.selectedVariant !== 'primary') {
      attributes.push(`variant="${this.selectedVariant}"`);
    }

    if (this.selectedSize !== 'md') {
      attributes.push(`size="${this.selectedSize}"`);
    }

    if (this.checkboxLabel) {
      attributes.push(`label="${this.checkboxLabel}"`);
    }

    if (this.selectedLabelPosition !== 'right') {
      attributes.push(`labelPosition="${this.selectedLabelPosition}"`);
    }

    if (this.isChecked) {
      attributes.push('[checked]="true"');
    }

    if (this.isDisabled) {
      attributes.push('[disabled]="true"');
    }

    if (this.isIndeterminate) {
      attributes.push('[indeterminate]="true"');
    }

    if (this.isRequired) {
      attributes.push('[required]="true"');
    }

    if (this.hasError && this.errorMessage) {
      attributes.push(`error="${this.errorMessage}"`);
    }

    if (!this.hasError && this.hintMessage) {
      attributes.push(`hint="${this.hintMessage}"`);
    }

    const attributeString = attributes.length > 0 ? '\n  ' + attributes.join('\n  ') : '';

    return `<app-iebem-checkbox${attributeString}${attributeString ? '\n' : ''}>
</app-iebem-checkbox>`;
  }

  copyCode(): void {
    const code = this.generateCode();
    navigator.clipboard.writeText(code).then(() => {
      console.log('Código copiado al portapapeles');
      // Aquí podrías mostrar una notificación de éxito
    }).catch(err => {
      console.error('Error al copiar código:', err);
    });
  }
}
