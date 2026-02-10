#!/bin/bash

# Упрощенный скрипт для быстрого определения директории домена
# Использование: ./scripts/find-domain-dir.sh

echo "🔍 Быстрая проверка директории для elenafitmagic.ru"
echo ""

read -p "SSH хост: " SSH_HOST
read -p "SSH пользователь: " SSH_USER

echo ""
echo "Подключение..."

ssh $SSH_USER@$SSH_HOST bash << 'ENDSSH'
DOMAIN="elenafitmagic.ru"
HOME_DIR=$(eval echo ~$USER)

echo ""
echo "=== Проверка директорий ==="
echo ""

# Проверяем основные пути
if [ -d "$HOME_DIR/public_html/$DOMAIN" ]; then
    echo "✅ Найдено: $HOME_DIR/public_html/$DOMAIN"
    echo "   Используйте этот путь для деплоя"
    exit 0
fi

if [ -d "$HOME_DIR/www/$DOMAIN" ]; then
    echo "✅ Найдено: $HOME_DIR/www/$DOMAIN"
    echo "   Используйте этот путь для деплоя"
    exit 0
fi

if [ -d "/var/www/$DOMAIN" ]; then
    echo "✅ Найдено: /var/www/$DOMAIN"
    echo "   Используйте этот путь для деплоя"
    exit 0
fi

# Если директории нет, проверяем что есть
echo "⚠️  Директория для $DOMAIN не найдена"
echo ""
echo "Существующие директории в public_html:"
if [ -d "$HOME_DIR/public_html" ]; then
    ls -la "$HOME_DIR/public_html" | grep "^d" | awk '{print "  " $9}'
    echo ""
    echo "💡 Создайте директорию: mkdir -p $HOME_DIR/public_html/$DOMAIN"
    echo "   И используйте: $HOME_DIR/public_html/$DOMAIN"
else
    echo "  public_html не существует"
fi

ENDSSH


