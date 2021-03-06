FROM node:16.13

WORKDIR /app

COPY . .

RUN yarn install

CMD ["yarn", "dev"]