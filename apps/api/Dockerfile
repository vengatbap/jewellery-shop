FROM node:20-alpine AS base

# Install curl for healthcheck
RUN apk add --no-cache curl

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm@8.0.0

FROM base AS dependencies
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.json turbo.json ./
COPY apps/api/package.json ./apps/api/
COPY packages/core/package.json ./packages/core/
COPY packages/config/package.json ./packages/config/
COPY packages/database/package.json ./packages/database/
COPY packages/shared/package.json ./packages/shared/
COPY packages/validation/package.json ./packages/validation/
COPY packages/events/package.json ./packages/events/
COPY packages/workflows/package.json ./packages/workflows/
COPY packages/contracts/package.json ./packages/contracts/
COPY packages/testing/package.json ./packages/testing/
COPY packages/observability/package.json ./packages/observability/

RUN pnpm install --frozen-lockfile

FROM dependencies AS builder
COPY . .
RUN pnpm build --filter=@auric-one/api...

FROM base AS runner
COPY --from=builder /app /app

ENV NODE_ENV=production
ENV API_PORT=3000
ENV API_HOST=0.0.0.0

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/api/v1/health || exit 1

CMD ["pnpm", "--filter=@auric-one/api", "start"]
