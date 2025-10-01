# iebem-ui – Component Library Guide

Colección de componentes standalone para Angular 19. Esta guía documenta instalación, consumo, patrones, API de componentes, pruebas y resolución de problemas para integraciones rápidas y predecibles.

## Checklist de Integración Rápida
- Estilos: en `src/styles.scss` incluye `@import 'dist/iebem-ui/styles/iebem-ui.css';` (ya configurado en este repo).
- Standalone: importa cada componente en `imports` del componente de tu vista.
- Formularios: añade `FormsModule` para `[(ngModel)]` y `ReactiveFormsModule` para `formControlName`.
- Utilidades: usa clases `.btn-*`, `.chk-*`, `.sdb-*`, `.ldr-*`, `.tbl-*` junto con Tailwind.
- Accesibilidad: define `label`/`id` donde aplique; Modal/Loader manejan focus/scroll.
- Pruebas: usa `data-role` como selectores estables.

## Matriz de Componentes (Referencia Rápida)
| Componente | Selector | Import | Inputs clave | Outputs |
|---|---|---|---|---|
| Botón | `app-iebem-button` | `ButtonComponent` | `variant, size, disabled, loading, icon, label` | `click` |
| Input | `app-iebem-input` | `InputComponent` | `label, type, placeholder, error, hint, id, icon` | `focus, blur` |
| Masked Input | `app-iebem-masked-input` | `MaskedInputComponent` | `label, maskType, customMask, error, hint` | `focus, blur` |
| Modern Select | `app-iebem-modern-select` | `ModernSelectComponent` | `label, options, placeholder, searchable, error` | `opened, closed` |
| Select | `app-iebem-select` | `SelectComponent` | `label, options, placeholder, error, compareWith` | – |
| Date Picker | `app-iebem-date-picker` | `DatePickerComponent` | `label, minDate, maxDate, clearable, error` | – |
| File Upload | `app-iebem-file-upload` | `FileUploadComponent` | `label, accept, multiple, maxSize, error` | `filesSelected` |
| Form Field | `app-iebem-form-field` | `FormFieldComponent` | `label, controlId, error, hint, required` | – |
| Checkbox | `app-iebem-checkbox` | `CheckboxComponent` | `label, variant, size, disabled, required, error` | `change, focus, blur` |
| Table | `app-iebem-table` | `TableComponent` | `columns, data, config, actions, loading` | `rowClick, actionClick, sortChange, filterChange, pageChange` |
| Loader | `app-iebem-loader` | `LoaderComponent` | `isVisible, config { type, message, progress… }` | – |
| Modal | `app-iebem-modal` | `ModalComponent` | `isOpen, title, buttons, config, loading` | `opened, closed, buttonClick, backdropClick` |
| Sidebar | `app-iebem-sidebar` | `SidebarComponent` | `isOpen, config { items, collapsible… }` | `toggleSidebar, itemClick, collapseChange, logoClick` |

## Compatibilidad
- Angular: 19.x
- TailwindCSS: 3.4.x
- Standalone Components: sí (sin NgModules)

## Monorepo y consumo local
- Build de la librería: `npm run build:ui` (compila Tailwind y empaqueta con ng-packagr en `dist/iebem-ui`).
- Import path: `iebem-ui` resuelve a `./dist/iebem-ui` (ver `tsconfig.json -> compilerOptions.paths`).
- HMR: a veces no recoge cambios de la lib. Si no ves cambios:
  1) Detén el dev server
  2) `npm run build:ui`
  3) `ng serve -o`
  4) Hard reload (Cmd/Ctrl+Shift+R)

## Estilos y tokens
- Estilos base de la librería: `dist/iebem-ui/styles/iebem-ui.css` (importado en `src/styles.scss`).
- Tokens (colores, tipografías, sombras, z-index) están embebidos en la hoja de estilos de la librería.
- Utilidades de diseño (Tailwind + clases utilitarias propias): `.btn-*`, `.chk-*`, `.sdb-*`, `.ldr-*`, `.tbl-*`.

### Prefijos de utilidades (resumen)
- Botones: `btn-*` (`btn-primary|secondary|accent|success|warning|danger|info|dark|light|outline|ghost|link|gradient`) + `btn-xs|sm|md|lg|xl` + `btn-shadow`.
- Checkbox: `chk-*` (base, estados y variantes); tamaños `chk-xs..chk-xl`.
- Sidebar: `sdb-*` (link, icon, container, iconbtn).
- Loader: `ldr-*` (card, progress, icon-bg).
- Tabla: `tbl-*` (head variantes, scroll, etc.).

## Accesibilidad (A11y)
- Labels explícitos e ids estables en inputs/checkboxes.
- Controles con `ControlValueAccessor` para compatibilidad con formularios y estados.
- Modal: focus-trap, aria attributes, backdrop accesible; sin overlay posicional.
- Tabla y Loader con `data-role` para pruebas y tecnología asistiva.

## Buenas prácticas y anti‑patrones
- Evita construir clases dinámicas por string (Tailwind no las detecta). Usa variantes soportadas o safelist.
- Prefiere `[(ngModel)]`/`formControlName` para estado en lugar de props fijas como `[checked]`.
- No mezclar estilos absolutos que oculten eventos (p.ej. `pointer-events: none` sobre labels o contenedores interactivos).

## Ejemplo mínimo (standalone)
```ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from 'iebem-ui';

@Component({
  selector: 'app-demo',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  template: `<app-iebem-button variant="primary" label="Guardar"></app-iebem-button>`
})
export class DemoComponent {}
```

---

## Catálogo de componentes

### Botón – `app-iebem-button` (ButtonComponent)
- Inputs: `variant` (`primary|secondary|accent|success|warning|danger|info|dark|light|outline|ghost|link|gradient`), `size` (`xs|sm|md|lg|xl`), `type` (`button|submit|reset`), `disabled`, `loading`, `fullWidth`, `icon`, `iconPosition` (`left|right`), `rounded`, `shadow`, `href`, `target`, `ariaLabel`, `tooltip`, `label`.
- Output: `click`
- Ejemplo: `<app-iebem-button variant="primary" size="md" label="Guardar" (click)="onSave()"></app-iebem-button>`

### Input – `app-iebem-input` (InputComponent)
- Inputs: `label`, `type`, `placeholder`, `uppercase`, `disabled`, `readonly`, `required`, `error`, `hint`, `icon`, `suffixIcon`, `id`.
- Outputs: `focus`, `blur`
- Template-driven: `<app-iebem-input label="Nombre" [(ngModel)]="name"></app-iebem-input>`
- Reactive: `<app-iebem-input label="Email" formControlName="email" error="Email inválido"></app-iebem-input>`

### Masked Input – `app-iebem-masked-input` (MaskedInputComponent)
- Inputs: `label`, `maskType` (`rfc|curp|…`), `customMask`, `placeholder`, `uppercase`, `disabled`, `required`, `error`, `hint`, `icon`, `id`, `validatePattern`.
- Outputs: `focus`, `blur`
- Ej.: `<app-iebem-masked-input label="RFC" maskType="rfc" [(ngModel)]="rfc"></app-iebem-masked-input>`

### Modern Select – `app-iebem-modern-select` (ModernSelectComponent)
- Inputs: `label`, `placeholder`, `options`, `required`, `error`, `hint`, `id`, `searchable`.
- Outputs: `opened`, `closed`
- Ej.: `<app-iebem-modern-select label="Departamento" [options]="departments" [(ngModel)]="dept"></app-iebem-modern-select>`

### Select – `app-iebem-select` (SelectComponent)
- Inputs: `label`, `placeholder`, `options`, `disabled`, `required`, `error`, `hint`, `id`, `uppercase`, `compareWith`.
- Ej.: `<app-iebem-select label="Puesto" [options]="positions" [(ngModel)]="position"></app-iebem-select>`

### Date Picker – `app-iebem-date-picker` (DatePickerComponent)
- Inputs: `label`, `placeholder`, `disabled`, `required`, `error`, `hint`, `id`, `clearable`, `minDate`, `maxDate`.
- Ej.: `<app-iebem-date-picker label="Fecha de ingreso" [(ngModel)]="joinDate"></app-iebem-date-picker>`

### File Upload – `app-iebem-file-upload` (FileUploadComponent)
- Inputs: `label`, `id`, `accept`, `multiple`, `required`, `hint`, `error`, `maxSize`.
- Output: `filesSelected`
- Ej.: `<app-iebem-file-upload label="Adjuntar CV" accept=".pdf" (filesSelected)="onFiles($event)"></app-iebem-file-upload>`

### Form Field – `app-iebem-form-field` (FormFieldComponent)
- Inputs: `label`, `controlId`, `error`, `hint`, `required`, `touched`, `empty`.
- Ej.:
```html
<app-iebem-form-field label="Nombre" [controlId]="'nombre'">
  <app-iebem-input id="nombre" [(ngModel)]="nombre"></app-iebem-input>
</app-iebem-form-field>
```

### Checkbox – `app-iebem-checkbox` (CheckboxComponent)
- Inputs: `variant` (`primary|secondary|accent|success|warning|danger|info|dark|light|gold|gradient`), `size` (`xs|sm|md|lg|xl`), `label`, `labelPosition` (`left|right`), `disabled`, `indeterminate`, `required`, `error`, `hint`, `id`, `name`, `ariaLabel`, `ariaDescribedBy`, `tabIndex`, `checked`.
- Outputs: `change`, `focus`, `blur`
- Notas: `[(ngModel)]` recomendado; label contenedor habilita click en texto y caja.
- Ej.: `<app-iebem-checkbox label="Recordarme" variant="primary" [(ngModel)]="remember"></app-iebem-checkbox>`

### Table – `app-iebem-table` (TableComponent)
- Tipos: `TableColumn`, `TableConfig`, `TableAction`.
- Config: `hoverable`, `striped`, `bordered`, `compact`, `stickyHeader`, `headerStyle` (`glass|primary|gradient`).
- Data-roles: `table|table-card|table-scroll|table-mobile-card`.
- Ej. mínimo:
```ts
columns = [{ key: 'name', header: 'Nombre' }];
data = employees;
config = { striped: true };
```
```html
<app-iebem-table [columns]="columns" [data]="data" [config]="config"></app-iebem-table>
```
Ej. avanzado (acciones, sticky header):
```ts
columns = [
  { key: 'id', title: 'ID', type: 'number', width: '100px', sortable: true },
  { key: 'name', title: 'Nombre', type: 'text', minWidth: '180px', sortable: true, sticky: true },
  { key: 'dept', title: 'Depto', type: 'badge', width: '160px' },
  { key: 'email', title: 'Email', type: 'text', minWidth: '240px', sortable: true },
  { key: 'salary', title: 'Salario', type: 'number', width: '140px', sortable: true }
];
config = {
  striped: true, stickyHeader: true, headerStyle: 'gradient',
  pagination: { enabled: true, pageSize: 10 },
  sorting: { enabled: true, defaultSort: { column: 'name', direction: 'asc' } },
  filtering: { enabled: true, globalSearch: true },
  actions: { position: 'end', width: '140px', sticky: true }
};
actions = [
  { key: 'view', label: 'Ver', icon: 'eye', color: 'primary' },
  { key: 'edit', label: 'Editar', icon: 'edit', color: 'secondary' },
  { key: 'remove', label: 'Eliminar', icon: 'trash', color: 'danger' }
];
```
```html
<app-iebem-table [columns]="columns" [data]="data" [config]="config" [actions]="actions"></app-iebem-table>
```

### Loader – `app-iebem-loader` (LoaderComponent)
- Inputs: `isVisible`, `config` { `message`, `submessage`, `type` (`default|upload|download|processing|saving|loading|simple`), `showProgress`, `progress`, `showCancel`, `theme` (`light|dark`), `size` (`sm|md|lg`) }.
- Nota: bloquea scroll del body.
- Ej.: `<app-iebem-loader [isVisible]="busy" [config]="{ type: 'processing', message: 'Procesando...', showProgress: true, progress }"></app-iebem-loader>`

### Modal – `app-iebem-modal` (ModalComponent)
- Inputs: `isOpen`, `title`, `subtitle`, `icon`, `iconColor`, `config`, `buttons`, `loading`, `customClass`.
- `config`: `{ size:'sm|md|lg|xl|full', closable, backdrop, keyboard, centered, animation:'fade|slide|zoom', theme:'light|dark', buttonsAlign:'start|center|end' }`
- Outputs: `opened`, `closed`, `buttonClick`, `backdropClick`
- Nota: no usa `cdkConnectedOverlay`; `cdkTrapFocus` activo.
- Ej.:
```html
<app-iebem-modal [isOpen]="open" title="Confirmar" [buttons]="buttons" (buttonClick)="onAction($event)" (closed)="open=false">
  ¿Confirmas la operación?
</app-iebem-modal>
```

### Sidebar – `app-iebem-sidebar` (SidebarComponent)
- Inputs: `isOpen`, `config` { `items: SidebarMenuItem[]`, `logo?`, `version?`, `copyright?`, `collapsible?`, `persistCollapsedState?` }.
- Outputs: `toggleSidebar`, `itemClick`, `collapseChange`, `logoClick`.
- Móvil: al seleccionar hoja con `route`, cierra automáticamente; scrollbar estilizado.
- Ej.:
```ts
config = {
  items: [
    { id: 'home', label: 'Inicio', icon: 'home', route: '/home' },
    { id: 'rep', label: 'Reportes', icon: 'chart-bar', children: [
      { id: 'r1', label: 'Mensual', icon: 'file-alt', route: '/reports/monthly' }
    ]}
  ]
};
```
```html
<app-iebem-sidebar [isOpen]="open" [config]="config" (toggleSidebar)="open=!open"></app-iebem-sidebar>
```

---

## Data roles (pruebas)
- Header: `data-role="header|header-toggle|header-search|header-notifications|header-user"`
- Sidebar: `data-role="sidebar"`
- Modal: `data-role="modal-overlay|modal-wrapper|modal-card"`
- Loader: `data-role="loader"`
- Tabla: `data-role="table-card|table-scroll|table|table-mobile-card"`
- File Upload: `data-role="file-dropzone"`

Ejemplos:
- Cypress: `cy.get('[data-role=table]').within(() => { /* ... */ })`
- Playwright: `await page.locator('[data-role="modal-card"]').getByText('Guardar').click()`

---

## Ejemplo de Página (Integración rápida)
```ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonComponent, InputComponent, CheckboxComponent, TableComponent, ModalComponent, LoaderComponent } from 'iebem-ui';

@Component({
  selector: 'app-ejemplo',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ButtonComponent, InputComponent, CheckboxComponent, TableComponent, ModalComponent, LoaderComponent],
  template: `
  <app-iebem-button variant="primary" label="Nuevo" (click)="open=true"></app-iebem-button>
  <app-iebem-table [columns]="columns" [data]="data" [config]="config"></app-iebem-table>
  <app-iebem-modal [isOpen]="open" title="Crear" [buttons]="[{label:'Cerrar',action:'x',type:'secondary'}]" (closed)="open=false">
    <app-iebem-input label="Nombre" [(ngModel)]="name"></app-iebem-input>
    <app-iebem-checkbox label="Activo" [(ngModel)]="active"></app-iebem-checkbox>
  </app-iebem-modal>
  <app-iebem-loader [isVisible]="loading" [config]="{ type:'processing', message:'Guardando...' }"></app-iebem-loader>
  `
})
export class EjemploComponent {
  open=false; loading=false; name=''; active=false;
  columns=[{key:'name', title:'Nombre', type:'text'}];
  data=[{name:'Juan'}];
  config={ striped:true };
}
```

---

## Troubleshooting
- “Elemento desconocido/no conocido”: importa el componente standalone correcto en `imports`.
- Checkbox no alterna: usa `[(ngModel)]`/`formControlName` en lugar de `[checked]` fijo.
- Overlay en modal: usa `<app-iebem-modal>` (lib) o el modal interno actualizado (sin ConnectedOverlay).
- Scroll de Sidebar sin estilo: asegura `iebem-ui.css` importado y sin overrides del host.
- Cambios de la lib no se ven: re‑compila la lib (`npm run build:ui`) y reinicia el dev server.

## Migración (app → librería)
- Reemplaza selectores `app-*` internos por `app-iebem-*` (p.ej., `app-modal` → `app-iebem-modal`, `app-sidebar` → `app-iebem-sidebar`).
- Sustituye imports: `from '../../shared/ui/.../component'` → `from 'iebem-ui'`.
- Verifica diferencias menores:
  - Modal de la lib no usa `cdkConnectedOverlay` (evita errores de overlay).
  - Sidebar de la lib cierra automáticamente en móvil al navegar.

## Contribución interna
- Mantén API backwards-compatible cuando sea posible.
- Agrega docs y ejemplos al actualizar o añadir componentes.
- Ejecuta `npm run build:ui` antes de integrar en la app.
