#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=/dev/null
. "$SCRIPT_DIR/common.sh"

load_deploy_env
require_env_vars TARGET_GROUP_ARN

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

INSTANCE_ID="$(instance_id)"

attempt=1
while [ "$attempt" -le "$ALB_HEALTH_MAX_ATTEMPTS" ]; do
  TARGET_STATE="$(
    aws elbv2 describe-target-health \
      --region "$AWS_REGION" \
      --target-group-arn "$TARGET_GROUP_ARN" \
      --targets "Id=$INSTANCE_ID,Port=$HOST_PORT" \
      --query 'TargetHealthDescriptions[0].TargetHealth.State' \
      --output text 2>/dev/null || true
  )"

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
