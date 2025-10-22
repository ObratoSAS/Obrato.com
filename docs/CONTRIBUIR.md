# Guía de contribución

Gracias por tu interés en contribuir a Obrato LMS. Este documento resume las pautas principales.

## Flujo de trabajo

1. Haz un fork del repositorio y crea una rama descriptiva (`feature/mi-funcionalidad`).
2. Asegúrate de ejecutar `pnpm install` y luego `pnpm lint` / `pnpm test` antes de crear el PR.
3. Sigue las convenciones de commits tipo Conventional Commits (ej. `feat:`, `fix:`).
4. Adjunta capturas o GIFs para cambios visuales relevantes.
5. Documenta decisiones en `docs/DECISIONES.md` y actualiza la documentación cuando sea necesario.

## Estilo de código

- TypeScript estricto en API y frontend.
- ESLint + Prettier aplicados automáticamente mediante Husky (`pnpm prepare`).
- Evitar `any` salvo justificación explícita.
- Priorizar componentes accesibles (atributos ARIA, foco visible, contraste de color).

## Pruebas

- Unitarias con Jest (`apps/api`, `packages/*`).
- Playwright para e2e (pendiente de completar). Añade pruebas al flujo: registro → inscripción →
  completar actividad → calificación.
- Cobertura mínima objetivo: 80%.

## Seguridad y privacidad

- Nunca exponer secrets en commits.
- Validar entradas de usuario y sanitizar contenido HTML.
- Mantener dependencias actualizadas (`pnpm up --latest --recursive` al menos mensualmente).

## Revisión

- Cada PR debe incluir descripción, checklist de pruebas ejecutadas y referencias a issues.
- Se requieren al menos dos aprobaciones para cambios críticos (auth, pagos, archivos).

Gracias por ayudar a construir un LMS abierto, seguro y accesible.
