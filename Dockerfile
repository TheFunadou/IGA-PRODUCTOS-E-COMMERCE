# =========================
# 1️⃣ Stage: Build
# =========================
FROM node:23.11.1-alpine AS builder

# Activar Corepack (pnpm)
RUN corepack enable

# Directorio de trabajo
WORKDIR /app

# Copiar manifests primero (mejor cache)
COPY package.json pnpm-lock.yaml ./

# Instalar dependencias
RUN pnpm install --frozen-lockfile

# Copiar resto del proyecto
COPY . .

# Construir proyecto Vite
RUN pnpm build


# =========================
# 2️⃣ Stage: Production
# =========================
FROM nginx:stable-alpine

# Eliminar archivos default
RUN rm -rf /usr/share/nginx/html/*

# Copiar build generado
COPY --from=builder /app/dist /usr/share/nginx/html

# Copiar configuración nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponer puerto
EXPOSE 80

# Iniciar nginx
CMD ["nginx", "-g", "daemon off;"]