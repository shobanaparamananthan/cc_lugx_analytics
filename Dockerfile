FROM node:18

WORKDIR /app
COPY . .s3click
RUN npm install

EXPOSE 8004
CMD ["npx","nodemon", "app.js"]