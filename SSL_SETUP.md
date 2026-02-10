# Настройка SSL для elenafitmagic.ru

## Быстрая настройка SSL

Подключитесь к серверу и выполните:

```bash
ssh root@<SERVER_IP>

# Настройка SSL через certbot
sudo certbot --nginx -d elenafitmagic.ru -d www.elenafitmagic.ru
```

Certbot автоматически:
1. Получит SSL сертификат от Let's Encrypt
2. Обновит конфиг Nginx для HTTPS
3. Настроит редирект с HTTP на HTTPS
4. Настроит автообновление сертификата

## Что будет запрошено

1. **Email** - для уведомлений о продлении сертификата
2. **Согласие с условиями** - введите `Y`
3. **Редирект на HTTPS** - выберите `2` (Redirect) для автоматического редиректа

## Проверка после настройки

```bash
# Проверка сертификата
sudo certbot certificates

# Проверка сайта
curl -I https://elenafitmagic.ru

# Проверка редиректа
curl -I http://elenafitmagic.ru
# Должен вернуть 301 редирект на HTTPS
```

## Автоматическое обновление

Certbot автоматически настроит обновление сертификата. Проверьте:

```bash
# Тест автообновления
sudo certbot renew --dry-run

# Проверка cron задачи
sudo crontab -l | grep certbot
```

## Если certbot не установлен

```bash
# Установка certbot для Nginx
sudo apt-get update
sudo apt-get install -y certbot python3-certbot-nginx
```

## Альтернатива: Использовать готовый скрипт

```bash
# Загрузите скрипт на сервер
scp scripts/setup-ssl.sh root@<SERVER_IP>:/tmp/

# На сервере
chmod +x /tmp/setup-ssl.sh
sudo /tmp/setup-ssl.sh
```


