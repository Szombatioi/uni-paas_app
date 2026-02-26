FROM node:20-alpine AS builder
WORKDIR /app

# Copy only the package files for the server service
COPY fotoalbum_server/package*.json ./
RUN npm install

# Copy the rest of the server service files
COPY fotoalbum_server/ .
RUN npm run build

# Production Stage
FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

EXPOSE 3001
CMD ["npm", "run", "start:prod"]