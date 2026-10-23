ARG NODE_VERSION=22.23.4

FROM node:${NODE_VERSION}-alpine AS deps
ENV CI=true

RUN apk add --no-cache libc6-compat

RUN corepack enable && \
    corepack prepare pnpm@10.15.0 --activate

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile


FROM node:${NODE_VERSION}-alpine AS builder

ENV CI=true
# Limita el heap de Node para evitar que Vite/Rollup rebase la RAM del host
# (VPS de 4GB sin swap suficiente provoca OOM kills durante "transforming...")
ENV NODE_OPTIONS=--max-old-space-size=3072

RUN apk add --no-cache libc6-compat

RUN corepack enable && \
    corepack prepare pnpm@10.15.0 --activate

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/package.json ./package.json
COPY . .

RUN pnpm build


FROM nginx:stable-alpine AS runner

RUN rm -rf /usr/share/nginx/html/*

COPY --from=builder /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]