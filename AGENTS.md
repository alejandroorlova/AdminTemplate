# Repository Guidelines

## Project Structure & Module Organization
- Source: `src/` with entry points `src/main.ts`, `src/index.html`, global styles in `src/styles.scss` (Tailwind + SCSS).
- App code: `src/app/`
  - Features: `src/app/features/<feature>/<feature>.component.*`
  - Shared: `src/app/shared/` (layout, header, utils, types, and reusable UI components under `shared/ui/`).
- Routing: `src/app/app.routes.ts` (standalone routes). Login is separate; all other pages render inside `shared/layout`.
- Assets: `public/` copied to build output.

## Build, Test, and Development Commands
- `npm start` (or `ng serve`): run dev server at `http://localhost:4200/`.
- `npm run build`: production build to `dist/iebem-admin-system/`.
- `npm run watch`: rebuild on changes (development configuration).
- `npm test` (or `ng test`): run unit tests with Karma/Jasmine.
- Scaffolding examples:
  - `ng generate component features/example` (standalone, SCSS per `angular.json`).

## Coding Style & Naming Conventions
- Indentation: 2 spaces; charset UTF-8; trim trailing whitespace (`.editorconfig`).
- Quotes: single quotes in `.ts`.
- Filenames: kebab-case; Angular files end with `.component.ts/.html/.scss`; tests end with `.spec.ts`.
- Selectors: prefix `app-` (see `angular.json` prefix).
- Styling: Tailwind utility classes + SCSS modules; shared design tokens in `src/styles.scss` and theme in `tailwind.config.js`.

## Testing Guidelines
- Framework: Jasmine + Karma (see `devDependencies`).
- Location: co-located `.spec.ts` next to source (e.g., `table.component.spec.ts`).
- Run: `npm test`; with coverage: `ng test --code-coverage` (outputs `coverage/`).
- Name tests after the unit under test and keep fast, isolated specs.

## Commit & Pull Request Guidelines
- Commits: concise, imperative (e.g., `fix modal issues`, `add loader simple`). Optionally adopt Conventional Commits (`feat:`, `fix:`, `refactor:`) for clarity.
- PRs: include a clear description, linked issue (if any), screenshots/GIFs for UI changes, and a brief test plan. Keep PRs focused and small.

## Architecture Overview & Tips
- Angular 19 with standalone components; router providers and animations configured in `src/main.ts`.
- Routes lazy-load components via `loadComponent` and render under `shared/layout`.
- Avoid hardcoding secrets; prefer environment-based or runtime config if added later. Exclude large binaries from VCS where possible.

## UI Patterns (Resumen)
- Botones: usa clases `btn-*` (`btn-primary|secondary|accent|success|warning|danger|info|dark|light|outline|gradient`) + tamaños `btn-sm|md|lg` y `btn-shadow` si aplica.
- Inputs/selects/date: aplica `input-default|error|success|disabled` y envuelve con `app-form-field` pasando `touched` y `empty`.
- Tabla: usa utilidades `tbl-*` y flags en `TableConfig` (`hoverable`, `striped`, `bordered`, `compact`, `stickyHeader`). Scroll horizontal local con `.tbl-scroll`.
- Checkbox: utiliza `chk-*` para base, variantes y tamaños.
- Modal: `<app-modal [config]="{ size, centered, backdrop, closable, buttonsAlign }" [buttons]="[{ label, action, type, size }]>` (ver README para ejemplo rápido).
