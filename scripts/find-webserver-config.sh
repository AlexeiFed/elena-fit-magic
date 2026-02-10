#!/bin/bash

# Скрипт для поиска конфигурации веб-сервера
# Использование: запустите на сервере

echo "🔍 Поиск конфигурации веб-сервера"
echo ""

# Проверяем какой веб-сервер запущен
echo "=== Проверка запущенных веб-серверов ==="
if pgrep -x apache2 > /dev/null; then
    echo "✅ Apache2 запущен"
    APACHE_TYPE="apache2"
elif pgrep -x httpd > /dev/null; then
    echo "✅ httpd (Apache) запущен"
    APACHE_TYPE="httpd"
elif pgrep -x nginx > /dev/null; then
    echo "✅ Nginx запущен"
    NGINX_RUNNING=true
else
    echo "⚠️  Веб-сервер не найден в процессах"
fi

echo ""
echo "=== Поиск конфигурационных файлов Apache ==="
APACHE_CONF_PATHS=(
    "/etc/apache2"
    "/etc/httpd"
    "/usr/local/apache2"
    "/opt/apache2"
)

for apache_path in "${APACHE_CONF_PATHS[@]}"; do
    if [ -d "$apache_path" ]; then
        echo "✅ Найдено: $apache_path"
        echo "   Содержимое:"
        ls -la "$apache_path" | head -10 | sed 's/^/     /'
        echo ""
        
        # Проверяем sites-enabled/sites-available
        if [ -d "$apache_path/sites-enabled" ]; then
            echo "   sites-enabled:"
            ls -la "$apache_path/sites-enabled" | sed 's/^/     /'
        fi
        if [ -d "$apache_path/sites-available" ]; then
            echo "   sites-available:"
            ls -la "$apache_path/sites-available" | sed 's/^/     /'
        fi
        if [ -d "$apache_path/conf.d" ]; then
            echo "   conf.d:"
            ls -la "$apache_path/conf.d" | sed 's/^/     /'
        fi
        echo ""
    fi
done

echo ""
echo "=== Поиск конфигурационных файлов Nginx ==="
NGINX_CONF_PATHS=(
    "/etc/nginx"
    "/usr/local/nginx"
    "/opt/nginx"
)

for nginx_path in "${NGINX_CONF_PATHS[@]}"; do
    if [ -d "$nginx_path" ]; then
        echo "✅ Найдено: $nginx_path"
        echo "   Содержимое:"
        ls -la "$nginx_path" | head -10 | sed 's/^/     /'
        echo ""
        
        if [ -d "$nginx_path/sites-enabled" ]; then
            echo "   sites-enabled:"
            ls -la "$nginx_path/sites-enabled" | sed 's/^/     /'
        fi
        if [ -d "$nginx_path/conf.d" ]; then
            echo "   conf.d:"
            ls -la "$nginx_path/conf.d" | sed 's/^/     /'
        fi
        echo ""
    fi
done

echo ""
echo "=== Поиск конфигов с упоминанием elenaquestionnaire ==="
echo "Ищем в стандартных местах:"
find /etc -type f -name "*.conf" 2>/dev/null | xargs grep -l "elenaquestionnaire" 2>/dev/null | head -10

echo ""
echo "=== Проверка главного конфига Apache ==="
if [ -f /etc/apache2/apache2.conf ]; then
    echo "Главный конфиг: /etc/apache2/apache2.conf"
    echo "Проверяем Include директивы:"
    grep -i "^Include" /etc/apache2/apache2.conf | sed 's/^/  /'
elif [ -f /etc/httpd/conf/httpd.conf ]; then
    echo "Главный конфиг: /etc/httpd/conf/httpd.conf"
    echo "Проверяем Include директивы:"
    grep -i "^Include" /etc/httpd/conf/httpd.conf | sed 's/^/  /'
fi

echo ""
echo "=== Проверка через команду веб-сервера ==="
if command -v apache2ctl &> /dev/null; then
    echo "Apache2ctl доступен, проверяем виртуальные хосты:"
    apache2ctl -S 2>&1 | head -20
elif command -v httpd &> /dev/null; then
    echo "httpd доступен, проверяем виртуальные хосты:"
    httpd -S 2>&1 | head -20
fi

if command -v nginx &> /dev/null; then
    echo ""
    echo "Nginx доступен, проверяем конфигурацию:"
    nginx -T 2>&1 | grep -A 10 "server_name\|root" | head -30
fi

echo ""
echo "=== Проверка процессов ==="
ps aux | grep -E "apache|httpd|nginx" | grep -v grep | head -5

