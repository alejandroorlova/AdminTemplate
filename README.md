# IebemAdminSystem

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.2.11.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

## Modal (UI) – Ejemplo rápido

Importa y usa el componente con configuración y botones estandarizados (`btn-*`).

TypeScript (componente):
```ts
import { ModalComponent } from 'src/app/shared/ui/modal/modal.component';

showInfo = false;
modalConfig = {
  size: 'md',          // sm | md | lg | xl | full
  centered: true,      // posicionar en centro o top
  backdrop: true,      // clic en fondo para cerrar
  closable: true,
  buttonsAlign: 'end', // start | center | end
};

modalButtons = [
  { label: 'Cancelar', action: 'cancel', type: 'outline', size: 'sm' },
  { label: 'Guardar', action: 'save', type: 'primary', size: 'md' },
];

onModalButton(action: string) {
  if (action === 'save') { /* ... */ }
  this.showInfo = false;
}
```

Template (HTML):
```html
<app-modal
  [isOpen]="showInfo"
  title="Información"
  subtitle="Detalle del registro"
  icon="info-circle"
  iconColor="info"
  [config]="modalConfig"
  [buttons]="modalButtons"
  (buttonClick)="onModalButton($event)"
  (closed)="showInfo = false">
  <p>Contenido del modal…</p>
  <button class="btn-primary btn-sm" (click)="showInfo = false">Cerrar</button>
</app-modal>
```

Notas:
- Tipos de botón: primary, secondary, success, warning, danger, info, dark, light, accent, outline.
- Tamaños: sm | md | lg. Las clases `btn-*` y `btn-shadow` están disponibles globalmente.

## Tabla (UI) – Configuración recomendada

```ts
import { TableConfig, TableColumn, TableAction } from 'src/app/shared/ui/table';

columns: TableColumn[] = [
  { key: 'name', title: 'Nombre', type: 'text', sortable: true, width: '160px' },
  { key: 'email', title: 'Email', type: 'text', sortable: true, width: '200px' },
  { key: 'createdAt', title: 'Alta', type: 'date', sortable: true, width: '110px' },
];

config: TableConfig = {
  headerStyle: 'glass',     // 'glass' (default) | 'primary' | 'gradient'
  hoverable: true,
  striped: false,
  bordered: false,
  compact: false,
  stickyHeader: true,
  pagination: { enabled: true, pageSize: 10 },
  sorting: { enabled: true },
  filtering: { enabled: true, globalSearch: true },
};

actions: TableAction[] = [
  { key: 'edit', label: 'Editar', icon: 'edit', color: 'primary' },
  { key: 'delete', label: 'Eliminar', icon: 'trash', color: 'danger' },
];
```

Notas:
- El scroll horizontal es local al contenedor `.tbl-scroll`.
- El encabezado “glass” ofrece mejor legibilidad y look moderno; usa `'primary'` para fondo sólido.
