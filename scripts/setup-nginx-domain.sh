#!/bin/bash

# Скрипт для создания конфигурации Nginx для второго домена
# Использование: запустите на сервере

set -e

DOMAIN="elenafitmagic.ru"
DOMAIN_DIR="/var/www/elenafitmagic.ru"
CONFIG_FILE="/etc/nginx/sites-available/${DOMAIN}"
ENABLED_LINK="/etc/nginx/sites-enabled/${DOMAIN}"

echo "🔧 Настройка Nginx для домена $DOMAIN"
echo ""

# Проверяем существование директории сайта
if [ ! -d "$DOMAIN_DIR" ]; then
    echo "⚠️  Директория $DOMAIN_DIR не существует"
    echo "Создаю директорию..."
    mkdir -p "$DOMAIN_DIR"
    chown -R appuser:appuser "$DOMAIN_DIR"
    chmod 755 "$DOMAIN_DIR"
    echo "✅ Директория создана"
fi

# Читаем конфиг первого сайта как шаблон
FIRST_SITE_CONFIG="/etc/nginx/sites-available/elenaquestionnaire.ru"

if [ ! -f "$FIRST_SITE_CONFIG" ]; then
    echo "❌ Не найден конфиг первого сайта: $FIRST_SITE_CONFIG"
    exit 1
fi

echo "📋 Используем конфиг первого сайта как шаблон"
echo ""

# Создаем конфиг для второго домена
cat > "$CONFIG_FILE" << 'NGINX_CONFIG'
# HTTP конфигурация
# После настройки SSL certbot автоматически добавит редирект на HTTPS

# HTTP конфигурация (временно, до настройки SSL)
# После настройки SSL certbot создаст HTTPS блок автоматически
server {
    listen 80;
    listen [::]:80;
    server_name DOMAIN www.DOMAIN;

    root DOMAIN_DIR;
    index index.html index.htm;

    # Логи
    access_log /var/log/nginx/DOMAIN_access.log;
    error_log /var/log/nginx/DOMAIN_error.log;

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

# Заменяем плейсхолдеры
sed -i "s|DOMAIN|$DOMAIN|g" "$CONFIG_FILE"
sed -i "s|DOMAIN_DIR|$DOMAIN_DIR|g" "$CONFIG_FILE"

echo "✅ Конфиг создан: $CONFIG_FILE"
echo ""

# Создаем симлинк в sites-enabled
if [ -L "$ENABLED_LINK" ]; then
    echo "⚠️  Симлинк уже существует, удаляю старый..."
    rm "$ENABLED_LINK"
fi

ln -s "$CONFIG_FILE" "$ENABLED_LINK"
echo "✅ Симлинк создан: $ENABLED_LINK"
echo ""

# Проверяем конфигурацию Nginx
echo "🔍 Проверка конфигурации Nginx..."
if nginx -t; then
    echo "✅ Конфигурация корректна"
    echo ""
    echo "🔄 Перезагрузка Nginx..."
    systemctl reload nginx
    echo "✅ Nginx перезагружен"
else
    echo "❌ Ошибка в конфигурации Nginx!"
    echo "Проверьте файл: $CONFIG_FILE"
    exit 1
fi

echo ""
echo "✅ Настройка завершена!"
echo ""
echo "📝 Следующие шаги:"
echo "   1. Загрузите файлы сайта в $DOMAIN_DIR"
echo "   2. Настройте SSL: sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN"
echo ""

