FROM node:18

WORKDIR /app

COPY . .

RUN npm install

EXPOSE 8004

CMD ["npm", "start"]
