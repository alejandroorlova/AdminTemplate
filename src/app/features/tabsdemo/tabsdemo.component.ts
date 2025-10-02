import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabsComponent, TabItem, StepperComponent, StepItem, AlertComponent } from 'iebem-ui';

@Component({
  selector: 'app-tabs-demo',
  standalone: true,
  imports: [CommonModule, TabsComponent, StepperComponent, AlertComponent],
  templateUrl: './tabsdemo.component.html'
})
export class TabsDemoComponent {
  active = signal(0);
  tabs: TabItem[] = [
    { label: 'General', icon: 'sliders-h' },
    { label: 'Proceso', icon: 'list-ol', badge: 3 },
    { label: 'Ajustes', icon: 'cog' }
  ];
  steps: StepItem[] = [
    { label: 'Cuenta' },
    { label: 'Perfil' },
    { label: 'Confirmación' }
  ];
}

