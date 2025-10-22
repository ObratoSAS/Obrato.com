# DECISIONES

Registro de supuestos y decisiones tomadas durante la implementación inicial de Obrato LMS.

## Base de datos y ORM

- Se utiliza **PostgreSQL** como base principal por su robustez y compatibilidad con Prisma.
- Se modelaron entidades clave (usuarios, cursos, actividades, calificaciones, competencias, etc.) en
  `schema.prisma`. Algunas relaciones avanzadas (por ejemplo, historial de cambios, rúbricas
  detalladas, ABAC) quedan en el roadmap.

## Autenticación

- Se implementó autenticación JWT con refresh tokens almacenados como hash Argon2 en la tabla de
  usuarios. La integración OAuth2/OIDC se deja preparada a través de Passport pero requiere
  configurar credenciales en futuras iteraciones.
- 2FA utiliza TOTP mediante `otplib`. Para producción se recomienda persistir la configuración en un
  almacén seguro y habilitar validaciones adicionales (ej. rate limiting por IP).

## Frontend

- Se priorizó Next.js con React Query para un MVP funcional. Flujos complejos (constructor de
  cuestionarios drag&drop, visor SCORM completo, reportes gráficos) se documentan como tareas
  futuras.
- Internacionalización lista para ampliarse; inicialmente se entrega contenido en español y se
  documenta la extensión a inglés y portugués.

## Seguridad

- CSP, rate limiting y validaciones adicionales se listan como TODO de alta prioridad para entornos
  productivos.
- Sanitización HTML en envíos de usuarios deberá incorporarse (por ejemplo, DOMPurify) antes de
  habilitar editores ricos en producción.

## Infraestructura

- Docker Compose incluye PostgreSQL, Redis, MinIO y Elasticsearch. Servicios como SMTP y OpenSearch
  distribuido se agregan a demanda.
- Manifiestos Kubernetes y Terraform se entregan como esqueletos a completar según el entorno de la
  organización (ver `infra/`).

## Cobertura de funcionalidades

- El MVP cubre registro/login, gestión básica de cursos, secciones, actividades, matrícula, calificador
  simple, notificaciones y plugins. Funciones avanzadas (SCORM completo, proctoring, banca de ítems
  avanzada, analítica adaptativa) se planifican en la hoja de ruta (`docs/ARQUITECTURA.md`).
