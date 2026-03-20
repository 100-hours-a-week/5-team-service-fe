#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=/dev/null
. "$SCRIPT_DIR/common.sh"

load_deploy_env
require_env_vars ECR_REGISTRY ECR_REPOSITORY IMAGE_TAG AWS_REGION AWSLOGS_GROUP AWSLOGS_STREAM_PREFIX

IMAGE_URI="$(get_image_uri)"

log "starting container $CONTAINER_NAME from $IMAGE_URI"
docker run -d \
  --name "$CONTAINER_NAME" \
  --restart unless-stopped \
  --stop-signal SIGTERM \
  --stop-timeout "$CONTAINER_STOP_TIMEOUT_SECONDS" \
  --log-driver awslogs \
  --log-opt awslogs-region="$AWS_REGION" \
  --log-opt awslogs-group="$AWSLOGS_GROUP" \
  --log-opt awslogs-stream-prefix="$AWSLOGS_STREAM_PREFIX" \
  --log-opt awslogs-create-group="$AWSLOGS_CREATE_GROUP" \
  -p "${HOST_PORT}:${CONTAINER_PORT}" \
  "$IMAGE_URI"
