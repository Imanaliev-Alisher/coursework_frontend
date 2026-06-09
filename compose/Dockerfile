# Multi-stage build для оптимизации размера образа

# Stage 1: Build
FROM node:18-alpine AS builder

# Установка pnpm
RUN corepack enable && corepack prepare pnpm@9.15.4 --activate

WORKDIR /app

# Копируем файлы зависимостей
COPY package.json pnpm-lock.yaml ./

# Устанавливаем зависимости
RUN pnpm install --frozen-lockfile

# Копируем исходный код
COPY . .

# Сборка приложения
RUN pnpm build

# Stage 2: Production
FROM nginx:alpine

# Генерируем самоподписанный SSL-сертификат
RUN apk add --no-cache openssl && \
    mkdir -p /etc/ssl/private && \
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
        -keyout /etc/ssl/private/nginx-selfsigned.key \
        -out /etc/ssl/certs/nginx-selfsigned.crt \
        -subj "/C=KZ/ST=Almaty/L=Almaty/O=AES/CN=localhost"

# Копируем кастомную конфигурацию nginx
COPY compose/nginx.conf /etc/nginx/conf.d/default.conf

# Копируем собранное приложение из builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Экспонируем порты
EXPOSE 80 443

# Запуск nginx
CMD ["nginx", "-g", "daemon off;"]
