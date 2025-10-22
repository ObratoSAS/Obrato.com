#!/usr/bin/env bash
set -euo pipefail
if ! command -v mc >/dev/null 2>&1; then
  echo "El cliente MinIO (mc) es requerido" >&2
  exit 1
fi
ALIAS=${MINIO_ALIAS:-obrato}
mc alias set "$ALIAS" "$S3_ENDPOINT" "$S3_ACCESS_KEY" "$S3_SECRET_KEY"
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
mc mirror "$ALIAS/$S3_BUCKET" "backups/storage-$TIMESTAMP"
echo "Backup de almacenamiento completado"
