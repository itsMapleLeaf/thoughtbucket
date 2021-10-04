FROM node:latest

ENV PORT=8080

ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL

WORKDIR /app

COPY / ./

# remove cypress from package.json, it takes too long to install
RUN sed -i '/"cypress":/d' package.json

RUN npm install -g pnpm
RUN pnpm install
RUN pnpx prisma generate
RUN pnpm run build
RUN pnpx prisma db push

CMD [ "pnpm", "start" ]
