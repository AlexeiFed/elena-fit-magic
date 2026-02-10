# Как найти директорию для второго домена

## Проблема: нет папки public_html

Если `~/public_html/` не существует, выполните на сервере следующие команды:

## 1. Проверка стандартных путей

```bash
# Проверьте /var/www
ls -la /var/www/

# Проверьте конфигурацию Apache
ls -la /etc/apache2/sites-enabled/
# или
ls -la /etc/httpd/conf.d/

# Найдите где настроен первый сайт
grep -r "elenaquestionnaire.ru" /etc/apache2/ 2>/dev/null
# или
grep -r "elenaquestionnaire.ru" /etc/httpd/ 2>/dev/null
```

## 2. Автоматический поиск (загрузите скрипт на сервер)

С вашего компьютера:
```bash
scp scripts/find-timeweb-structure.sh root@<SERVER_IP>:/tmp/
```

На сервере:
```bash
chmod +x /tmp/find-timeweb-structure.sh
/tmp/find-timeweb-structure.sh
```

## 3. Поиск через конфигурацию Apache

```bash
# Просмотр всех виртуальных хостов
apache2ctl -S 2>/dev/null || httpd -S 2>/dev/null

# Или просмотр конфигов напрямую
cat /etc/apache2/sites-enabled/*.conf | grep -A 5 "elenaquestionnaire"
# или
cat /etc/httpd/conf.d/*.conf | grep -A 5 "elenaquestionnaire"
```

## 4. Поиск файлов первого сайта

```bash
# Ищем index файлы
find /var/www -name "index.*" 2>/dev/null
find /home -name "index.*" 2>/dev/null

# Ищем файлы с упоминанием questionnaire
find /var/www -type f -name "*.php" -o -name "*.html" 2>/dev/null | xargs grep -l "questionnaire" 2>/dev/null | head -5
```

## 5. После нахождения директории первого сайта

Когда найдете директорию первого сайта (например, `/var/www/questionnaire/` или `/var/www/html/`):

1. **Создайте директорию для второго домена рядом:**
   ```bash
   mkdir -p /var/www/elenafitmagic.ru
   # или там где находится первый сайт
   ```

2. **Используйте этот путь при деплое:**
   ```bash
   npm run deploy
   # Укажите найденный путь когда скрипт спросит
   ```

## 6. Альтернатива: создайте директорию в стандартном месте

Если не можете найти, создайте в стандартном месте:

```bash
mkdir -p /var/www/elenafitmagic.ru
chown -R www-data:www-data /var/www/elenafitmagic.ru
# или если другой пользователь:
chown -R ваш_пользователь:ваша_группа /var/www/elenafitmagic.ru
```

Затем нужно будет настроить виртуальный хост Apache для этого домена.

