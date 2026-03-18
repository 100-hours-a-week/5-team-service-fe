#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=/dev/null
. "$SCRIPT_DIR/common.sh"

load_deploy_env

LOCAL_HEALTH_URL="http://127.0.0.1:${HOST_PORT}${HEALTH_CHECK_PATH}"

attempt=1
while [ "$attempt" -le "$LOCAL_HEALTH_MAX_ATTEMPTS" ]; do
  if curl -fsS --max-time "$HEALTH_CHECK_TIMEOUT" "$LOCAL_HEALTH_URL" >/dev/null; then
    log "local health check passed: $LOCAL_HEALTH_URL"
    break
  fi

  if [ "$attempt" -eq "$LOCAL_HEALTH_MAX_ATTEMPTS" ]; then
    fail "local health check failed after ${LOCAL_HEALTH_MAX_ATTEMPTS} attempts: $LOCAL_HEALTH_URL"
  fi

  log "waiting for local health check (${attempt}/${LOCAL_HEALTH_MAX_ATTEMPTS})"
  sleep "$LOCAL_HEALTH_SLEEP_SECONDS"
  attempt=$((attempt + 1))
done
