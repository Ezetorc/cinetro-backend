FROM node:20-alpine AS builder

WORKDIR /

COPY package*.json ./
RUN npm ci

COPY . .

RUN npx prisma generate
RUN npm run build

FROM node:20-alpine

WORKDIR /

COPY --from=builder /package*.json ./
COPY --from=builder /node_modules ./node_modules
COPY --from=builder /dist ./dist
COPY --from=builder /prisma ./prisma

ENV NODE_ENV=production

EXPOSE 3000

CMD ["node", "dist/src/main.js"]
