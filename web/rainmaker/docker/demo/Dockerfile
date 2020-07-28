
FROM egovio/alpine-node-builder-10:yarn AS build
ARG WORK_DIR
WORKDIR /app

# copy the project files
COPY ${WORK_DIR} .
RUN yarn run prod:demo

# Create runtime image
FROM nginx:mainline-alpine
ENV WEB_DIR=/var/web/demo

RUN mkdir -p ${WEB_DIR}

COPY --from=build /app/dev-packages/demo/build ${WEB_DIR}/

COPY --from=build /app/docker/demo/nginx.conf /etc/nginx/conf.d/default.conf
