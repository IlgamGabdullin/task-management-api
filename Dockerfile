# IMAGE FOR DEVELOPMENT
FROM node:12.10 as development

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm i --only=development && npm rebuild bcrypt --build-from-source

# RUN apk --no-cache add --virtual native-deps \
#   g++ gcc libgcc libstdc++ linux-headers autoconf automake make nasm python git && \
#   npm install --quiet node-gyp -g

# RUN apk add --no-cache make gcc g++ python && \
#   npm install && \
#   npm rebuild bcrypt --build-from-source && \
#   apk del make gcc g++ python

COPY . .

RUN npm run build


# IMAGE FOR PRODUCTION
FROM node:12.10 as production

ARG NODE_ENV=production

ENV NODE_ENV=${NODE_ENV}

COPY package*.json ./

# RUN npm install --only=production

RUN npm i --only=production && npm rebuild bcrypt --build-from-source
# RUN apk add --no-cache make gcc g++ python && \
#   npm install && \
#   npm rebuild bcrypt --build-from-source && \
#   apk del make gcc g++ python

COPY . .

COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/main"]