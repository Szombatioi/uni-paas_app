# STAGE 1: Install dependencies
FROM node:20-alpine AS deps
WORKDIR /app

# Point to the actual folder name in your root
COPY fotoalbum_frontend/package*.json ./
RUN npm install

# STAGE 2: Build the app
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules

# Copy from the actual folder name
COPY fotoalbum_frontend/ .

RUN npm run build
# ... rest of your Dockerfile