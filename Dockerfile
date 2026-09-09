# Multi-stage build for Astro static site
# Stage 1: Build
FROM node:22-alpine AS build

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source files
COPY . .

# Build-time environment variables for Astro
ARG PUBLIC_POCKETBASE_URL
ARG PUBLIC_POSTHOG_HOST
ARG PUBLIC_POSTHOG_KEY
ENV PUBLIC_POCKETBASE_URL=$PUBLIC_POCKETBASE_URL
ENV PUBLIC_POSTHOG_HOST=$PUBLIC_POSTHOG_HOST
ENV PUBLIC_POSTHOG_KEY=$PUBLIC_POSTHOG_KEY

# Build Astro site into static output
RUN npm run build

# Stage 2: Production runtime with Nginx
FROM nginx:alpine

# Copy static assets from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
