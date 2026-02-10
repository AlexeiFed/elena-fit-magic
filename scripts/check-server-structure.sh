#!/bin/bash

# Скрипт для проверки структуры директорий на сервере Timeweb
# Использование: ./scripts/check-server-structure.sh

set -e

echo "🔍 Проверка структуры сервера для определения директории домена"
echo ""
echo "Этот скрипт подключится к серверу и проверит стандартные пути для доменов"
echo ""

read -p "SSH хост (IP или домен сервера): " SSH_HOST
read -p "SSH пользователь: " SSH_USER

echo ""
echo "📡 Подключение к серверу..."

# Подключаемся и проверяем структуру
ssh $SSH_USER@$SSH_HOST << 'EOF'
echo ""
echo "✅ Подключено к серверу"
echo ""
echo "📁 Проверка стандартных путей для доменов:"
echo ""

# Проверяем домашнюю директорию пользователя
HOME_DIR=$(eval echo ~$USER)
echo "Домашняя директория: $HOME_DIR"
echo ""

# Проверяем стандартные пути Timeweb
PATHS=(
    "$HOME_DIR/public_html"
    "$HOME_DIR/www"
    "$HOME_DIR/public_html/elenafitmagic.ru"
    "$HOME_DIR/www/elenafitmagic.ru"
    "/var/www/elenafitmagic.ru"
    "/var/www/html/elenafitmagic.ru"
)

echo "Проверка существующих директорий:"
for path in "${PATHS[@]}"; do
    if [ -d "$path" ]; then
        echo "  ✅ Существует: $path"
        echo "     Содержимое:"
        ls -la "$path" | head -5 | sed 's/^/       /'
        echo ""
    fi
done

echo ""
echo "📋 Проверка конфигурации Apache для домена elenafitmagic.ru:"
if [ -f /etc/apache2/sites-enabled/elenafitmagic.ru.conf ] || [ -f /etc/apache2/sites-available/elenafitmagic.ru.conf ]; then
    echo "  Найден конфиг Apache для elenafitmagic.ru:"
    grep -i "DocumentRoot\|ServerName" /etc/apache2/sites-enabled/elenafitmagic.ru.conf 2>/dev/null || \
    grep -i "DocumentRoot\|ServerName" /etc/apache2/sites-available/elenafitmagic.ru.conf 2>/dev/null | sed 's/^/    /'
elif [ -f /etc/httpd/conf.d/elenafitmagic.ru.conf ] || [ -f /etc/httpd/conf.d/vhost.conf ]; then
    echo "  Найден конфиг Apache для доменов:"
    grep -i "DocumentRoot\|ServerName" /etc/httpd/conf.d/*.conf 2>/dev/null | grep -i elenafitmagic | head -3 | sed 's/^/    /'
else
    echo "  Конфиг не найден в стандартных местах"
fi

echo ""
echo "📋 Проверка конфигурации Nginx (если используется):"
if [ -f /etc/nginx/sites-enabled/elenafitmagic.ru ] || [ -f /etc/nginx/conf.d/elenafitmagic.ru.conf ]; then
    echo "  Найден конфиг Nginx для elenafitmagic.ru:"
    grep -i "root\|server_name" /etc/nginx/sites-enabled/elenafitmagic.ru 2>/dev/null || \
    grep -i "root\|server_name" /etc/nginx/conf.d/elenafitmagic.ru.conf 2>/dev/null | sed 's/^/    /'
fi

echo ""
echo "📋 Список всех директорий в public_html (если существует):"
if [ -d "$HOME_DIR/public_html" ]; then
    echo "  Содержимое $HOME_DIR/public_html:"
    ls -la "$HOME_DIR/public_html" | sed 's/^/    /'
fi

echo ""
echo "📋 Список всех директорий в www (если существует):"
if [ -d "$HOME_DIR/www" ]; then
    echo "  Содержимое $HOME_DIR/www:"
    ls -la "$HOME_DIR/www" | sed 's/^/    /'
fi

echo ""
echo "💡 Рекомендация:"
echo "   Если домен уже привязан к серверу, Timeweb обычно создает директорию:"
echo "   $HOME_DIR/public_html/elenafitmagic.ru/"
echo ""
echo "   Если директории нет, создайте её и используйте для загрузки файлов."
EOF

echo ""
echo "✅ Проверка завершена"
echo ""
echo "💡 Используйте найденную директорию при деплое файлов"


