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
  ALB_HEALTH_MAX_ATTEMPTS="${ALB_HEALTH_MAX_ATTEMPTS:-60}"
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
  local token

  token="$(
    curl -fsS -X PUT \
      -H "X-aws-ec2-metadata-token-ttl-seconds: 21600" \
      http://169.254.169.254/latest/api/token
  )"

  curl -fsS \
    -H "X-aws-ec2-metadata-token: $token" \
    http://169.254.169.254/latest/meta-data/instance-id
}

target_health_state() {
  local instance_id_value="$1"
  local entries
  local preferred_port=""
  local preferred_state=""
  local fallback_port=""
  local fallback_state=""
  local target_id=""
  local target_port=""
  local target_state=""

  entries="$(
    aws elbv2 describe-target-health \
      --region "$AWS_REGION" \
      --target-group-arn "$TARGET_GROUP_ARN" \
      --query 'TargetHealthDescriptions[].[Target.Id,Target.Port,TargetHealth.State]' \
      --output text 2>/dev/null || true
  )"

  if [ -z "$entries" ]; then
    return 0
  fi

  while IFS=$'\t' read -r target_id target_port target_state; do
    [ "$target_id" = "$instance_id_value" ] || continue

    if [ "$target_port" = "$HOST_PORT" ]; then
      preferred_port="$target_port"
      preferred_state="$target_state"
      break
    fi

    if [ -z "$fallback_port" ]; then
      fallback_port="$target_port"
      fallback_state="$target_state"
    fi
  done <<EOF
$entries
EOF

  if [ -n "$preferred_state" ]; then
    printf '%s' "$preferred_state"
    return 0
  fi

  if [ -n "$fallback_state" ]; then
    printf '%s' "$fallback_state"
  fi
}

target_health_port() {
  local instance_id_value="$1"
  local entries
  local preferred_port=""
  local fallback_port=""
  local target_id=""
  local target_port=""
  local target_state=""

  entries="$(
    aws elbv2 describe-target-health \
      --region "$AWS_REGION" \
      --target-group-arn "$TARGET_GROUP_ARN" \
      --query 'TargetHealthDescriptions[].[Target.Id,Target.Port,TargetHealth.State]' \
      --output text 2>/dev/null || true
  )"

  if [ -z "$entries" ]; then
    return 0
  fi

  while IFS=$'\t' read -r target_id target_port target_state; do
    [ "$target_id" = "$instance_id_value" ] || continue

    if [ "$target_port" = "$HOST_PORT" ]; then
      preferred_port="$target_port"
      break
    fi

    if [ -z "$fallback_port" ]; then
      fallback_port="$target_port"
    fi
  done <<EOF
$entries
EOF

  if [ -n "$preferred_port" ]; then
    printf '%s' "$preferred_port"
    return 0
  fi

  if [ -n "$fallback_port" ]; then
    printf '%s' "$fallback_port"
  fi
}

describe_target_health_state() {
  local target_state="${1:-}"

  case "$target_state" in
    healthy)
      printf 'healthy'
      ;;
    "")
      printf 'target not registered yet'
      ;;
    None|none|null|unknown)
      printf 'target not registered yet'
      ;;
    *)
      printf '%s' "$target_state"
      ;;
  esac
}
