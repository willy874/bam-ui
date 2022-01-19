FROM node:16.13

WORKDIR /app

COPY . .

RUN yarn install

RUN yarn build

CMD ["yarn", "preview"]