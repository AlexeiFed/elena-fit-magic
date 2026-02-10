# Настройка директории для elenafitmagic.ru

## Найденная структура сервера

```
/var/www/
├── elenaquestionnaire/  (первый сайт, владелец: appuser)
└── html/                 (пустая директория)
```

## Шаг 1: Создание директории для второго домена

Выполните на сервере:

```bash
# Создаем директорию
mkdir -p /var/www/elenafitmagic.ru

# Устанавливаем права как у первого сайта
chown -R appuser:appuser /var/www/elenafitmagic.ru
chmod 755 /var/www/elenafitmagic.ru

# Проверка
ls -la /var/www/ | grep elena
```

Или используйте готовый скрипт:

```bash
# Загрузите скрипт на сервер
scp scripts/create-domain-dir.sh root@<SERVER_IP>:/tmp/

# На сервере
chmod +x /tmp/create-domain-dir.sh
/tmp/create-domain-dir.sh
```

## Шаг 2: Настройка виртуального хоста Nginx

**Используется Nginx** (не Apache). Конфиг первого сайта: `/etc/nginx/sites-available/elenaquestionnaire.ru`

### Автоматическая настройка (рекомендуется):

```bash
# Загрузите скрипт на сервер
scp scripts/setup-nginx-domain.sh root@<SERVER_IP>:/tmp/

# На сервере
chmod +x /tmp/setup-nginx-domain.sh
/tmp/setup-nginx-domain.sh
```

Скрипт автоматически:
- Создаст конфиг для второго домена
- Создаст симлинк в sites-enabled
- Проверит конфигурацию
- Перезагрузит Nginx

### Ручная настройка:

1. Создайте конфиг для второго домена:
```bash
nano /etc/nginx/sites-available/elenafitmagic.ru
```

2. Скопируйте структуру из первого сайта и измените:
```nginx
# HTTP - редирект на HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name elenafitmagic.ru www.elenafitmagic.ru;
    return 301 https://$server_name$request_uri;
}

# HTTPS (SSL настроит certbot)
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name elenafitmagic.ru www.elenafitmagic.ru;

    root /var/www/elenafitmagic.ru;
    index index.html;

    # SSL сертификаты (добавит certbot)
    # ssl_certificate /etc/letsencrypt/live/elenafitmagic.ru/fullchain.pem;
    # ssl_certificate_key /etc/letsencrypt/live/elenafitmagic.ru/privkey.pem;

    access_log /var/log/nginx/elenafitmagic_access.log;
    error_log /var/log/nginx/elenafitmagic_error.log;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

3. Создайте симлинк и перезагрузите:
```bash
ln -s /etc/nginx/sites-available/elenafitmagic.ru /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
```

## Шаг 3: Деплой файлов

После создания директории и настройки Apache:

```bash
npm run deploy
```

Скрипт автоматически использует путь `/var/www/elenafitmagic.ru/`

## Шаг 4: Настройка SSL

После деплоя файлов настройте SSL:

```bash
sudo certbot --nginx -d elenafitmagic.ru -d www.elenafitmagic.ru
```

Certbot автоматически:
- Получит SSL сертификат от Let's Encrypt
- Обновит конфиг Nginx для HTTPS
- Настроит редирект с HTTP на HTTPS

