#!/usr/bin/env bash

set -euo pipefail

DEPLOY_BASE_DIR="${DEPLOY_BASE_DIR:-/home/ubuntu/deploy/frontend}"
DEPLOY_ENV_FILE="${DEPLOY_ENV_FILE:-$DEPLOY_BASE_DIR/deploy.env}"
DEPLOY_ENV_EXAMPLE_FILE="${DEPLOY_ENV_EXAMPLE_FILE:-$DEPLOY_BASE_DIR/deploy.env.example}"

log() {
  printf '[frontend-codedeploy] %s\n' "$*"
}

fail() {
  log "ERROR: $*"
  exit 1
}

require_command() {
  local command_name="$1"
  command -v "$command_name" >/dev/null 2>&1 || fail "required command not found: $command_name"
}

load_deploy_env() {
  if [ ! -f "$DEPLOY_ENV_FILE" ]; then
    if [ -f "$DEPLOY_ENV_EXAMPLE_FILE" ]; then
      fail "missing $DEPLOY_ENV_FILE. replace deploy.env.example with a real deploy.env in the CodeDeploy revision"
    fi
    fail "missing $DEPLOY_ENV_FILE"
  fi

  set -a
  # shellcheck disable=SC1090
  . "$DEPLOY_ENV_FILE"
  set +a

  AWS_REGION="${AWS_REGION:-ap-northeast-2}"
  CONTAINER_NAME="${CONTAINER_NAME:-doktori-frontend}"
  HOST_PORT="${HOST_PORT:-3000}"
  CONTAINER_PORT="${CONTAINER_PORT:-3000}"
  HEALTH_CHECK_PATH="${HEALTH_CHECK_PATH:-/}"
  HEALTH_CHECK_TIMEOUT="${HEALTH_CHECK_TIMEOUT:-5}"
  ALB_HEALTH_MAX_ATTEMPTS="${ALB_HEALTH_MAX_ATTEMPTS:-24}"
  ALB_HEALTH_SLEEP_SECONDS="${ALB_HEALTH_SLEEP_SECONDS:-5}"
  LOCAL_HEALTH_MAX_ATTEMPTS="${LOCAL_HEALTH_MAX_ATTEMPTS:-30}"
  LOCAL_HEALTH_SLEEP_SECONDS="${LOCAL_HEALTH_SLEEP_SECONDS:-2}"
}

require_env_vars() {
  local missing=()
  local var_name
  for var_name in "$@"; do
    if [ -z "${!var_name:-}" ]; then
      missing+=("$var_name")
    fi
  done

  if [ "${#missing[@]}" -gt 0 ]; then
    fail "missing required environment variables: ${missing[*]}"
  fi
}

get_image_uri() {
  require_env_vars ECR_REGISTRY ECR_REPOSITORY IMAGE_TAG
  printf '%s/%s:%s' "$ECR_REGISTRY" "$ECR_REPOSITORY" "$IMAGE_TAG"
}

ecr_login() {
  require_command aws
  require_command docker
  require_env_vars AWS_REGION ECR_REGISTRY

  export DOCKER_CONFIG="${DOCKER_CONFIG:-/tmp/.docker}"
  mkdir -p "$DOCKER_CONFIG"

  aws ecr get-login-password --region "$AWS_REGION" \
    | docker login --username AWS --password-stdin "$ECR_REGISTRY"
}

instance_id() {
  curl -fsS http://169.254.169.254/latest/meta-data/instance-id
}
