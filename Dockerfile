FROM node:21-alpine3.17

WORKDIR /usr/src
COPY . .

RUN npm install
ENTRYPOINT npm start
