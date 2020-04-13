# Container/Image name
FROM node:12.14-alpine
LABEL maintainer="Eric Lai<gamker8911@gmail.com>"

# Prepare packages
ARG PRODUCT_NAME="app"
ENV ENV="/root/.bashrc"
RUN mkdir -p /${PRODUCT_NAME}
RUN mkdir -p /etc/supervisor.d/
WORKDIR /${PRODUCT_NAME}
COPY . .
RUN touch ./src/config.js

# Install default packages
#RUN apk add --no-cache vim gcc g++ supervisor bash
RUN apk add --no-cache vim supervisor bash

# Install requirement
RUN yarn --cwd /${PRODUCT_NAME}

# Setting Env
ENV LANG C.UTF-8
COPY etc/supervisor.ini /etc/supervisor.d/
COPY etc/zoneinfo/Asia/Taipei /etc/localtime
COPY etc/zoneinfo/timezone /etc/timezone
RUN echo 'alias ll="ls -al"' >> /root/.profile

# Startup service
CMD ["supervisord", "-n"]
