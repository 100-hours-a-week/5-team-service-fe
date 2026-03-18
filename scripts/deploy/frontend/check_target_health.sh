#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=/dev/null
. "$SCRIPT_DIR/common.sh"

load_deploy_env
require_env_vars TARGET_GROUP_ARN

INSTANCE_ID="$(instance_id)"

attempt=1
while [ "$attempt" -le "$ALB_HEALTH_MAX_ATTEMPTS" ]; do
  TARGET_STATE="$(target_health_state "$INSTANCE_ID")"

  if [ "$TARGET_STATE" = "healthy" ]; then
    log "ALB target health is healthy for instance $INSTANCE_ID on port $HOST_PORT"
    exit 0
  fi

  if [ "$attempt" -eq "$ALB_HEALTH_MAX_ATTEMPTS" ]; then
    fail "ALB target health did not become healthy. last state: ${TARGET_STATE:-unknown}"
  fi

  log "waiting for ALB target health (${attempt}/${ALB_HEALTH_MAX_ATTEMPTS}), current state: ${TARGET_STATE:-unknown}"
  sleep "$ALB_HEALTH_SLEEP_SECONDS"
  attempt=$((attempt + 1))
done
