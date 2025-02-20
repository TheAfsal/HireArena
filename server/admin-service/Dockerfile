FROM node:20.11.0

RUN npm install -g pnpm

WORKDIR /app

COPY package*.json ./

RUN pnpm install 

COPY . .

EXPOSE 5003

CMD ["npm", "run","dev"]
