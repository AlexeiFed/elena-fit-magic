#!/bin/bash

# Быстрое исправление конфига Nginx - убираем SSL до настройки certbot

CONFIG_FILE="/etc/nginx/sites-available/elenafitmagic.ru"

echo "🔧 Исправление конфига Nginx..."

# Создаем правильный конфиг без SSL
cat > "$CONFIG_FILE" << 'NGINX_CONFIG'
# HTTP конфигурация
# После настройки SSL certbot автоматически добавит HTTPS блок и редирект
server {
    listen 80;
    listen [::]:80;
    server_name elenafitmagic.ru www.elenafitmagic.ru;

    root /var/www/elenafitmagic.ru;
    index index.html index.htm;

    # Логи
    access_log /var/log/nginx/elenafitmagic_access.log;
    error_log /var/log/nginx/elenafitmagic_error.log;

    # Основная конфигурация
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Кеширование статических файлов
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Безопасность
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
NGINX_CONFIG

echo "✅ Конфиг исправлен"

# Проверяем конфигурацию
echo "🔍 Проверка конфигурации..."
if nginx -t; then
    echo "✅ Конфигурация корректна"
    echo "🔄 Перезагрузка Nginx..."
    systemctl reload nginx
    echo "✅ Готово! Теперь можно загружать файлы и настраивать SSL"
else
    echo "❌ Ошибка в конфигурации!"
    exit 1
fi


