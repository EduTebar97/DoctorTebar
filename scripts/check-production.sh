#!/usr/bin/env bash
set -euo pipefail

API_URL="${1:-https://api.eduardotebarbotic.com/api}"
WEB_URL="${2:-https://eduardotebarbotic.com}"

echo "Checking API health: ${API_URL}/health"
curl --fail --silent --show-error "${API_URL}/health"
echo

echo "Checking public web: ${WEB_URL}"
curl --fail --silent --show-error --head "${WEB_URL}" >/dev/null
echo "Production smoke checks passed"
