FROM node:10.22.0-alpine

WORKDIR /opt/bbjet-versionado
# API
ADD dist/server/. ./server
# ADD dist/.env_default ./.env_default
ADD dist/package.json ./package.json
ADD dist/package-lock.json ./package-lock.json
# UI
ADD dist/index.html ./dist/index.html
ADD dist/favicon.ico ./dist/favicon.ico
ADD dist/css/. ./dist/css
ADD dist/fonts/. ./dist/fonts
ADD dist/js/. ./dist/js

ADD entrypoint.sh ./entrypoint.sh

RUN apk update && \
  apk upgrade && \
  apk add --no-cache curl bash dos2unix tzdata

RUN cp /usr/share/zoneinfo/America/Argentina/Buenos_Aires /etc/localtime
RUN echo "America/Argentina/Buenos_Aires" >  /etc/timezone
RUN dos2unix ./entrypoint.sh
RUN chmod +x ./entrypoint.sh
RUN npm i --production
ENTRYPOINT ["./entrypoint.sh"]

EXPOSE 3000