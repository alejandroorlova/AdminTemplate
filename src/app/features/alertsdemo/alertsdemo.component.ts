import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertComponent } from 'iebem-ui';

@Component({
  selector: 'app-alerts-demo',
  standalone: true,
  imports: [CommonModule, AlertComponent],
  templateUrl: './alertsdemo.component.html'
})
export class AlertsDemoComponent {}

