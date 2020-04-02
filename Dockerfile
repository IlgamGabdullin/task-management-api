# IMAGE FOR DEVELOPMENT
FROM node:12.10 as development

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm i --only=development

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

RUN npm install --only=production
# RUN apk add --no-cache make gcc g++ python && \
#   npm install && \
#   npm rebuild bcrypt --build-from-source && \
#   apk del make gcc g++ python

COPY . .

COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/main"]