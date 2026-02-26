# =========================
# 1️⃣ Stage: Build
# =========================
FROM node:20-alpine AS builder

# Crear directorio de trabajo
WORKDIR /app

# Copiar package.json y lockfile primero (mejor cache)
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del proyecto
COPY . .

# Construir proyecto Vite
RUN npm run build


# =========================
# 2️⃣ Stage: Production
# =========================
FROM nginx:stable-alpine

# Eliminar configuración default de nginx
RUN rm -rf /usr/share/nginx/html/*

# Copiar build generado por Vite
COPY --from=builder /app/dist /usr/share/nginx/html

# Copiar configuración personalizada (opcional pero recomendado)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponer puerto
EXPOSE 80

# Iniciar nginx
CMD ["nginx", "-g", "daemon off;"]