FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build


FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY --from=builder /app/dist ./dist

COPY --from=builder /app/knexfile.cjs ./knexfile.cjs

COPY --from=builder /app/migrations ./migrations
COPY --from=builder /app/seeds ./seeds

EXPOSE 4000

CMD sh -c "NODE_ENV=production npx knex --knexfile ./knexfile.cjs migrate:latest && NODE_ENV=production npx knex --knexfile ./knexfile.cjs seed:run && node dist/index.js"