# ---------- Builder ----------
FROM node:22-alpine AS builder

# Activar Corepack
RUN corepack enable

# Fijar versión estable de pnpm
RUN corepack prepare pnpm@10.15.0 --activate

# Directorio de trabajo
WORKDIR /app

# Copiar manifests primero
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./

# Instalar dependencias
RUN pnpm install --frozen-lockfile

# Copiar resto del proyecto
COPY . .

# Build Vite
RUN pnpm build

# ---------- Runner ----------
FROM nginx:stable-alpine

# Limpiar nginx default
RUN rm -rf /usr/share/nginx/html/*

# Copiar build
COPY --from=builder /app/dist /usr/share/nginx/html

# Configuración nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponer puerto
EXPOSE 80

# Iniciar nginx
CMD ["nginx", "-g", "daemon off;"]