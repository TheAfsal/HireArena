# FROM node:22-alpine

# WORKDIR /app

# RUN corepack enable

# COPY package*.json ./

# COPY pnpm*.yaml ./

# COPY ./server/chat-service/package.json /app/server/chat-service/package.json 

# COPY ./shared/ /app/shared

# RUN pnpm install

FROM node:22

RUN npm install -g pnpm

WORKDIR /app

COPY package*.json ./

RUN pnpm install 

COPY . .

EXPOSE 5009

EXPOSE 5010

CMD ["npm", "run", "dev"]


# FROM node:22-alpine AS build

# WORKDIR /app

# RUN mkdir build

# EXPOSE 5009


# FROM node:22 AS runtime

# WORKDIR /app

# RUN mkdir run

# CMD ["npm", "run", "start"]
