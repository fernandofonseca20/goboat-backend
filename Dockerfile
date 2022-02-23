FROM node:alpine

RUN apk add --no-cache tzdata
ENV TZ America/Sao_Paulo
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

WORKDIR /

COPY ./src ./src/
COPY .env tsconfig.json package.json yarn.lock /

RUN yarn

COPY . .

EXPOSE 3333

CMD ["yarn", "start:ts"]