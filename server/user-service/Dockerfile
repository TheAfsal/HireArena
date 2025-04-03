FROM node:22

RUN npm install -g pnpm

WORKDIR /app

COPY package*.json ./

RUN pnpm install 

COPY . .

RUN npx prisma generate

EXPOSE 5000

EXPOSE 5051

CMD ["npm", "run", "dev"]

# # Build Stage
# FROM node:22 AS builder

# RUN corepack enable

# WORKDIR /app

# COPY package*.json ./

# COPY --from=root pnpm*.yaml package*.json /app/
# COPY --from=root /shared /app/shared


# COPY . /app/server/user-service

# RUN pnpm install
# RUN pnpm run --filter=user-service prisma-generate

# RUN pnpm run --filter=user-service build

# RUN pnpm install --prod -f

# # # Runtime Stage
# # FROM node:22-alpine AS run
# # RUN corepack enable 
# # WORKDIR /app
# # COPY --from=builder /app/server/user-service/dist /app/dist/ 
# # COPY --from=builder /app/server/user-service/node_modules /app/node_modules
# # COPY --from=builder /app/server/user-service/package.json /app/package.json

# EXPOSE 5000
# EXPOSE 5051
# CMD ["node", "server/user-service/dist/server.js"]