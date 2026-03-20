#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=/dev/null
. "$SCRIPT_DIR/common.sh"

load_deploy_env

if docker ps -a --format '{{.Names}}' | grep -Fxq "$CONTAINER_NAME"; then
  if docker ps --format '{{.Names}}' | grep -Fxq "$CONTAINER_NAME"; then
    log "stopping existing container $CONTAINER_NAME with SIGTERM and ${CONTAINER_STOP_TIMEOUT_SECONDS}s timeout"
    docker stop --time "$CONTAINER_STOP_TIMEOUT_SECONDS" "$CONTAINER_NAME"
  else
    log "removing existing stopped container $CONTAINER_NAME"
  fi

  docker rm "$CONTAINER_NAME"
else
  log "no existing container to stop"
fi
