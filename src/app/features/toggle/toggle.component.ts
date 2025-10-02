import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToggleComponent } from 'iebem-ui';
import { ReactiveFormsModule, FormControl } from '@angular/forms';

@Component({
  selector: 'app-toggle-demo',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ToggleComponent],
  templateUrl: './toggle.component.html'
})
export class ToggleDemoComponent {
  valSm = signal(false);
  valMd = signal(true);
  valLg = signal(false);

  ctrl = new FormControl(true, { nonNullable: true });
}
