FROM node:16-alpine as build
WORKDIR /var/app
COPY . .
RUN yarn install --production=false && \
    yarn build

FROM node:16-alpine as dependencies
WORKDIR /var/app
COPY package.json yarn.* ./
RUN yarn install --production=true

FROM node:16-alpine as run
WORKDIR /usr/app
COPY --from=dependencies /var/app/node_modules ./node_modules/
COPY --from=build /var/app/dist ./dist/
CMD node dist/server.js
