#!/bin/sh

set -a
source .env.production
set +a

echo "\n"

RELEASE_VERSION=$(cat ./RELEASE_VERSION)
echo "Getting version from ./RELEASE_VERSION: $RELEASE_VERSION"

echo "✅ Release version: $RELEASE_VERSION"

if [ -z "$DOCKER_REGISTRY" ]; then
    echo "\"\$DOCKER_REGISTRY\" is not set"
    exit 1
fi

if [ -z "$DOCKER_NAMESPACE" ]; then
    echo "\"\$DOCKER_NAMESPACE\" is not set"
    exit 1
fi

if [ -z "$DOCKER_REPO" ]; then
    echo "\"\$DOCKER_REPO\" is not set"
    exit 1
fi

IMAGE_TAG="v${RELEASE_VERSION}-stable"

if [ "$1" == "-y" ]; then
  confirm="y"
else
  echo "\n"
  read -p "Do you want to continue releasing docker image ($DOCKER_REPO:$IMAGE_TAG)? (Y/n) " confirm
  confirm=${confirm:-y}
fi

if [ "$confirm" != "y" -a "$confirm" != "Y" ]; then
    echo "❌ Release Docker Image cancelled"
    exit 1
fi

echo ""
echo "✅ Building image: $DOCKER_REGISTRY/$DOCKER_NAMESPACE/$DOCKER_REPO:$IMAGE_TAG"
echo ""

i=3
while [ $i -gt 0 ]; do
    printf "."
    sleep 1
    i=$((i-1))
done
echo "\n\n\n\n"

docker buildx build \
    --platform linux/amd64 \
    --progress=plain \
    --push \
    -t $DOCKER_REGISTRY/$DOCKER_NAMESPACE/$DOCKER_REPO:$IMAGE_TAG \
    -f Dockerfile.fe .

if [ $? -ne 0 ]; then
    echo "❌ Image built failed"
    echo ""
    exit 1
else
    echo "✅ Image pushed to $DOCKER_REGISTRY/$DOCKER_NAMESPACE/$DOCKER_REPO:$IMAGE_TAG"
    echo ""
fi
