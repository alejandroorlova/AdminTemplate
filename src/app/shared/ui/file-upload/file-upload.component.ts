import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormFieldComponent } from '../form-field/form-field.component';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [CommonModule, FormFieldComponent],
  template: `
    <div class="w-full">
      <app-form-field [label]="label" [controlId]="id" [required]="required" [hint]="hint" [error]="error" [touched]="touched" [empty]="selectedFiles.length === 0">
        <div 
          [class]="dropZoneClasses"
          role="button"
          tabindex="0"
          data-role="file-dropzone"
          [attr.aria-invalid]="showError ? true : null"
          [attr.aria-describedby]="id + '-error ' + id + '-hint'"
          [attr.aria-labelledby]="id + '-label'"
          (dragover)="onDragOver($event)"
          (dragleave)="onDragLeave($event)"
          (drop)="onDrop($event)"
          (click)="markTouched(); fileInput.click()"
          (keydown.enter)="markTouched(); fileInput.click()"
          (keydown.space)="markTouched(); fileInput.click()"
        >
          <input 
            #fileInput
            type="file" 
            class="hidden" 
            [accept]="accept"
            [multiple]="multiple"
            (change)="onFileSelect($event)"
            (blur)="markTouched()"
          />
          
          <div class="text-center">
            <i [class]="iconClass"></i>
            <p class="fu-title">
              {{ dragActive ? 'Suelta los archivos aquí' : 'Arrastra archivos aquí o' }}
            </p>
            <button 
              type="button" 
              class="fu-select-btn"
              *ngIf="!dragActive"
            >
              <i class="fas fa-folder-open mr-2"></i>
              Seleccionar archivos
            </button>
          </div>
        </div>
      </app-form-field>

      <div *ngIf="selectedFiles.length > 0" class="fu-list">
        <h4 class="text-sm font-medium text-gray-700">Archivos seleccionados:</h4>
        <div 
          *ngFor="let file of selectedFiles; let i = index" 
          class="fu-file-row"
        >
          <div class="flex items-center space-x-3">
            <div class="fu-file-pill" [class]="getFileIconBackground(file.type)">
              <i [class]="getFileIcon(file.type)"></i>
            </div>
            <div>
              <p class="fu-file-name">{{ file.name }}</p>
              <p class="fu-file-size">{{ formatFileSize(file.size) }}</p>
            </div>
          </div>
          <button 
            type="button" 
            class="fu-remove-btn"
            (click)="removeFile(i)"
          >
            <i class="fas fa-trash text-sm"></i>
          </button>
        </div>
      </div>
    </div>
  `
})
export class FileUploadComponent {
  @Input() label = '';
  @Input() id = 'file-upload';
  @Input() accept = '*';
  @Input() multiple = false;
  @Input() required = false;
  @Input() hint = 'PDF, DOC, DOCX, JPG, PNG hasta 10MB';
  @Input() error = '';
  @Input() maxSize = 10 * 1024 * 1024; // 10MB default
  @Output() filesSelected = new EventEmitter<File[]>();

  selectedFiles: File[] = [];
  dragActive = false;
  touched = false;

  get showError(): boolean {
    const hasExternalError = !!(this.error && this.error.trim());
    const isEmpty = this.selectedFiles.length === 0;
    return hasExternalError || (this.required && isEmpty && this.touched);
  }

  get dropZoneClasses(): string {
    return [
      'fu-dropzone',
      this.dragActive ? 'fu-dropzone--drag' : (this.showError ? 'fu-dropzone--error' : 'fu-dropzone--normal')
    ].join(' ');
  }

  markTouched(): void {
    this.touched = true;
  }

  get iconClass(): string {
    const colorClass = this.dragActive ? 'fu-icon fu-icon--active' : 'fu-icon';
    return `fas fa-cloud-upload-alt ${colorClass}`;
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.dragActive = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.dragActive = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.dragActive = false;
    
    const files = Array.from(event.dataTransfer?.files || []);
    this.markTouched();
    this.handleFiles(files);
  }

  onFileSelect(event: Event): void {
    const target = event.target as HTMLInputElement;
    const files = Array.from(target.files || []);
    this.markTouched();
    this.handleFiles(files);
  }

  private handleFiles(files: File[]): void {
    const validFiles = files.filter(file => this.validateFile(file));
    
    if (this.multiple) {
      this.selectedFiles = [...this.selectedFiles, ...validFiles];
    } else {
      this.selectedFiles = validFiles.slice(0, 1);
    }
    
    this.filesSelected.emit(this.selectedFiles);
  }

  private validateFile(file: File): boolean {
    if (file.size > this.maxSize) {
      this.error = `El archivo ${file.name} excede el tamaño máximo permitido`;
      return false;
    }
    this.error = '';
    return true;
  }

  removeFile(index: number): void {
    this.selectedFiles.splice(index, 1);
    this.filesSelected.emit(this.selectedFiles);
  }

  getFileIcon(mimeType: string): string {
    const baseClasses = 'text-lg';
    
    if (mimeType.includes('pdf')) return `fas fa-file-pdf text-white ${baseClasses}`;
    if (mimeType.includes('word')) return `fas fa-file-word text-white ${baseClasses}`;
    if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) return `fas fa-file-excel text-white ${baseClasses}`;
    if (mimeType.includes('image')) return `fas fa-file-image text-white ${baseClasses}`;
    
    return `fas fa-file text-white ${baseClasses}`;
  }

  getFileIconBackground(mimeType: string): string {
    if (mimeType.includes('pdf')) return 'bg-red-500';
    if (mimeType.includes('word')) return 'bg-blue-500';
    if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) return 'bg-green-500';
    if (mimeType.includes('image')) return 'bg-purple-500';
    
    return 'bg-gray-500';
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}
