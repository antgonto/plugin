FROM node:12.18.0

WORKDIR /usr/src/app
COPY package.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production
COPY . .
EXPOSE 1617
CMD [ "node", "ioServer.js" ]
