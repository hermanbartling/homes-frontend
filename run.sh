#!/usr/bin/env bash

IMAGE_NAME=difo-homes-frontend

docker stop "$IMAGE_NAME"
docker rm "$IMAGE_NAME"

docker run \
--rm \
--name "$IMAGE_NAME" \
-v /tmp/:/var/www/images/:ro \
-p 8000:8080 \
-e DIFO_API_HOST=http://192.168.1.13:8080 \
-d \
"$IMAGE_NAME":latest

