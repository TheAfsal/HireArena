FROM node:22

RUN npm install -g pnpm

WORKDIR /app

COPY package*.json ./

RUN pnpm install 

COPY . .

EXPOSE 5003

EXPOSE 5005

CMD ["npm", "run", "dev"]
