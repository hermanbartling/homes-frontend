# First building the app with npm -> generating the static files
# Alt: https://codefresh.io/docker-tutorial/node_docker_multistage/
FROM node AS build
WORKDIR /app
COPY . .
RUN npm run build

FROM nginx:stable

# Then copy assets built to the nginx dir
COPY --from=build /app/build/ /var/www

# And the nginx config
COPY ./nginx-base.conf /etc/nginx/nginx.conf
COPY ./nginx-difo-frontend.conf.template /etc/nginx/conf.d/default.conf.template
COPY ./docker-entrypoint.sh /

# pre-create and change ownership files that nginx needs to be able to write to
RUN touch /var/run/nginx.pid && \
  chown -R www-data:www-data /var/run/nginx.pid && \
  chown -R www-data:www-data /var/cache/nginx && \
  chown www-data:www-data /docker-entrypoint.sh && \
  chown www-data:www-data /etc/nginx/conf.d/default.conf.template && \
  chown www-data:www-data /etc/nginx/conf.d/default.conf

# Change to non-root user (http://pjdietz.com/2016/08/28/nginx-in-docker-without-root.html)
USER www-data

ENTRYPOINT ["/docker-entrypoint.sh"]

# start nginx
CMD ["nginx"]
