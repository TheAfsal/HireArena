FROM node:22

RUN npm install -g pnpm

WORKDIR /app

COPY package*.json ./

RUN pnpm install 

COPY . .

RUN npx prisma generate

EXPOSE 5002

EXPOSE 5015

CMD ["npm", "run","dev"]
