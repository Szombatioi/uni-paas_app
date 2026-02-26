FROM node:20-alpine AS builder
WORKDIR /app

# Copy only the package files for the auth service
COPY fotoalbum_auth/package*.json ./
RUN npm install

# Copy the rest of the auth service files
COPY fotoalbum_auth/ .
RUN npm run build

# Production Stage
FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

EXPOSE 8888
CMD ["npm", "run", "start:prod"]