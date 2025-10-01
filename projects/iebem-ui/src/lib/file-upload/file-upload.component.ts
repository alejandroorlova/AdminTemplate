import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormFieldComponent } from '../form-field/form-field.component';

@Component({
  selector: 'app-iebem-file-upload',
  standalone: true,
  imports: [CommonModule, FormFieldComponent],
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FileUploadComponent {
  @Input() label = '';
  @Input() id = 'file-upload';
  @Input() accept = '*';
  @Input() multiple = false;
  @Input() required = false;
  @Input() hint = 'PDF, DOC, DOCX, JPG, PNG hasta 10MB';
  @Input() error = '';
  @Input() maxSize = 10 * 1024 * 1024; // 10MB
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

  markTouched(): void { this.touched = true; }

  get iconClass(): string {
    const colorClass = this.dragActive ? 'fu-icon fu-icon--active' : 'fu-icon';
    return `fas fa-cloud-upload-alt ${colorClass}`;
  }

  onDragOver(event: DragEvent): void { event.preventDefault(); this.dragActive = true; }
  onDragLeave(event: DragEvent): void { event.preventDefault(); this.dragActive = false; }

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
    this.selectedFiles = this.multiple ? [...this.selectedFiles, ...validFiles] : validFiles.slice(0, 1);
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
    const base = 'text-lg';
    if (mimeType.includes('pdf')) return `fas fa-file-pdf text-white ${base}`;
    if (mimeType.includes('word')) return `fas fa-file-word text-white ${base}`;
    if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) return `fas fa-file-excel text-white ${base}`;
    if (mimeType.includes('image')) return `fas fa-file-image text-white ${base}`;
    return `fas fa-file text-white ${base}`;
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
    const k = 1024; const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

