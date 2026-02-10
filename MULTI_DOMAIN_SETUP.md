# Настройка второго домена на существующем сервере

## Ваша ситуация

- **Сервер:** Questionnaire (1 CPU, 1 ГБ RAM, 15 ГБ NVMe)
- **Домен 1:** elenaquestionnaire.ru (уже работает, есть БД)
- **Домен 2:** elenafitmagic.ru (нужно настроить)

## Шаг 1: Привязка домена к серверу в Timeweb

1. Войдите в панель Timeweb
2. Домены → `elenafitmagic.ru` → Настройки
3. Найдите опцию "Привязать к серверу" или "Сервер"
4. Выберите сервер "Questionnaire"
5. Сохраните изменения

Timeweb автоматически создаст директорию для второго домена (обычно `public_html/elenafitmagic.ru/`).

## Шаг 2: Определение директории сайта

## Шаг 2: Создание директории для второго домена

**Найдена структура сервера:**
- Первый сайт: `/var/www/elenaquestionnaire/` (владелец: appuser)
- Второй сайт будет: `/var/www/elenafitmagic.ru/`

### Создание директории на сервере:

```bash
ssh root@<SERVER_IP>

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
scp scripts/create-domain-dir.sh root@<SERVER_IP>:/tmp/
ssh root@<SERVER_IP> "chmod +x /tmp/create-domain-dir.sh && /tmp/create-domain-dir.sh"
```

**Подробная инструкция:** см. файл `SETUP_DOMAIN.md`

## Шаг 3: Деплой файлов

### Автоматически:
```bash
npm run deploy
```

Когда скрипт спросит директорию, укажите путь из шага 2 (НЕ `public_html/` напрямую!)

### Вручную:
1. `npm run build`
2. Через FTP/SFTP загрузите содержимое `dist/` в директорию из шага 2
3. Убедитесь, что `.htaccess` загружен

## Шаг 4: Настройка SSL

Подключитесь к серверу по SSH и выполните:

```bash
sudo certbot --apache -d elenafitmagic.ru -d www.elenafitmagic.ru
```

Certbot автоматически:
- Настроит виртуальный хост для второго домена
- Получит SSL сертификат
- Настроит редирект на HTTPS

**Важно:** Это не затронет первый сайт - certbot настроит оба домена корректно.

## Проверка

1. Откройте `http://elenafitmagic.ru` - должен открыться сайт
2. После настройки SSL: `https://elenafitmagic.ru` - должен работать HTTPS
3. Проверьте первый сайт: `https://elenaquestionnaire.ru` - должен работать как раньше

## Структура на сервере

После настройки структура будет примерно такой:

```
/home/username/
├── public_html/                    # или www/
│   ├── (файлы elenaquestionnaire.ru)
│   └── elenafitmagic.ru/          # директория второго домена
│       ├── index.html
│       ├── .htaccess
│       └── assets/
```

Оба сайта работают независимо друг от друга на одном сервере.

