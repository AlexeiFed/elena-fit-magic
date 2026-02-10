# Подтверждение владения сайтом в Яндекс.Вебмастер

## Файл загружен на сервер

Файл `yandex_dd70ccf49a2323da.html` загружен в `/var/www/elenafitmagic.ru/`

## Проверка доступности

Файл должен быть доступен по адресу:
- **HTTP:** http://elenafitmagic.ru/yandex_dd70ccf49a2323da.html
- **HTTPS:** https://elenafitmagic.ru/yandex_dd70ccf49a2323da.html

Проверьте в браузере - должна открыться страница с текстом:
```
Verification: dd70ccf49a2323da
```

## Если файл не открывается

1. **Проверьте права доступа:**
   ```bash
   ssh root@<SERVER_IP>
   ls -la /var/www/elenafitmagic.ru/yandex_dd70ccf49a2323da.html
   chmod 644 /var/www/elenafitmagic.ru/yandex_dd70ccf49a2323da.html
   chown appuser:appuser /var/www/elenafitmagic.ru/yandex_dd70ccf49a2323da.html
   ```

2. **Проверьте конфигурацию Nginx:**
   Убедитесь что Nginx может отдавать HTML файлы из корневой директории.

3. **Перезагрузите Nginx:**
   ```bash
   systemctl reload nginx
   ```

## Подтверждение в Яндекс.Вебмастер

1. Откройте https://webmaster.yandex.ru/
2. Перейдите в раздел подтверждения владения сайтом
3. Нажмите "Проверить" или "Подтвердить"
4. Яндекс проверит доступность файла по адресу:
   `https://elenafitmagic.ru/yandex_dd70ccf49a2323da.html`

## После подтверждения

После успешного подтверждения:
1. Добавьте sitemap в Яндекс.Вебмастер:
   - Перейдите в "Индексирование" → "Файлы Sitemap"
   - Добавьте: `https://elenafitmagic.ru/sitemap.xml`
   - Нажмите "Добавить"

2. Запросите переобход страниц:
   - Перейдите в "Индексирование" → "Переобход страниц"
   - Введите: `https://elenafitmagic.ru/`
   - Нажмите "Добавить"

## Альтернатива: Мета-тег

Если файл не работает, можно использовать мета-тег:
1. В Яндекс.Вебмастер выберите способ подтверждения "Мета-тег"
2. Скопируйте мета-тег
3. Добавьте его в `<head>` файла `index.html`
4. Пересоберите и задеплойте проект


