# Obrato LMS

Obrato LMS es una plataforma de gestión del aprendizaje (LMS) moderna construida desde cero con un
stack JavaScript/TypeScript completo. El objetivo es ofrecer un sistema equivalente a Moodle 4.x en
funcionalidad principal, priorizando seguridad, accesibilidad y escalabilidad.

## Características clave

- **Arquitectura monorepo** con PNPM workspaces, aplicaciones para API (NestJS) y web (Next.js).
- **Backend** con NestJS, Prisma y PostgreSQL, colas con BullMQ y Redis, búsqueda con Elasticsearch y
  almacenamiento S3 compatible (MinIO en desarrollo).
- **Frontend** en Next.js (App Router) con React Query, TailwindCSS y componentes accesibles basados
  en shadcn/ui.
- **Autenticación** con JWT, refresco via cookies httpOnly, soporte de 2FA (TOTP) y OAuth listo para
  ampliarse.
- **Módulos principales**: usuarios, cursos, secciones, actividades, matrículas, calificaciones,
  notificaciones, archivos y plugins.
- **Extensibilidad** mediante un SDK de plugins TypeScript y endpoints para gestión de extensiones.
- **Observabilidad y seguridad** integradas: métricas Prometheus, health checks, Helmet, protección
  CSRF, sanitización de entradas.

## Estructura del repositorio

```
apps/
  api/        API NestJS + Prisma
  web/        Frontend Next.js (App Router)
packages/
  ui/         Librería de componentes compartidos
  lib/        Cliente de API y utilidades compartidas
  plugins/    SDK y ejemplos para plugins de Obrato
infra/
  docker-compose.yml   Entorno local con PostgreSQL, Redis, MinIO y Elasticsearch
  k8s/                 Manifiestos de referencia para Kubernetes
  terraform/           Base para aprovisionamiento opcional
scripts/               Utilidades de semillas, backups y tareas operativas
```

Documentación ampliada disponible en `docs/`.

## Inicio rápido

1. Instala dependencias globales opcionales:

   ```bash
   corepack enable pnpm
   pnpm install
   ```

2. Levanta el entorno de desarrollo con Docker Compose:

   ```bash
   cd infra
   docker-compose up --build
   ```

   Esto inicia PostgreSQL, Redis, MinIO, Elasticsearch, API y web.

3. Aplica migraciones y datos de demostración:

   ```bash
   pnpm --filter @obrato/api prisma migrate deploy
   pnpm --filter @obrato/api run seed
   ```

4. Accede a:

   - API REST + Swagger: http://localhost:3000/docs
   - Aplicación web: http://localhost:3001

Credenciales demo:

- Administrador: `admin@obrato.test` / `Admin123!`
- Profesorado: `teacher1@obrato.test` / `Teacher123!`
- Estudiantes: `student1@obrato.test` / `Student123!`

## Scripts útiles

- `pnpm dev` – ejecuta API y web en modo desarrollo.
- `pnpm build` – compila todas las apps y paquetes.
- `pnpm lint` – linting de todo el monorepo.
- `pnpm test` – pruebas unitarias (Jest) y e2e (Playwright, pendiente de configurar en CI).
- `pnpm format` – formatea con Prettier.

## Calidad y CI

El proyecto integra ESLint, Prettier y commitlint. GitHub Actions (definido en `.github/workflows`) se
encarga de lint, test y construcción de imágenes Docker. La cobertura objetivo mínima es 80%.

## Licencia

Código abierto bajo licencia MIT. Contribuciones bienvenidas, consulta `docs/CONTRIBUIR.md`.
