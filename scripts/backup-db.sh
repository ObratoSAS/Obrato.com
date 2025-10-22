#!/usr/bin/env bash
set -euo pipefail
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
OUTPUT_DIR=${1:-backups}
mkdir -p "$OUTPUT_DIR"
pg_dump "$DATABASE_URL" >"$OUTPUT_DIR/obrato-${TIMESTAMP}.sql"
echo "Backup creado en $OUTPUT_DIR/obrato-${TIMESTAMP}.sql"
