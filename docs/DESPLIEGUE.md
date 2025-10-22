# Guía de despliegue

## Variables de entorno

Crea archivos `.env` en `apps/api` y `apps/web` basados en `.env.example` (ver más abajo).

### API (`apps/api/.env.example`)

```
DATABASE_URL=postgresql://obrato:obrato@postgres:5432/obrato
REDIS_HOST=redis
REDIS_PORT=6379
ELASTICSEARCH_NODE=http://elasticsearch:9200
S3_ENDPOINT=http://minio:9000
S3_ACCESS_KEY=minioadmin
S3_SECRET_KEY=minioadmin
S3_BUCKET=obrato-files
JWT_SECRET=super-secret-key
JWT_REFRESH_SECRET=super-refresh-secret
PORT=3000
```

### Web (`apps/web/.env.example`)

```
NEXT_PUBLIC_API_URL=http://localhost:3000
API_INTERNAL_URL=http://api:3000
```

## Docker Compose (local)

```
cd infra
cp .env.example .env
docker-compose up --build
```

Servicios expuestos:

- API: http://localhost:3000
- Web: http://localhost:3001
- MinIO console: http://localhost:9001
- Elasticsearch: http://localhost:9200

## Kubernetes (referencia)

`infra/k8s` incluye manifiestos base:

- `api-deployment.yaml` y `api-service.yaml`
- `web-deployment.yaml` y `web-service.yaml`
- `postgres-statefulset.yaml`, `redis-deployment.yaml`, `minio-statefulset.yaml`

Adapta imágenes, secrets y storage según tu cluster. Se recomienda usar Ingress con TLS y secretos
administrados (ej. External Secrets Operator).

## Terraform (opcional)

El directorio `infra/terraform` contiene estructura inicial para aprovisionar:

- VPC + subredes
- Base de datos administrada (ej. AWS RDS PostgreSQL)
- Elasticache/MemoryDB
- Bucket S3 para almacenamiento

Completa variables y proveedores según el cloud deseado.

## CI/CD

- GitHub Actions construye imágenes y las publica en GHCR (configurar secrets `REGISTRY_USER`,
  `REGISTRY_TOKEN`).
- Despliegues continuos pueden automatizarse con ArgoCD/Flux o pipelines nativas del proveedor.

## Backups

Scripts en `scripts/`:

- `backup-db.sh` – Exporta base de datos PostgreSQL con `pg_dump`.
- `backup-storage.sh` – Sincroniza objetos de MinIO/S3 a almacenamiento frío.
- `restore-db.sh` – Restaura dump SQL.

Programa cron jobs (K8s CronJob) para ejecutar respaldos diarios/semanales según SLA.
