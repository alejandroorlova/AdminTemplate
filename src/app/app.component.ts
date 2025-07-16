import { Component } from '@angular/core';
import { LayoutComponent } from './shared/layout/layout.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [LayoutComponent],
  template: `<app-layout></app-layout>`,
  styles: [`
    :host {
      display: block;
      height: 100vh;
    }
  `]
})
export class AppComponent {
  title = 'IEBEM Admin System';
}