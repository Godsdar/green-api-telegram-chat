# --- build stage ---
FROM node:22-alpine AS build
WORKDIR /app

COPY package.json pnpm-lock.yaml* ./
RUN corepack enable && (pnpm install --frozen-lockfile || pnpm install)

COPY . .
RUN pnpm build

# --- serve stage ---
FROM nginx:1.27-alpine AS runtime
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
