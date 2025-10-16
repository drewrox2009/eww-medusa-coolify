FROM node:24 as builder

WORKDIR /app/medusa

COPY . . 

RUN rm -rf node_modules

RUN apt-get update && apt-get install -y python3 python3-pip python-is-python3

RUN yarn install --loglevel=error

RUN yarn run build


FROM node:24

# Bug https://github.com/coollabsio/coolify/issues/1930
ARG COOKIE_SECRET
ARG JWT_SECRET
ARG STORE_CORS
ARG ADMIN_CORS
ARG AUTH_CORS
ARG DISABLE_ADMIN
ARG WORKER_MODE
ARG PORT
ARG DATABASE_URL
ARG REDIS_URL
ARG BACKEND_URL
ARG S3_FILE_URL
ARG S3_ACCESS_KEY_ID
ARG S3_SECRET_ACCESS_KEY
ARG S3_REGION
ARG S3_BUCKET
ARG S3_ENDPOINT
ARG RUN_SEED

ENV COOKIE_SECRET=${COOKIE_SECRET}
ENV JWT_SECRET=${JWT_SECRET}
ENV STORE_CORS=${STORE_CORS}
ENV ADMIN_CORS=${ADMIN_CORS}
ENV AUTH_CORS=${AUTH_CORS}
ENV DISABLE_ADMIN=${DISABLE_ADMIN}
ENV WORKER_MODE=${WORKER_MODE}
ENV PORT=${PORT}
ENV DATABASE_URL=${DATABASE_URL}
ENV REDIS_URL=${REDIS_URL}
ENV BACKEND_URL=${BACKEND_URL}
ENV S3_FILE_URL=${S3_FILE_URL}
ENV S3_ACCESS_KEY_ID=${S3_ACCESS_KEY_ID}
ENV S3_SECRET_ACCESS_KEY=${S3_SECRET_ACCESS_KEY}
ENV S3_REGION=${S3_REGION}
ENV S3_BUCKET=${S3_BUCKET}
ENV S3_ENDPOINT=${S3_ENDPOINT}
ENV RUN_SEED=${RUN_SEED}

RUN echo "${PORT}"

WORKDIR /app/medusa

RUN mkdir .medusa

# COPY package*.json .yarnrc.yml yarn.lock ./ 

# COPY medusa-config.ts .
# COPY tsconfig.json .

RUN apt-get update && apt-get install -y python3 python3-pip python-is-python3

COPY --from=builder /app/medusa/.medusa ./.medusa

WORKDIR /app/medusa/.medusa/server

RUN yarn install --production


# RUN medusa migrations run
COPY migrations.sh /app/medusa/.medusa/server/migrations.sh
RUN chmod +x /app/medusa/.medusa/server/migrations.sh
RUN /app/medusa/.medusa/server/migrations.sh

RUN rm /app/medusa/.medusa/server/migrations.sh

# Run seed script if RUN_SEED environment variable is set to "true"
RUN if [ "$RUN_SEED" = "true" ]; then \
    echo "Running seed script..."; \
    node /app/medusa/.medusa/server/src/scripts/seed.js; \
    echo "Seed script completed."; \
  else \
    echo "RUN_SEED is not set to 'true', skipping seed script."; \
  fi

CMD ["yarn", "run", ,"seed", "start"]