ARG NODE_VERSION=22.23.4

FROM node:${NODE_VERSION}-alpine AS deps
ENV CI=true

RUN apk add --no-cache libc6-compat

RUN corepack enable && \
    corepack prepare pnpm@10.15.0 --activate

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile


FROM node:${NODE_VERSION}-alpine AS builder

ENV CI=true

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