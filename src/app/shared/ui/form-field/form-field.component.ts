import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form-field',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './form-field.component.html',
  styleUrls: ['./form-field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormFieldComponent {
  @Input() label = '';
  @Input() controlId = '';
  @Input() error = '';
  @Input() hint = '';
  @Input() required = false;

  // Señales de estado provenientes del control
  @Input() touched = false;
  @Input() empty = false;

  get showError(): boolean {
    const hasExternalError = !!(this.error && this.error.trim());
    return hasExternalError || (this.required && this.touched && this.empty);
  }

  get errorId(): string | null {
    return this.controlId ? `${this.controlId}-error` : null;
  }

  get hintId(): string | null {
    return this.controlId ? `${this.controlId}-hint` : null;
  }

  get labelId(): string | null {
    return this.controlId ? `${this.controlId}-label` : null;
  }
}
