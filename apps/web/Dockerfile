FROM node:20-alpine AS base
WORKDIR /app
COPY package.json pnpm-workspace.yaml turbo.json ./
COPY apps/web/package.json apps/web/
COPY packages/ui/package.json packages/ui/
COPY packages/lib/package.json packages/lib/
COPY packages/plugins/package.json packages/plugins/
RUN corepack enable pnpm
RUN pnpm install --frozen-lockfile

FROM base AS build
COPY . .
RUN pnpm --filter @obrato/web build

FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/apps/web/.next ./.next
COPY --from=build /app/apps/web/package.json ./package.json
COPY --from=build /app/node_modules ./node_modules
EXPOSE 3000
CMD ["node", "node_modules/next/dist/bin/next", "start", "--hostname", "0.0.0.0", "--port", "3000"]
