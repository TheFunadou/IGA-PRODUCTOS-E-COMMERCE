# =========================================================
# Stage 1: Dependencies
# =========================================================
ARG NODE_VERSION=22.16.0

FROM node:${NODE_VERSION}-alpine AS deps

ENV CI=true

# Dependencias necesarias para algunos paquetes nativos
RUN apk add --no-cache libc6-compat

# Activar Corepack + fijar pnpm
RUN corepack enable && \
    corepack prepare pnpm@10.15.0 --activate

WORKDIR /app

# Copiar manifests primero para maximizar cache
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./

# Instalar dependencias
RUN pnpm install --frozen-lockfile


# =========================================================
# Stage 2: Builder
# =========================================================
FROM node:${NODE_VERSION}-alpine AS builder

ENV CI=true

RUN apk add --no-cache libc6-compat

RUN corepack enable && \
    corepack prepare pnpm@10.15.0 --activate

WORKDIR /app

# Reutilizar node_modules cacheado
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/package.json ./package.json
COPY --from=deps /app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=deps /app/pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY --from=deps /app/.npmrc ./.npmrc

# Copiar proyecto
COPY . .

# =========================================================
# VITE BUILD ARGS
# IMPORTANTE:
# Estas variables existen SOLO en build time
# =========================================================
ARG VITE_NODE_ENV=production
ARG VITE_API_URL
ARG VITE_BACKEND_URL
ARG VITE_MERCADO_PAGO_PUBLIC_KEY
ARG VITE_MERCADO_PAGO_PUBLIC_KEY_TEST
ARG VITE_RECAPTCHA_SITE_KEY
ARG VITE_GOOGLE_CLIENT_ID

ENV VITE_NODE_ENV=$VITE_NODE_ENV
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_BACKEND_URL=$VITE_BACKEND_URL
ENV VITE_MERCADO_PAGO_PUBLIC_KEY=$VITE_MERCADO_PAGO_PUBLIC_KEY
ENV VITE_MERCADO_PAGO_PUBLIC_KEY_TEST=$VITE_MERCADO_PAGO_PUBLIC_KEY_TEST
ENV VITE_RECAPTCHA_SITE_KEY=$VITE_RECAPTCHA_SITE_KEY
ENV VITE_GOOGLE_CLIENT_ID=$VITE_GOOGLE_CLIENT_ID

# Build producción
RUN pnpm build



# =========================================================
# Stage 3: Runner
# =========================================================
FROM nginx:stable-alpine AS runner

# Instalar curl para healthchecks/debug opcional
RUN apk add --no-cache curl

# Eliminar sitio default
RUN rm -rf /usr/share/nginx/html/*

# Copiar build final
COPY --from=builder /app/dist /usr/share/nginx/html

# Configuración nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Cache headers para assets estáticos
RUN mkdir -p /var/cache/nginx

# Permisos correctos
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/run && \
    chown -R nginx:nginx /etc/nginx/conf.d

USER nginx

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD curl -f http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]