FROM node:22-alpine AS build_image
WORKDIR /app
ARG FETCHER_HOST=localhost
ARG FETCHER_PORT=4000
COPY . .
RUN apk add --no-cache sed \
  && sed -i "s/FETCHER_HOST_TO_BE_REPLACED/${FETCHER_HOST}/g" src/environments/environment.fetcher.ts \
  && sed -i "s/FETCHER_PORT_TO_BE_REPLACED/${FETCHER_PORT}/g" src/environments/environment.fetcher.ts \
  && npm install \
  && node --max-old-space-size=4096 node_modules/.bin/ng build --configuration fetcher \
  && npm prune --production

FROM nginx:alpine
WORKDIR /usr/share/nginx/html
COPY --from=build_image /app/dist/mina-frontend /usr/share/nginx/html
COPY --from=build_image /app/nginx.conf /etc/nginx/nginx.conf
