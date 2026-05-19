# =========================
# 1️⃣ Stage: Builder
# =========================
FROM node:22.22.3-alpine AS builder

# Activar Corepack (pnpm oficial)
RUN corepack enable

# Directorio de trabajo
WORKDIR /app

# Copiar manifests y configuración de pnpm
# (importante para allowBuilds / onlyBuiltDependencies)
COPY package.json ./
COPY pnpm-lock.yaml ./
COPY pnpm-workspace.yaml ./

# Instalar dependencias usando lockfile
RUN pnpm install --frozen-lockfile

# Copiar el resto del proyecto
COPY . .

# Build de Vite
RUN pnpm build


# =========================
# 2️⃣ Stage: Runner
# =========================
FROM nginx:stable-alpine

# Limpiar contenido default de nginx
RUN rm -rf /usr/share/nginx/html/*

# Copiar build generado desde builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Copiar configuración nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponer puerto HTTP
EXPOSE 80

# Iniciar nginx
CMD ["nginx", "-g", "daemon off;"]