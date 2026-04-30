# Stage 1: Build
FROM node:20-slim AS build

# Install build dependencies for better-sqlite3
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /src

# Install dependencies
COPY package*.json ./
RUN npm install

# Build the app
COPY . .
RUN npm run build

# Stage 2: Production
FROM node:20-slim

WORKDIR /app

# Install production dependencies for better-sqlite3 (native bindings)
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Copy build output
COPY --from=build /src/.output ./.output
COPY --from=build /src/package*.json ./

# Install only production dependencies
RUN npm install --omit=dev

# Environment variables
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3222

# Expose the app port
EXPOSE 3222

# Start the server
CMD ["node", ".output/server/index.mjs"]
