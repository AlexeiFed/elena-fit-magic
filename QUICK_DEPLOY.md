# Быстрый деплой на elenafitmagic.ru

## ⚠️ Важно: На сервере уже есть сайт elenaquestionnaire.ru

**Структура сервера:**
- Первый сайт: `/var/www/elenaquestionnaire/`
- Второй сайт: `/var/www/elenafitmagic.ru/`

Перед деплоем убедитесь, что:
1. Домен `elenafitmagic.ru` привязан к серверу в панели Timeweb ✅ (уже привязан к Questionnaire)
2. Создана директория на сервере:
   ```bash
   ssh root@<SERVER_IP>
   mkdir -p /var/www/elenafitmagic.ru
   chown -R appuser:appuser /var/www/elenafitmagic.ru
   ```
3. Настроен виртуальный хост Apache (см. `SETUP_DOMAIN.md`)

## 1. Автоматический деплой файлов

```bash
npm install
npm run deploy
```

Введите данные SFTP из панели Timeweb когда скрипт попросит.
**Важно:** Скрипт автоматически предложит путь `/var/www/elenafitmagic.ru/` - используйте его.

## 2. Настройка SSL через SSH

### Подключитесь к серверу:
```bash
ssh ваш_пользователь@ваш_сервер
```

### Загрузите и запустите скрипт:
```bash
# С вашего компьютера (в другом терминале)
scp scripts/setup-ssl.sh ваш_пользователь@ваш_сервер:/tmp/

# На сервере
chmod +x /tmp/setup-ssl.sh
sudo /tmp/setup-ssl.sh
```

Готово! Сайт будет доступен по https://elenafitmagic.ru

## Альтернатива: Ручной деплой

1. `npm run build`
2. Загрузите содержимое `dist/` через FTP/SFTP в `/var/www/elenafitmagic.ru/`
3. Убедитесь, что файл `.htaccess` загружен
4. Для SSL: подключитесь по SSH и выполните `sudo certbot --apache -d elenafitmagic.ru`

