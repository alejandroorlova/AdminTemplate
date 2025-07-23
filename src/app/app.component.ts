// app.component.ts - CORREGIDO
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet], // ← Cambié de LayoutComponent a RouterOutlet
  template: `<router-outlet></router-outlet>`, // ← Cambié de <app-layout> a <router-outlet>
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