#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=/dev/null
. "$SCRIPT_DIR/common.sh"

load_deploy_env
require_env_vars ECR_REGISTRY ECR_REPOSITORY IMAGE_TAG

IMAGE_URI="$(get_image_uri)"

log "logging in to ECR"
ecr_login

log "pulling image $IMAGE_URI"
docker pull "$IMAGE_URI"
