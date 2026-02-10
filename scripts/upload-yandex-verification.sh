#!/bin/bash

# Скрипт для загрузки файла подтверждения Яндекс
# Использование: ./scripts/upload-yandex-verification.sh

VERIFICATION_FILE="yandex_dd70ccf49a2323da.html"
SERVER="root@$DEPLOY_HOST"
REMOTE_DIR="/var/www/elenafitmagic.ru"

if [ ! -f "$VERIFICATION_FILE" ]; then
    echo "❌ Файл $VERIFICATION_FILE не найден в текущей директории"
    echo "💡 Убедитесь что файл находится в корне проекта"
    exit 1
fi

echo "📤 Загрузка файла подтверждения Яндекс на сервер..."
scp "$VERIFICATION_FILE" "$SERVER:$REMOTE_DIR/"

if [ $? -eq 0 ]; then
    echo "✅ Файл успешно загружен!"
    echo ""
    echo "🔍 Проверка доступности файла..."
    ssh "$SERVER" "curl -I http://localhost/yandex_dd70ccf49a2323da.html -H 'Host: elenafitmagic.ru' 2>/dev/null | head -3"
    echo ""
    echo "✅ Файл должен быть доступен по адресу:"
    echo "   https://elenafitmagic.ru/yandex_dd70ccf49a2323da.html"
    echo ""
    echo "📝 Теперь вернитесь в Яндекс.Вебмастер и подтвердите владение сайтом"
else
    echo "❌ Ошибка при загрузке файла"
    exit 1
fi


