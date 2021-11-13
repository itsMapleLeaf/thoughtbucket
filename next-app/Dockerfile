FROM node:latest

ENV PORT=8080
ENV CYPRESS_INSTALL_BINARY=0

WORKDIR /app

COPY / ./

RUN npm install -g pnpm
RUN pnpm install
# generate on prepare doesn't work in the container for some reason
RUN pnpx prisma generate
RUN pnpm run build

CMD [ "pnpm", "start" ]
