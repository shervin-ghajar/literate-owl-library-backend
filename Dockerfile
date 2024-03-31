#set node base image
FROM node:slim

# install vim
RUN apt-get update
RUN apt-get install -y  vim

RUN mkdir -p /app/src
COPY ./package.json /app/package.json
COPY ./.babelrc /app/.babelrc
WORKDIR /app
RUN npm install

COPY ./src /app/src/