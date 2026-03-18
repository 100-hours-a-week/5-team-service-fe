#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=/dev/null
. "$SCRIPT_DIR/common.sh"

load_deploy_env

if docker ps -a --format '{{.Names}}' | grep -Fxq "$CONTAINER_NAME"; then
  log "stopping existing container $CONTAINER_NAME"
  docker rm -f "$CONTAINER_NAME"
else
  log "no existing container to stop"
fi
