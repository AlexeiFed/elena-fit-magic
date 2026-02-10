#!/bin/bash

# Скрипт для перезагрузки Nginx после изменений
# Использование: запустите на сервере

echo "🔄 Перезагрузка Nginx..."

# Проверка конфигурации
if nginx -t; then
    echo "✅ Конфигурация корректна"
    echo "🔄 Перезагрузка Nginx..."
    systemctl reload nginx
    echo "✅ Nginx перезагружен"
else
    echo "❌ Ошибка в конфигурации Nginx!"
    exit 1
fi

echo ""
echo "💡 Если изменения все еще не видны:"
echo "   1. Очистите кеш браузера (Ctrl+Shift+R или Cmd+Shift+R)"
echo "   2. Проверьте что файлы загружены в правильную директорию"
echo "   3. Проверьте права доступа: ls -la /var/www/elenafitmagic.ru/"


