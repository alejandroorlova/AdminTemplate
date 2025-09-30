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
          [attr.aria-invalid]="showError ? true : null"
          [attr.aria-describedby]="id + '-error ' + id + '-hint'"
          [attr.aria-labelledby]="id + '-label'"
          (dragover)="onDragOver($event)"
          (dragleave)="onDragLeave($event)"
          (drop)="onDrop($event)"
          (click)="markTouched(); fileInput.click()"
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
            <p class="text-gray-600 mt-3 font-medium">
              {{ dragActive ? 'Suelta los archivos aquí' : 'Arrastra archivos aquí o' }}
            </p>
            <button 
              type="button" 
              class="text-iebem-primary hover:text-iebem-dark font-semibold mt-2 bg-iebem-light px-4 py-2 rounded-lg transition-colors duration-200"
              *ngIf="!dragActive"
            >
              <i class="fas fa-folder-open mr-2"></i>
              Seleccionar archivos
            </button>
          </div>
        </div>
      </app-form-field>

      <div *ngIf="selectedFiles.length > 0" class="mt-4 space-y-3">
        <h4 class="text-sm font-medium text-gray-700">Archivos seleccionados:</h4>
        <div 
          *ngFor="let file of selectedFiles; let i = index" 
          class="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-200"
        >
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 rounded-lg flex items-center justify-center" [class]="getFileIconBackground(file.type)">
              <i [class]="getFileIcon(file.type)"></i>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-900">{{ file.name }}</p>
              <p class="text-xs text-gray-500">{{ formatFileSize(file.size) }}</p>
            </div>
          </div>
          <button 
            type="button" 
            class="text-red-500 hover:text-red-700 hover:bg-red-100 p-2 rounded-lg transition-all duration-200"
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
    const baseClasses = 'border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200';
    const errorState = this.showError ? 'border-red-300 hover:border-red-400 bg-red-50' : '';
    const dragState = this.dragActive ? 'border-iebem-primary bg-iebem-light scale-105' : '';
    const normalState = !this.dragActive && !this.showError ? 'border-gray-300 hover:border-iebem-primary hover:bg-gray-50' : '';
    const stateClasses = [dragState, errorState, normalState].filter(Boolean).join(' ');
    
    return `${baseClasses} ${stateClasses}`;
  }

  markTouched(): void {
    this.touched = true;
  }

  get iconClass(): string {
    const baseClasses = 'text-4xl mb-3';
    const colorClass = this.dragActive ? 'text-iebem-primary' : 'text-gray-400';
    return `fas fa-cloud-upload-alt ${baseClasses} ${colorClass}`;
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
