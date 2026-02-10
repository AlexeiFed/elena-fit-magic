#!/bin/bash

# Скрипт для настройки SSL через Let's Encrypt (certbot)
# Использование: ./scripts/setup-ssl.sh

set -e

DOMAIN="elenafitmagic.ru"
EMAIL=""  # Ваш email для Let's Encrypt (опционально, но рекомендуется)

echo "🔒 Настройка SSL сертификата для $DOMAIN"
echo ""
echo "Этот скрипт нужно запустить на сервере Timeweb через SSH"
echo ""
read -p "Продолжить? (y/n): " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    exit 1
fi

# Проверка прав root
if [ "$EUID" -ne 0 ]; then 
    echo "⚠️  Запустите скрипт с правами root: sudo ./scripts/setup-ssl.sh"
    exit 1
fi

# Установка certbot если не установлен
if ! command -v certbot &> /dev/null; then
    echo "📦 Установка certbot..."
    
    # Определяем систему и веб-сервер
    if pgrep -x nginx > /dev/null; then
        PLUGIN="python3-certbot-nginx"
    else
        PLUGIN="python3-certbot-apache"
    fi
    
    if [ -f /etc/debian_version ]; then
        apt-get update
        apt-get install -y certbot $PLUGIN
    elif [ -f /etc/redhat-release ]; then
        yum install -y certbot $PLUGIN
    else
        echo "❌ Не удалось определить систему. Установите certbot вручную."
        exit 1
    fi
fi

# Запрос email если не указан
if [ -z "$EMAIL" ]; then
    read -p "Введите email для уведомлений Let's Encrypt: " EMAIL
fi

# Определяем веб-сервер
if pgrep -x nginx > /dev/null; then
    WEBSERVER="nginx"
    CERTBOT_PLUGIN="--nginx"
elif pgrep -x apache2 > /dev/null || pgrep -x httpd > /dev/null; then
    WEBSERVER="apache"
    CERTBOT_PLUGIN="--apache"
else
    echo "⚠️  Веб-сервер не найден, используем standalone режим"
    WEBSERVER="standalone"
    CERTBOT_PLUGIN="--standalone"
fi

# Получение сертификата
echo "🔐 Получение SSL сертификата для $DOMAIN..."
echo "⚠️  На сервере уже есть сайт elenaquestionnaire.ru - это нормально, certbot настроит оба домена"
echo "🌐 Используется веб-сервер: $WEBSERVER"
certbot $CERTBOT_PLUGIN -d $DOMAIN -d www.$DOMAIN --email $EMAIL --agree-tos --non-interactive --redirect

# Настройка автообновления
echo "🔄 Настройка автообновления сертификата..."
(crontab -l 2>/dev/null; echo "0 0,12 * * * certbot renew --quiet") | crontab -

echo ""
echo "✅ SSL сертификат успешно установлен!"
echo "🌐 Проверьте сайт: https://$DOMAIN"
echo ""
echo "📝 Сертификат будет автоматически обновляться каждые 12 часов"

