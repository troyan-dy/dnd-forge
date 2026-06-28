# ---- Stage 1: build the Vite app ----
FROM node:22-alpine AS build
WORKDIR /app

# Install deps first for better layer caching.
# .npmrc pins the public npm registry (see README) and is copied along.
COPY package.json package-lock.json* .npmrc* ./
RUN npm install

# Build.
COPY . .
RUN npm run build

# ---- Stage 2: serve the static build with nginx ----
FROM nginx:1.27-alpine AS serve
# SPA-friendly nginx config (single-page fallback).
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
