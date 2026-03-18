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
  TARGET_PORT="$(target_health_port "$INSTANCE_ID")"
  TARGET_STATE_MESSAGE="$(describe_target_health_state "$TARGET_STATE")"
  TARGET_PORT_MESSAGE="${TARGET_PORT:-not registered}"

  if [ "$TARGET_STATE" = "healthy" ]; then
    log "ALB target health is healthy for instance $INSTANCE_ID on registered port $TARGET_PORT_MESSAGE"
    exit 0
  fi

  if [ "$attempt" -eq "$ALB_HEALTH_MAX_ATTEMPTS" ]; then
    fail "ALB target health did not become healthy within $((ALB_HEALTH_MAX_ATTEMPTS * ALB_HEALTH_SLEEP_SECONDS)) seconds. last state: $TARGET_STATE_MESSAGE, registered port: $TARGET_PORT_MESSAGE, expected host port: $HOST_PORT"
  fi

  log "waiting for ALB target health (${attempt}/${ALB_HEALTH_MAX_ATTEMPTS}), current state: $TARGET_STATE_MESSAGE, registered port: $TARGET_PORT_MESSAGE, expected host port: $HOST_PORT"
  sleep "$ALB_HEALTH_SLEEP_SECONDS"
  attempt=$((attempt + 1))
done
