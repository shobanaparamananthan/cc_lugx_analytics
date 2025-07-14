FROM node:18

WORKDIR /app
COPY . .
RUN npm install

EXPOSE 8002
CMD ["nodemon", "app.js"]