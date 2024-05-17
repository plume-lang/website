FROM oven/bun:slim

WORKDIR /app

COPY . /app

RUN bun install \
    && bun run build

EXPOSE 3000

CMD ["bun", "run", "serve"]