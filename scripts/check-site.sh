#!/bin/bash

# Скрипт для проверки работы сайта на сервере
# Использование: запустите на сервере

DOMAIN="elenafitmagic.ru"
DOMAIN_DIR="/var/www/elenafitmagic.ru"

echo "🔍 Проверка работы сайта $DOMAIN"
echo ""

# Проверка директории
echo "=== Проверка директории ==="
if [ -d "$DOMAIN_DIR" ]; then
    echo "✅ Директория существует: $DOMAIN_DIR"
    echo "   Содержимое:"
    ls -la "$DOMAIN_DIR" | head -15
    echo ""
    
    # Проверка прав
    echo "   Права доступа:"
    ls -ld "$DOMAIN_DIR"
    echo ""
    
    # Проверка index.html
    if [ -f "$DOMAIN_DIR/index.html" ]; then
        echo "✅ index.html найден"
        echo "   Размер: $(du -h $DOMAIN_DIR/index.html | cut -f1)"
        echo "   Права: $(ls -l $DOMAIN_DIR/index.html | awk '{print $1, $3, $4}')"
    else
        echo "❌ index.html НЕ найден!"
    fi
else
    echo "❌ Директория не существует: $DOMAIN_DIR"
fi

echo ""
echo "=== Проверка конфигурации Nginx ==="
if [ -f "/etc/nginx/sites-available/$DOMAIN" ]; then
    echo "✅ Конфиг найден: /etc/nginx/sites-available/$DOMAIN"
    echo "   Содержимое:"
    cat "/etc/nginx/sites-available/$DOMAIN"
else
    echo "❌ Конфиг не найден!"
fi

echo ""
echo "=== Проверка симлинка ==="
if [ -L "/etc/nginx/sites-enabled/$DOMAIN" ]; then
    echo "✅ Симлинк активен: /etc/nginx/sites-enabled/$DOMAIN"
    ls -l "/etc/nginx/sites-enabled/$DOMAIN"
else
    echo "❌ Симлинк не найден!"
fi

echo ""
echo "=== Проверка статуса Nginx ==="
systemctl status nginx --no-pager | head -10

echo ""
echo "=== Проверка логов Nginx ==="
if [ -f "/var/log/nginx/${DOMAIN}_error.log" ]; then
    echo "Последние ошибки:"
    tail -10 "/var/log/nginx/${DOMAIN}_error.log"
else
    echo "Лог ошибок пуст или не создан"
fi

echo ""
echo "=== Тест локального подключения ==="
curl -I http://localhost -H "Host: $DOMAIN" 2>&1 | head -10

echo ""
echo "=== Проверка DNS ==="
echo "A-запись для $DOMAIN:"
dig +short $DOMAIN A

echo ""
echo "💡 Если все проверки пройдены, но сайт не открывается:"
echo "   1. Проверьте права доступа: chown -R appuser:appuser $DOMAIN_DIR"
echo "   2. Проверьте что Nginx может читать файлы: ls -la $DOMAIN_DIR"
echo "   3. Проверьте логи: tail -f /var/log/nginx/${DOMAIN}_error.log"


