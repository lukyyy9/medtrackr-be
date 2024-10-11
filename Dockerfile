FROM node:20.10.0-alpine

COPY ./app /app/

COPY ./package.json /package.json

COPY ./server.js /server.js

RUN npm install

CMD node server.js