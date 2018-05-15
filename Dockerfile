FROM node:latest

RUN mkdir -p /app

WORKDIR /app

COPY ./node /app
COPY ./package.json /app

RUN npm install

EXPOSE 3000

CMD ["node", "index.js"]
