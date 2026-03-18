#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=/dev/null
. "$SCRIPT_DIR/common.sh"

load_deploy_env
require_env_vars ECR_REGISTRY ECR_REPOSITORY IMAGE_TAG

IMAGE_URI="$(get_image_uri)"

log "starting container $CONTAINER_NAME from $IMAGE_URI"
docker run -d \
  --name "$CONTAINER_NAME" \
  --restart unless-stopped \
  -p "${HOST_PORT}:${CONTAINER_PORT}" \
  "$IMAGE_URI"
