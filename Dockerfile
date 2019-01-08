FROM node:alpine

RUN mkdir -p /app
RUN apk add --no-cache libc6-compat
ENV NODE_ENV production
ENV PORT 80
EXPOSE 80

WORKDIR /app
COPY . /app

RUN npm rebuild node-sass
RUN npm install && npm run build

CMD [ "npm", "start" ]