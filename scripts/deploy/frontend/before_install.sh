#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=/dev/null
. "$SCRIPT_DIR/common.sh"

log "preparing frontend CodeDeploy directories"
mkdir -p "$DEPLOY_BASE_DIR"

require_command docker
require_command curl
require_command aws

if [ ! -f "$DEPLOY_ENV_FILE" ]; then
  log "deploy env file not found yet: $DEPLOY_ENV_FILE"
  if [ -f "$DEPLOY_ENV_EXAMPLE_FILE" ]; then
    log "example env file exists. production deployment must package deploy.env with real values"
  fi
fi
