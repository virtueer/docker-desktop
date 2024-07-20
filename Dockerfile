ARG NODE_VERSION=20.7.0

FROM node:${NODE_VERSION}-alpine

RUN mkdir -p /home/node/app

RUN chmod -R 777 /home/node/app

WORKDIR /home/node/app

COPY api/ api/
COPY types/ types/
COPY front/ front/

ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL


WORKDIR /home/node/app/types
RUN npm ci

WORKDIR /home/node/app/front
RUN npm ci
RUN npm run build

WORKDIR /home/node/app/api
RUN npm ci
RUN npm run build

CMD [ "npm", "run", "start:prod" ]