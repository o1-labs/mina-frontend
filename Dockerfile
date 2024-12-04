FROM node:22-alpine AS build_image
WORKDIR /app
ARG FETCHER_HOST=localhost
ARG FETCHER_PORT=4000
ENV FETCHER_HOST=${FETCHER_HOST}
ENV FETCHER_PORT=${FETCHER_PORT}
COPY . .
RUN apk add --no-cache gettext \
  && cp src/environments/environment.fetcher.ts src/environments/environment.fetcher.ts.template \
  && envsubst < src/environments/environment.fetcher.ts.template > src/environments/environment.fetcher.ts \
  && npm install \
  && node --max-old-space-size=4096 node_modules/.bin/ng build --configuration fetcher \
  && npm prune --production

FROM nginx:alpine
WORKDIR /usr/share/nginx/html
COPY --from=build_image /app/dist/mina-frontend /usr/share/nginx/html
COPY --from=build_image /app/nginx.conf /etc/nginx/nginx.conf
