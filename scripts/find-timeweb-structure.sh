#!/bin/bash

# Скрипт для поиска структуры сайтов на сервере Timeweb
# Использование: запустите на сервере или через SSH

echo "🔍 Поиск структуры сайтов на сервере Timeweb"
echo ""

# Проверяем стандартные пути для сайтов
echo "=== Проверка стандартных директорий ==="
PATHS=(
    "/var/www"
    "/var/www/html"
    "/home/*/www"
    "/home/*/public_html"
    "/www"
    "/srv/www"
)

for path_pattern in "${PATHS[@]}"; do
    # Используем find для поиска директорий
    found=$(find $(dirname "$path_pattern") -maxdepth 2 -type d -name "$(basename "$path_pattern")" 2>/dev/null | head -5)
    if [ ! -z "$found" ]; then
        echo "✅ Найдено: $found"
        for dir in $found; do
            echo "   Содержимое:"
            ls -la "$dir" 2>/dev/null | head -10 | sed 's/^/     /'
            echo ""
        done
    fi
done

echo ""
echo "=== Проверка конфигурации Apache ==="
if command -v apache2ctl &> /dev/null || command -v httpd &> /dev/null; then
    # Ищем конфиги виртуальных хостов
    APACHE_CONF_DIRS=(
        "/etc/apache2/sites-enabled"
        "/etc/apache2/sites-available"
        "/etc/httpd/conf.d"
        "/etc/httpd/vhost.d"
    )
    
    for conf_dir in "${APACHE_CONF_DIRS[@]}"; do
        if [ -d "$conf_dir" ]; then
            echo "Проверка: $conf_dir"
            for conf_file in "$conf_dir"/*.conf "$conf_dir"/*; do
                if [ -f "$conf_file" ]; then
                    echo "  Файл: $(basename "$conf_file")"
                    grep -E "ServerName|DocumentRoot|ServerAlias" "$conf_file" 2>/dev/null | grep -i "elena\|questionnaire" | sed 's/^/    /'
                fi
            done
        fi
    done
fi

echo ""
echo "=== Проверка конфигурации Nginx ==="
if command -v nginx &> /dev/null; then
    NGINX_CONF_DIRS=(
        "/etc/nginx/sites-enabled"
        "/etc/nginx/conf.d"
        "/etc/nginx/vhost.d"
    )
    
    for conf_dir in "${NGINX_CONF_DIRS[@]}"; do
        if [ -d "$conf_dir" ]; then
            echo "Проверка: $conf_dir"
            for conf_file in "$conf_dir"/*; do
                if [ -f "$conf_file" ]; then
                    echo "  Файл: $(basename "$conf_file")"
                    grep -E "server_name|root" "$conf_file" 2>/dev/null | grep -i "elena\|questionnaire" | sed 's/^/    /'
                fi
            done
        fi
    done
fi

echo ""
echo "=== Поиск файлов первого сайта (elenaquestionnaire.ru) ==="
# Ищем index.php или index.html в стандартных местах
find /var/www /home /www /srv/www -maxdepth 4 -type f -name "index.*" 2>/dev/null | head -10 | while read file; do
    echo "  Найден: $file"
    # Проверяем содержимое на наличие упоминания questionnaire
    if grep -q -i "questionnaire\|elenaquestionnaire" "$file" 2>/dev/null; then
        echo "    ⭐ Похоже на первый сайт!"
        dir=$(dirname "$file")
        echo "    Директория: $dir"
    fi
done

echo ""
echo "=== Проверка процессов веб-сервера ==="
if pgrep -x apache2 > /dev/null || pgrep -x httpd > /dev/null; then
    echo "✅ Apache запущен"
    # Пытаемся найти DocumentRoot из конфигурации
    if command -v apache2ctl &> /dev/null; then
        apache2ctl -S 2>/dev/null | grep -i "elena\|questionnaire" | head -5
    elif command -v httpd &> /dev/null; then
        httpd -S 2>/dev/null | grep -i "elena\|questionnaire" | head -5
    fi
elif pgrep -x nginx > /dev/null; then
    echo "✅ Nginx запущен"
else
    echo "⚠️  Веб-сервер не найден в процессах"
fi

echo ""
echo "💡 Рекомендации:"
echo "   1. Проверьте вывод выше для найденных путей"
echo "   2. Если нашли директорию первого сайта, создайте рядом директорию для второго:"
echo "      mkdir -p /путь/к/директории/elenafitmagic.ru"
echo "   3. Или используйте стандартный путь Timeweb: /var/www/elenafitmagic.ru"


