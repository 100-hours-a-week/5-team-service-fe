#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=/dev/null
. "$SCRIPT_DIR/common.sh"

load_deploy_env

LOCAL_HEALTH_URL="http://127.0.0.1:${HOST_PORT}${HEALTH_CHECK_PATH}"
RESPONSE_BODY_FILE="$(mktemp)"

cleanup() {
  rm -f "$RESPONSE_BODY_FILE"
}

trap cleanup EXIT

capture_container_status() {
  if docker ps -a --format '{{.Names}}' | grep -Fxq "$CONTAINER_NAME"; then
    docker ps -a --filter "name=^${CONTAINER_NAME}$" --format 'container={{.Names}} status={{.Status}} image={{.Image}}'
    return 0
  fi

  printf 'container=%s status=not-found\n' "$CONTAINER_NAME"
}

log_container_diagnostics() {
  log "container diagnostics for $CONTAINER_NAME"

  if ! docker ps -a --format '{{.Names}}' | grep -Fxq "$CONTAINER_NAME"; then
    log "container $CONTAINER_NAME not found"
    return 0
  fi

  log "docker inspect summary:"
  docker inspect "$CONTAINER_NAME" \
    --format 'name={{.Name}} status={{.State.Status}} running={{.State.Running}} exit_code={{.State.ExitCode}} error={{.State.Error}} started_at={{.State.StartedAt}} finished_at={{.State.FinishedAt}} oom_killed={{.State.OOMKilled}} restart_count={{.RestartCount}}' \
    || true

  log "recent container logs (tail 200):"
  docker logs --tail 200 "$CONTAINER_NAME" 2>&1 || true
}

attempt=1
while [ "$attempt" -le "$LOCAL_HEALTH_MAX_ATTEMPTS" ]; do
  HTTP_STATUS="$(
    curl -sS \
      --output "$RESPONSE_BODY_FILE" \
      --write-out '%{http_code}' \
      --max-time "$HEALTH_CHECK_TIMEOUT" \
      "$LOCAL_HEALTH_URL" \
      || true
  )"

  if [ "$HTTP_STATUS" -ge 200 ] && [ "$HTTP_STATUS" -lt 400 ]; then
    log "local health check passed: $LOCAL_HEALTH_URL"
    break
  fi

  RESPONSE_BODY="$(tr '\n' ' ' < "$RESPONSE_BODY_FILE" | cut -c1-300)"
  CONTAINER_STATUS="$(capture_container_status)"

  if [ "$attempt" -eq "$LOCAL_HEALTH_MAX_ATTEMPTS" ]; then
    log_container_diagnostics
    fail "local health check failed after ${LOCAL_HEALTH_MAX_ATTEMPTS} attempts: url=$LOCAL_HEALTH_URL status=${HTTP_STATUS:-curl-error} response=${RESPONSE_BODY:-<empty>} $CONTAINER_STATUS"
  fi

  log "waiting for local health check (${attempt}/${LOCAL_HEALTH_MAX_ATTEMPTS}): url=$LOCAL_HEALTH_URL status=${HTTP_STATUS:-curl-error} response=${RESPONSE_BODY:-<empty>} $CONTAINER_STATUS"
  sleep "$LOCAL_HEALTH_SLEEP_SECONDS"
  attempt=$((attempt + 1))
done
