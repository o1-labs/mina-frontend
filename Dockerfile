FROM node:22-alpine AS build_image
WORKDIR /app
ARG FETCHER_HOST=http://65.21.209.217
ARG FETCHER_PORT=4000
ARG APP_CONFIG=fetcher
ENV FETCHER_HOST=${FETCHER_HOST}
ENV FETCHER_PORT=${FETCHER_PORT}
ENV EXPERIMENTS_BACKEND_API_ENDPOINT=${FETCHER_HOST}:3003/api/experiments
COPY . .
RUN npm install \
  && node --max-old-space-size=4096 node_modules/.bin/ng build --configuration ${APP_CONFIG} \
  && npm prune --production

FROM nginx:alpine
WORKDIR /usr/share/nginx/html
COPY --from=build_image /app/dist/mina-frontend /usr/share/nginx/html
COPY --from=build_image /app/nginx.conf /etc/nginx/nginx.conf
