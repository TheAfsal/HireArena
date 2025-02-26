FROM node:20.11.0

RUN npm install -g pnpm

WORKDIR /app

COPY package*.json ./

RUN pnpm install 

COPY . .

RUN npx prisma generate

EXPOSE 5000 

EXPOSE 5051 

CMD ["npm", "run","dev"]
