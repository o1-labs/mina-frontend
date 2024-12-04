FROM node:22 AS BUILD_IMAGE
WORKDIR /app

# Define build arguments for environment variables
ARG FETCHER_HOST=localhost
ARG FETCHER_PORT=4000

COPY . .
RUN npm install

# Pass build arguments to the environment and run the build command
ENV FETCHER_HOST=$FETCHER_HOST
ENV FETCHER_PORT=$FETCHER_PORT
RUN node_modules/.bin/ng build --configuration fetcher && npm prune --production

FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# Copy built files and nginx configuration
COPY --from=BUILD_IMAGE /app/dist/mina-frontend /usr/share/nginx/html
COPY --from=BUILD_IMAGE /app/nginx.conf /etc/nginx/nginx.conf
