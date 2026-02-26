# STAGE 1: Install dependencies
FROM node:20-alpine AS deps
WORKDIR /app

# Change this line to point to the subfolder
COPY apps/fotoalbum_frontend/package*.json ./

RUN npm install

# STAGE 2: Build the app
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
# Copy all files from the frontend folder
COPY apps/fotoalbum_frontend/ .

RUN npm run build