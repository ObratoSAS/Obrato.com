# Arquitectura de Obrato LMS

## Visión general

Obrato LMS adopta una arquitectura hexagonal orientada a dominios con separación entre capas de
presentación, aplicación y dominio. El monorepo utiliza PNPM workspaces para compartir código y
configuración entre apps y paquetes.

![Diagrama C4 nivel 1](https://www.plantuml.com/plantuml/png/VP1DIi8m48NlUOenJk6Sps3QB4aKPIWL2gtXL3fb1YISV7SlN_JOJqOWm8QhE3qWlS_6QQLt-Bj0CRB0uZaGx9U4Rm4dYVlH1s1ctdVXLKiLrGQ8zDiRgfhAnSNbSJf5N1X--jdKXVRIlWCBz3h3gPIWwaQweJX-6_QuNIOg9xbjW1SnjX3Xy9QRrS1W00)

## Componentes principales

### API (`apps/api`)

- **NestJS** modular con módulos de dominio: auth, usuarios, cursos, matrículas, calificaciones,
  notificaciones, archivos y plugins.
- **Prisma ORM** contra PostgreSQL con migraciones versionadas y `seed` inicial.
- **BullMQ** + Redis para colas de trabajos (envío de emails, procesamiento SCORM, backups).
- **Elasticsearch** para búsqueda semántica de cursos y contenidos.
- **Observabilidad** con Prometheus (`/metrics`), health checks y logs estructurados (Pino).
- **Seguridad**: Helmet, CSRF, rate limiting (pendiente), JWT con refresh por cookies httpOnly,
  Argon2, 2FA TOTP, validaciones con class-validator.

### Web (`apps/web`)

- **Next.js App Router** con renderizado híbrido (SSR/CSR) y React Query para datos.
- **TailwindCSS + shadcn/ui** adaptado a WCAG 2.1 AA con componentes reutilizables en `packages/ui`.
- **Internacionalización** base mediante configuración de rutas y componentes preparados para Next
  Intl (pendiente de contenido completo en es/en/pt).
- **Accesibilidad**: foco visible, semántica adecuada y colores con contraste suficiente.

### Paquetes compartidos

- `@obrato/lib`: cliente API centralizado y utilidades (axios configurado con credenciales).
- `@obrato/ui`: componentes React accesibles y preset Tailwind.
- `@obrato/plugins`: SDK para crear plugins con validación de manifiesto.

## Integraciones externas

- **PostgreSQL**: base de datos transaccional.
- **Redis**: cache, sesiones y colas BullMQ.
- **MinIO**: almacenamiento S3 compatible para archivos y paquetes SCORM.
- **Elasticsearch/OpenSearch**: búsqueda full-text y autocompletado.
- **SMTP** (no incluido en docker-compose por defecto) para emails transaccionales.

## Observabilidad y DevOps

- **Docker Compose** para entorno local completo.
- **GitHub Actions** (ver `.github/workflows/ci.yml`) para lint, test y build de imágenes Docker.
- **Kubernetes**: manifiestos de ejemplo en `infra/k8s` y base Terraform para IaC opcional.
- **Backups**: scripts en `scripts/` para snapshots de DB y almacenamiento (pendiente cron en k8s).

## Roadmap técnico

- [ ] Implementar motor SCORM completo con seguimiento de intentos y suspend_data.
- [ ] Integrar WebSockets (Gateway NestJS) para chat y notificaciones en tiempo real.
- [ ] Añadir Playwright e2e automáticos y cobertura 80%.
- [ ] Completar internacionalización (en/pt) y soporte RTL.
- [ ] Implementar ABAC para permisos finos a nivel de actividad.
