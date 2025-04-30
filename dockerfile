FROM node:20-alpine

RUN apk add --no-cache python3 make g++ 

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npx tsc

EXPOSE 3000

CMD ["node", "dist/server.js"]
