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

# Variables VITE_* que Vite incrusta (inline) en el bundle JS durante "pnpm build".
# Deben existir en process.env EN ESTE MOMENTO: en runtime ya no se leen (app estática nginx).
# Si alguna falta, api.config.ts lanza "VITE_NODE_ENV no está definido" en el navegador.
ENV VITE_NODE_ENV="production"
ENV VITE_BACKEND_URL="https://api.igaproductos.com"
ENV VITE_MERCADO_PAGO_PUBLIC_KEY="APP_USR-b3e85b87-27df-44a0-afed-7efc56b1b05f"
ENV VITE_MERCADO_PAGO_PUBLIC_KEY_TEST="APP_USR-92af1875-20db-414a-8e8c-3d42ec40d998"
ENV VITE_GOOGLE_CLIENT_ID="1091552531175-1favop40fs5ln1g6vetmfi0mrft7igsf.apps.googleusercontent.com"
ENV VITE_RECAPTCHA_SITE_KEY="6Ld8ZXIsAAAAAHd1grrCYoCnxBN---zbHLvo0HhX"
ENV VITE_META_PIXEL_ID="1721620539040805"
ENV VITE_POSTHOG_PROJECT_TOKEN="phc_sGYo2xmMZE58CV6WQULVhnbuaFoGSGuMMneXmod9wM88"
ENV VITE_POSTHOG_HOST="https://us.i.posthog.com"

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