#!/usr/bin/env bash
# currently assumes and builds only x86_64. 

# Set default image tag and name
IMAGE_TAG="local1"
IMAGE_NAME="ph-ee-operations-web"
BUILDER_IMAGE="node:19-alpine" 
NGINX_IMAGE="nginx:1.19.3" 
ARCH="x86_64"
export DOCKER_CLI_EXPERIMENTAL=enabled
export BUILDX_EXPERIMENTAL=1

# docker buildx build . 
# env 

# Function to build an image for a specific architecture
build_image() {
  local ARCH=$1  # Architecture (e.g., x86_64, arm64)
  #DOCKER_CLI_EXPERIMENTAL=enabled
  echo "Building image for architecture: $ARCH"
  docker buildx build  .
  docker buildx build \
      --platform "linux/${ARCH}" \
      --build-arg BUILDER_IMAGE="$BUILDER_IMAGE" \
      --build-arg NGINX_IMAGE="$NGINX_IMAGE" \
      --build-arg NPM_REGISTRY_URL=https://registry.npmjs.org/ \
      --build-arg PUPPETEER_DOWNLOAD_HOST_ARG=https://storage.googleapis.com \
      --build-arg PUPPETEER_CHROMIUM_REVISION_ARG=1011831 \
      -t "$IMAGE_NAME:$IMAGE_TAG" .
}

# # Ensure Docker supports buildx
# if ! docker buildx --version >/dev/null 2>&1; then
#   echo "Error: Docker buildx is not available or not enabled. Please check your Docker installation."
#   exit 1
# fi

# # Get architecture flag (optional)
# ARCH="${1:-x86_64}"  # Default to x86_64 if no flag provided

# # Validate architecture
# if [[ ! "$ARCH" =~ ^(x86_64|arm64)$ ]]; then
#   echo "Invalid architecture: $ARCH. Valid options are x86_64 and arm64."
#   exit 1
# fi

# Build for both architectures sequentially
build_image "$ARCH"
#build_image "$(if [[ "$ARCH" == x86_64 ]]; then echo arm64; else echo x86_64; fi)"

echo "Build completed for x86_64 architecture "