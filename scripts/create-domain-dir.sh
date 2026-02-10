#!/bin/bash

# Скрипт для создания директории второго домена на сервере
# Использование: запустите на сервере

DOMAIN_DIR="/var/www/elenafitmagic.ru"
OWNER_USER="appuser"
OWNER_GROUP="appuser"

echo "📁 Создание директории для elenafitmagic.ru"
echo ""

# Создаем директорию
mkdir -p "$DOMAIN_DIR"

# Устанавливаем права как у первого сайта
chown -R $OWNER_USER:$OWNER_GROUP "$DOMAIN_DIR"
chmod 755 "$DOMAIN_DIR"

echo "✅ Директория создана: $DOMAIN_DIR"
echo "   Владелец: $OWNER_USER:$OWNER_GROUP"
echo ""
echo "📋 Проверка:"
ls -la /var/www/ | grep elena

echo ""
echo "💡 Теперь можно загружать файлы в эту директорию"


