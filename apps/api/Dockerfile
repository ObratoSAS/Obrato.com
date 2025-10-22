FROM node:20-alpine AS base
WORKDIR /app
COPY package.json pnpm-workspace.yaml turbo.json ./
COPY apps/api/package.json apps/api/
COPY packages/lib/package.json packages/lib/
COPY packages/ui/package.json packages/ui/
COPY packages/plugins/package.json packages/plugins/
RUN corepack enable pnpm
RUN pnpm install --frozen-lockfile

FROM base AS build
COPY . .
RUN pnpm --filter @obrato/api build

FROM node:20-alpine AS runtime
WORKDIR /app
COPY --from=build /app/apps/api/dist ./dist
COPY --from=build /app/apps/api/package.json ./package.json
COPY --from=build /app/node_modules ./node_modules
ENV NODE_ENV=production
CMD ["node", "dist/main.js"]
