# =========================================================
# Stage 1: Dependencies
# =========================================================
ARG NODE_VERSION=26.12.1

FROM node:${NODE_VERSION}-alpine AS deps

ENV CI=true

# Dependencias necesarias para algunos paquetes nativos
RUN apk add --no-cache libc6-compat

RUN npm install --global pnpm@12.15.0

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

RUN npm install --global pnpm@12.15.0

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
RUN echo "=== DIAGNOSTICO DE COMPILACION ===" && \
    echo "VITE_NODE_ENV: '$VITE_NODE_ENV'" && \
    echo "VITE_BACKEND_URL: '$VITE_BACKEND_URL'" && \
    echo "=================================" && \
    pnpm build




# =========================================================
# Stage 3: Runner
# =========================================================
FROM nginx:1.30.4-alpine AS runner

# Instalar curl para healthchecks/debug opcional
# y el módulo brotli para compresión de JS/CSS/HTML
#
# IMPORTANTE: la imagen base fija nginx=1.30.4-r1 y los módulos
# nginx-module-* en el world de apk, pero el repo Alpine (rolling)
# ya solo tiene nginx 1.30.6-r0 y nginx-mod-http-brotli existe SOLO
# construido para 1.30.6-r0 (dependencia exacta). Los módulos con
# nombres viejos ya no están en el repo (Alpine los renombró a
# nginx-mod-*), así que no se pueden actualizar: hay que eliminarlos,
# des-fijar el pin, actualizar nginx y recrear el symlink
# /etc/nginx/modules que el upgrade elimina, ANTES de instalar brotli.
# El módulo se carga solo vía "include /etc/nginx/modules/*.conf"
# del nginx.conf del paquete (no inyectar load_module a mano).
RUN apk del nginx-module-acme nginx-module-geoip nginx-module-image-filter nginx-module-njs nginx-module-xslt && \
    sed -i 's/^nginx=.*/nginx/' /etc/apk/world && \
    apk upgrade --no-cache nginx && \
    mkdir -p /usr/lib/nginx/modules /run/nginx && \
    if [ ! -d /etc/nginx/modules ]; then rm -f /etc/nginx/modules && ln -s /usr/lib/nginx/modules /etc/nginx/modules; fi && \
    apk add --no-cache curl nginx-mod-http-brotli && \
    nginx -t

# Eliminar sitio default
RUN rm -rf /usr/share/nginx/html/*

# Copiar build final
COPY --from=builder /app/dist /usr/share/nginx/html

# Configuración nginx
# Nota: el nginx.conf del paquete incluye los *.conf de http.d
# dentro del bloque http (el include de conf.d queda en contexto
# main, donde "server" no está permitido), así que el server block
# va en http.d.
COPY nginx.conf /etc/nginx/http.d/default.conf

# Cache headers para assets estáticos
RUN mkdir -p /var/cache/nginx

# Permisos correctos
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/run && \
    chown -R nginx:nginx /etc/nginx/http.d

# USER nginx

EXPOSE 80


HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD curl -f http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]