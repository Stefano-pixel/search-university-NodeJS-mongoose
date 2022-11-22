FROM node:16.14.2

WORKDIR /app

COPY . /app

RUN npm install

EXPOSE 3001

CMD ["npm", "start"]