#!/usr/bin/env bash
set -euo pipefail
if [ $# -lt 1 ]; then
  echo "Uso: $0 <archivo.sql>" >&2
  exit 1
fi
psql "$DATABASE_URL" <"$1"
echo "Restauración completada"
