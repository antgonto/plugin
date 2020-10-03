FROM node:12.18.0

WORKDIR /usr/src/app
COPY package.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production
COPY . /usr/src/app

RUN npm run buildDev

EXPOSE 8090 1617
CMD [ "npm", "start" ]
