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
  TARGET_ENTRIES="$(target_health_entries)"
  TARGET_STATE="$(target_health_state_from_entries "$INSTANCE_ID" "$TARGET_ENTRIES")"
  TARGET_PORT="$(target_health_port_from_entries "$INSTANCE_ID" "$TARGET_ENTRIES")"
  TARGET_REASON="$(target_health_reason_from_entries "$INSTANCE_ID" "$TARGET_ENTRIES")"
  TARGET_DESCRIPTION="$(target_health_description_from_entries "$INSTANCE_ID" "$TARGET_ENTRIES")"
  TARGET_STATE_MESSAGE="$(describe_target_health_state "$TARGET_STATE")"
  TARGET_PORT_MESSAGE="${TARGET_PORT:-not registered}"
  TARGET_REASON_MESSAGE="${TARGET_REASON:-none}"
  TARGET_DESCRIPTION_MESSAGE="${TARGET_DESCRIPTION:-none}"

  if [ "$TARGET_STATE" = "healthy" ]; then
    log "ALB target health is healthy for instance $INSTANCE_ID on registered port $TARGET_PORT_MESSAGE"
    exit 0
  fi

  if [ "$attempt" -eq 1 ] || [ $((attempt % 5)) -eq 0 ] || [ "$attempt" -eq "$ALB_HEALTH_MAX_ATTEMPTS" ]; then
    log "ALB target lookup for instance $INSTANCE_ID: state=$TARGET_STATE_MESSAGE, registered port=$TARGET_PORT_MESSAGE, expected host port=$HOST_PORT, reason=$TARGET_REASON_MESSAGE, description=$TARGET_DESCRIPTION_MESSAGE"
    log_target_health_snapshot "$TARGET_ENTRIES"
  fi

  if [ "$attempt" -eq "$ALB_HEALTH_MAX_ATTEMPTS" ]; then
    fail "ALB target health did not become healthy within $((ALB_HEALTH_MAX_ATTEMPTS * ALB_HEALTH_SLEEP_SECONDS)) seconds. last state: $TARGET_STATE_MESSAGE, registered port: $TARGET_PORT_MESSAGE, expected host port: $HOST_PORT, reason: $TARGET_REASON_MESSAGE, description: $TARGET_DESCRIPTION_MESSAGE"
  fi

  log "waiting for ALB target health (${attempt}/${ALB_HEALTH_MAX_ATTEMPTS}), current state: $TARGET_STATE_MESSAGE, registered port: $TARGET_PORT_MESSAGE, expected host port: $HOST_PORT, reason: $TARGET_REASON_MESSAGE"
  sleep "$ALB_HEALTH_SLEEP_SECONDS"
  attempt=$((attempt + 1))
done
