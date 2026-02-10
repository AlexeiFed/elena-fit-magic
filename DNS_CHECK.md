# Проверка DNS после настройки NS-серверов

## Текущая ситуация

NS-серверы Timeweb настроены в панели:
- ns1.timeweb.ru
- ns2.timeweb.ru
- ns3.timeweb.org
- ns4.timeweb.org

Но DNS еще возвращает NXDOMAIN.

## Что делать

### 1. Убедитесь что изменения сохранены

В панели Timeweb нажмите кнопку **"Сохранить"** (фиолетовая кнопка внизу).

### 2. Проверьте DNS напрямую через NS-серверы Timeweb

```bash
# Проверка через NS-серверы Timeweb напрямую
dig @ns1.timeweb.ru elenafitmagic.ru A
dig @ns2.timeweb.ru elenafitmagic.ru A

# Если там есть записи - значит DNS настроен правильно
# Просто еще не распространился по всему интернету
```

### 3. Время распространения

После сохранения NS-серверов:
- **Минимум:** 15-30 минут
- **Обычно:** 1-3 часа
- **Максимум:** до 24 часов

### 4. Проверка распространения DNS

Используйте онлайн сервисы для проверки по всему миру:
- https://dnschecker.org/#A/elenafitmagic.ru
- https://www.whatsmydns.net/#A/elenafitmagic.ru

Если на некоторых серверах уже работает - значит DNS распространяется.

### 5. Временное решение

Пока DNS распространяется, можно использовать IP напрямую:

```bash
# Добавьте в /etc/hosts на вашем компьютере (macOS/Linux):
sudo nano /etc/hosts

# Добавьте строку:
<SERVER_IP> elenafitmagic.ru www.elenafitmagic.ru
```

После этого сайт будет открываться локально, пока DNS не распространится.

## Проверка через разные DNS серверы

```bash
# Через Google DNS
dig @8.8.8.8 elenafitmagic.ru A

# Через Cloudflare DNS
dig @1.1.1.1 elenafitmagic.ru A

# Через NS-серверы Timeweb напрямую
dig @ns1.timeweb.ru elenafitmagic.ru A
```

Если хотя бы один из них возвращает IP - DNS работает, просто нужно подождать распространения.


