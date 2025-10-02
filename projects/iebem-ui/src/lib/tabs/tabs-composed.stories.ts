import type { Meta, StoryObj } from '@storybook/angular';
import { Component, signal } from '@angular/core';
import { TabsComponent, type TabItem } from './tabs.component';
import { StepperComponent } from '../stepper/stepper.component';
import { type StepItem } from '../stepper/stepper.types';
import { AlertComponent } from '../alert/alert.component';

@Component({
  selector: 'app-tabs-composed-host',
  standalone: true,
  imports: [TabsComponent, StepperComponent, AlertComponent],
  template: `
    <app-iebem-tabs [tabs]="tabs" [(activeIndex)]="active()"></app-iebem-tabs>
    <div class="mt-4">
      <ng-container [ngSwitch]="active()">
        <div *ngSwitchCase="0">
          <app-iebem-alert title="General" message="Contenido de la pestaña General" variant="info"></app-iebem-alert>
        </div>
        <div *ngSwitchCase="1">
          <app-iebem-stepper [steps]="steps" [currentIndex]="1"></app-iebem-stepper>
        </div>
        <div *ngSwitchCase="2">
          <app-iebem-alert title="Ajustes" message="Preferencias y configuración" variant="warning"></app-iebem-alert>
        </div>
      </ng-container>
    </div>
  `
})
class TabsComposedHostComponent {
  active = signal(0);
  tabs: TabItem[] = [
    { label: 'General', icon: 'sliders-h' },
    { label: 'Proceso', icon: 'list-ol' },
    { label: 'Ajustes', icon: 'cog' }
  ];
  steps: StepItem[] = [
    { label: 'Cuenta' },
    { label: 'Perfil' },
    { label: 'Confirmación' }
  ];
}

const meta: Meta<TabsComposedHostComponent> = {
  title: 'Components/Tabs/Composed',
  component: TabsComposedHostComponent,
  tags: ['autodocs']
};

export default meta;
type Story = StoryObj<TabsComposedHostComponent>;

export const WithStepper: Story = {};

