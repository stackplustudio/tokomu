# =============================================================================
# Stage 1: Build & Prune
# =============================================================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copy monorepo configuration
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json ./apps/api/
COPY apps/web/package.json ./apps/web/
COPY packages ./packages

# Install pnpm and dependencies
RUN npm install -g pnpm@9.0.0
RUN pnpm install --frozen-lockfile

# Copy API source code
COPY apps/api ./apps/api

# Generate Prisma Client & Build API
WORKDIR /app/packages/database
RUN pnpm prisma generate

WORKDIR /app/apps/api
RUN pnpm build

# =============================================================================
# Stage 2: Production Runtime (Least Privilege & Hardened)
# =============================================================================
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3001

# Copy build artifacts and dependencies from builder
COPY --from=builder --chown=node:node /app/apps/api/dist ./dist
COPY --from=builder --chown=node:node /app/apps/api/node_modules ./node_modules
COPY --from=builder --chown=node:node /app/apps/api/package.json ./

# Security: Run as unprivileged node user
USER node

# Health check configuration (M-4 fix)
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3001/health || exit 1

EXPOSE 3001
CMD ["node", "dist/main"]
