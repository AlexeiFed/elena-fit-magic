# Поиск конфигурации веб-сервера

Если стандартные пути не найдены, выполните на сервере:

## Быстрая проверка

```bash
# Проверьте какой веб-сервер запущен
ps aux | grep -E "apache|httpd|nginx" | grep -v grep

# Проверьте все возможные пути Apache
ls -la /etc/apache2/ 2>/dev/null
ls -la /etc/httpd/ 2>/dev/null

# Проверьте Nginx
ls -la /etc/nginx/ 2>/dev/null

# Найдите конфиги с упоминанием первого сайта
grep -r "elenaquestionnaire" /etc/apache2/ 2>/dev/null
grep -r "elenaquestionnaire" /etc/httpd/ 2>/dev/null
grep -r "elenaquestionnaire" /etc/nginx/ 2>/dev/null
```

## Автоматический поиск

Загрузите скрипт на сервер:

```bash
# С вашего компьютера
scp scripts/find-webserver-config.sh root@<SERVER_IP>:/tmp/

# На сервере
chmod +x /tmp/find-webserver-config.sh
/tmp/find-webserver-config.sh
```

## Альтернатива: Timeweb может использовать свою систему

Timeweb может использовать собственную систему управления виртуальными хостами. Проверьте:

```bash
# Проверьте есть ли панель управления
ls -la /usr/local/ispmgr/ 2>/dev/null
ls -la /usr/local/ispsystem/ 2>/dev/null
ls -la /usr/local/vesta/ 2>/dev/null

# Или проверьте через веб-сервер напрямую
apache2ctl -S 2>/dev/null || httpd -S 2>/dev/null
```

## Если веб-сервер не найден

Возможно используется другой подход. Проверьте:

1. **Может быть используется Docker/контейнеры:**
   ```bash
   docker ps
   ```

2. **Может быть используется reverse proxy:**
   ```bash
   netstat -tlnp | grep :80
   netstat -tlnp | grep :443
   ```

3. **Проверьте как работает первый сайт:**
   ```bash
   curl -I http://elenaquestionnaire.ru
   # Посмотрите заголовки ответа
   ```

## После нахождения конфига

Когда найдете где находится конфигурация первого сайта, создайте аналогичный для второго домена `elenafitmagic.ru` с DocumentRoot `/var/www/elenafitmagic.ru`.


