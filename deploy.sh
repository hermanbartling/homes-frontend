#!/usr/bin/env bash

docker_image_filename=/tmp/difo-homes-frontend-dockerimage.tar
docker_image_name=difo-homes-frontend

if [[ "$1" == "prd" ]]; then
    server='åsen'

    difo_image_path=/home/herman/projs/difo-homes/images
    difo_api_host=http://192.168.1.13:8080

    docker build -t "$docker_image_name":latest .
    docker save -o "$docker_image_filename" difo-homes-frontend:latest
    scp "$docker_image_filename" åsen:"$docker_image_filename"
    ssh -A "$server" "docker load -i $docker_image_filename

    docker stop "$docker_image_name"
    docker rm "$docker_image_name"

    echo "Starting $docker_image_name on $server using config:"
    echo " - image path: $difo_image_path"
    echo " - api host: $difo_api_host"

    docker run \
    --rm \
    --name "$docker_image_name" \
    -v $difo_image_path/:/var/www/images/:ro \
    -p 8000:8080 \
    -e DIFO_API_HOST=$difo_api_host \
    -d \
    "$docker_image_name":latest"

    echo ""
    echo "DONE!"
    echo ""
else
    echo "$1 not recognized environment, we only support: [prd]"
fi

