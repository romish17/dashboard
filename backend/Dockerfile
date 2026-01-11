FROM node:20-slim

RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ALL dependencies including devDependencies (tsx is needed for dev)
RUN npm install

# Copy prisma schema and generate client
COPY prisma ./prisma/
RUN npx prisma generate

# Copy source code
COPY . .

EXPOSE 3001

# Run prisma db push and start dev server with tsx
CMD ["sh", "-c", "npx prisma db push --accept-data-loss && npm run dev"]
