# Builder Stage
FROM node:24-alpine AS builder

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable && corepack prepare pnpm@11.5.0 --activate

WORKDIR /app

# Copy workspace configuration and root package files
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./

# Install dependencies with pnpm
RUN pnpm install --frozen-lockfile

# Copy packages and API source
COPY packages ./packages
COPY apps/api ./apps/api

# Build the API
RUN pnpm --filter api build

# Production Stage
FROM node:24-alpine

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable && corepack prepare pnpm@11.5.0 --activate

WORKDIR /app

# Copy built files and dependencies from builder stage
COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-workspace.yaml ./
COPY --from=builder /app/pnpm-lock.yaml ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/apps/api ./apps/api

EXPOSE 3000

# Start the application
CMD ["pnpm", "--filter", "api", "start"]