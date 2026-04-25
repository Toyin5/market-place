FROM node:20-bookworm-slim

WORKDIR /app

RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

RUN chmod +x docker-entrypoint.sh && npm run build

ENV NODE_ENV=production \
    PORT=10000

EXPOSE 10000

CMD ["./docker-entrypoint.sh"]
