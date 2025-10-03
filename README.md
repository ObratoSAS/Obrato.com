# Plataforma de Registro Académico

Implementación de la prueba técnica utilizando **ASP.NET Core 7** para la API REST y **React + Vite** para la interfaz web.

## Estructura del proyecto

```
backend/AcademicRegistry.Api   API REST construida con ASP.NET Core minimal APIs
frontend/                      Aplicación React con Vite y React Query
```

## Requisitos

- .NET 7 SDK
- Node.js 18+

## Puesta en marcha

### Backend

```bash
cd backend/AcademicRegistry.Api
dotnet restore
dotnet run
```

La API quedará disponible en `http://localhost:5141` con documentación Swagger en `http://localhost:5141/swagger`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

La aplicación web se sirve en `http://localhost:5173` y consume automáticamente la API gracias al proxy configurado en Vite.

### Ver la página activa

1. Inicia la API siguiendo los pasos de la sección **Backend** (deja la terminal en ejecución).
2. En otra terminal inicia el servidor de desarrollo del frontend como se describe en la sección **Frontend**.
3. Abre tu navegador y navega a `http://localhost:5173` para ver la aplicación en tiempo real.
4. Si necesitas acceder a la documentación interactiva de la API, visita `http://localhost:5141/swagger`.

> Consejo: Vite mostrará la URL pública en la terminal; puedes pulsar `o` mientras `npm run dev` está activo para abrirla automáticamente en el navegador predeterminado.

## Funcionalidades principales

- Gestión de programas académicos con validación de créditos y descripción.
- Administración de estudiantes con vinculación a programas y control de duplicados.
- Creación de materias asociadas a profesores y programas.
- Registro de inscripciones con validación de créditos acumulados y nota opcional.
- Panel web con formularios, listados y métricas en tiempo real utilizando React Query.
- Script SQL de referencia (`database.sql`) para crear la base de datos relacional correspondiente.
