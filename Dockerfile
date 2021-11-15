FROM node:latest

ENV CYPRESS_INSTALL_BINARY=0
ENV PRISMA_SKIP_POSTINSTALL_GENERATE=1

WORKDIR /app

COPY / ./

RUN npm install -g pnpm
# the install fails without --unsafe-perm
RUN pnpm install --unsafe-perm 
# generate on prepare doesn't work in the container for some reason
RUN pnpx prisma generate
RUN pnpm build

CMD [ "pnpm", "start" ]
