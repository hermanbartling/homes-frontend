#!/usr/bin/env bash
# Templating in chosen env variables in site settings

set -eu

envsubst '${DIFO_API_HOST}' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf

exec "$@"