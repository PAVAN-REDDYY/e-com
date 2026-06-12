# syntax=docker/dockerfile:1

# ──────────────────────────────────────────────────────────────────────────────
# frontend — production image
#
# Stage 1 builds the static site with Node; stage 2 serves it with Nginx. The
# final image contains only static assets + Nginx (no Node, no source).
#
# IMPORTANT: Vite inlines VITE_* variables at BUILD time, so the API URLs are
# supplied as build args. For a true build-once/deploy-anywhere image you would
# instead inject runtime config via an entrypoint (documented in frontend/README).
# ──────────────────────────────────────────────────────────────────────────────

############################
# Stage 1 — build
############################
FROM node:20-alpine AS builder

WORKDIR /app

# Install deps first for better layer caching.
COPY package.json package-lock.json ./
RUN npm ci

# Build-time configuration (overridable via --build-arg / docker-compose).
ARG VITE_CATALOG_API_BASE_URL=http://localhost:8001/api
ARG VITE_ORDERS_API_BASE_URL=http://localhost:8002/api
ARG VITE_USE_MOCK_API=false
ARG VITE_STORE_NAME=Fallseed
ARG VITE_STORE_CURRENCY=USD
ARG VITE_STORE_SUPPORT_EMAIL=hello@fallseed.com
ENV VITE_CATALOG_API_BASE_URL=$VITE_CATALOG_API_BASE_URL \
    VITE_ORDERS_API_BASE_URL=$VITE_ORDERS_API_BASE_URL \
    VITE_USE_MOCK_API=$VITE_USE_MOCK_API \
    VITE_STORE_NAME=$VITE_STORE_NAME \
    VITE_STORE_CURRENCY=$VITE_STORE_CURRENCY \
    VITE_STORE_SUPPORT_EMAIL=$VITE_STORE_SUPPORT_EMAIL

COPY . .
RUN npm run build

############################
# Stage 2 — serve
############################
FROM nginx:1.27-alpine AS runtime

# SPA-aware server config (history fallback, gzip, caching, security headers).
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Static assets only.
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD wget -q --spider http://localhost:80/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
