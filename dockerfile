#Descarga la imagen node para instalar angular
FROM node:lts-alpine3.13

WORKDIR /usr/src/app

RUN apk add --update nodejs nodejs-npm &&\
    npm install -g @angular/cli@11.2.0

COPY package*.json ./

CMD mkdir ./node_modules; npm install; ng serve --host 0.0.0.0 --disableHostCheck --poll 500;

EXPOSE 4200
