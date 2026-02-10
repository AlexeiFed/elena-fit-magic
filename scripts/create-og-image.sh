#!/bin/bash

# Скрипт для создания OG изображения из существующего
# Требует ImageMagick: brew install imagemagick (macOS)

set -e

SOURCE_IMAGE="src/assets/elena-hero.jpg"
OUTPUT_IMAGE="public/og-image.jpg"
WIDTH=1200
HEIGHT=630

echo "🖼️  Создание Open Graph изображения"
echo ""

if [ ! -f "$SOURCE_IMAGE" ]; then
    echo "❌ Исходное изображение не найдено: $SOURCE_IMAGE"
    echo "💡 Используйте одно из:"
    ls -la src/assets/*.jpg src/assets/*.png 2>/dev/null || echo "   Нет изображений в src/assets/"
    exit 1
fi

# Проверяем наличие ImageMagick
if ! command -v convert &> /dev/null; then
    echo "⚠️  ImageMagick не установлен"
    echo ""
    echo "Установите ImageMagick:"
    echo "  macOS: brew install imagemagick"
    echo "  Ubuntu: sudo apt-get install imagemagick"
    echo ""
    echo "Или создайте изображение вручную:"
    echo "  1. Откройте $SOURCE_IMAGE в редакторе"
    echo "  2. Измените размер до ${WIDTH}x${HEIGHT}px"
    echo "  3. Сохраните как $OUTPUT_IMAGE"
    exit 1
fi

echo "📐 Изменение размера изображения до ${WIDTH}x${HEIGHT}px..."
convert "$SOURCE_IMAGE" \
    -resize "${WIDTH}x${HEIGHT}^" \
    -gravity center \
    -extent "${WIDTH}x${HEIGHT}" \
    -quality 85 \
    "$OUTPUT_IMAGE"

if [ -f "$OUTPUT_IMAGE" ]; then
    SIZE=$(du -h "$OUTPUT_IMAGE" | cut -f1)
    DIMENSIONS=$(identify -format "%wx%h" "$OUTPUT_IMAGE")
    echo "✅ Изображение создано: $OUTPUT_IMAGE"
    echo "   Размер файла: $SIZE"
    echo "   Размеры: $DIMENSIONS"
    echo ""
    echo "📝 Следующие шаги:"
    echo "   1. npm run build"
    echo "   2. scp public/og-image.jpg root@$DEPLOY_HOST:/var/www/elenafitmagic.ru/"
else
    echo "❌ Ошибка при создании изображения"
    exit 1
fi


