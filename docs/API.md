# API REST de Obrato LMS

La API expone endpoints REST documentados con Swagger en `/docs`. A continuación se resumen los
principales recursos.

## Autenticación

- `POST /auth/register` – Registro de usuarios locales. Crea cuenta y devuelve tokens JWT.
- `POST /auth/login` – Inicio de sesión con email/contraseña y 2FA opcional.
- `GET /auth/refresh` – Renueva tokens utilizando cookie de refresh.
- `POST /auth/logout` – Revoca refresh token activo.
- `POST /auth/2fa/enable` – Genera secreto TOTP.
- `POST /auth/2fa/disable` – Desactiva 2FA validando token.

### Ejemplo `curl`

```bash
curl -X POST http://localhost:3000/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email": "admin@obrato.test", "password": "Admin123!"}'
```

## Usuarios y roles

- `GET /users` – Lista usuarios con roles asociados.
- `GET /users/:id` – Obtiene perfil.
- `POST /users` – Crea usuario (admin).
- `PATCH /users/:id` – Actualiza atributos.
- `GET /roles`, `GET /permissions` – (Pendiente de implementación completa).

## Cursos

- `GET /courses` – Catálogo con secciones y calificaciones.
- `GET /courses/search?q=` – Búsqueda en Elasticsearch.
- `GET /courses/:id` – Detalle completo con secciones y actividades.
- `POST /courses` – Crea curso (requiere permisos de administrador/gestor).
- `PUT /courses/:id` – Actualiza metadatos.
- `POST /courses/:id/sections` – Crea secciones.

## Matrículas

- `POST /enrollments` – Matricula usuario en curso.
- `DELETE /enrollments` – Suspende matrícula.
- `GET /enrollments/:courseId` – Lista inscritos con método de matrícula.

## Calificaciones

- `GET /grades/courses/:courseId` – Gradebook por curso.
- `POST /grades/entries` – Registra/actualiza calificación.
- `GET /grades/export` – (Pendiente: exportación CSV).

## Archivos

- `POST /files/upload` – Sube archivos a almacenamiento S3 compatible y crea metadata en DB.

## Notificaciones

- `GET /notifications` – Lista notificaciones del usuario autenticado.
- `PATCH /notifications/:id/read` – Marca como leída.

## Plugins

- `GET /plugins` – Lista plugins instalados.
- `POST /plugins` – Instala/actualiza plugin.
- `PATCH /plugins/:key` – Activa/desactiva plugin.

## Convenciones de respuesta

- Formato JSON consistente.
- Errores con `{ "statusCode": number, "message": string | string[], "error": string }`.
- Paginación mediante query params `skip` y `take`.

## Autorización

Los endpoints protegidos requieren encabezado `Authorization: Bearer <token>` o cookies válidas.
Los permisos finos (RBAC/ABAC) se implementarán en guardas específicos en iteraciones futuras.

## GraphQL

- TODO(high): Implementar esquema GraphQL federado una vez estabilizada la API REST.
