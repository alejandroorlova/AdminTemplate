import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToggleComponent } from 'iebem-ui';

@Component({
  selector: 'app-toggle-demo',
  standalone: true,
  imports: [CommonModule, ToggleComponent],
  templateUrl: './toggle.component.html'
})
export class ToggleDemoComponent {
  valSm = signal(false);
  valMd = signal(true);
  valLg = signal(false);
}

