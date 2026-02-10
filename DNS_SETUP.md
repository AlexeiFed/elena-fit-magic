# Настройка DNS для elenafitmagic.ru

## Проблема

Сайт работает на сервере (локальный тест показывает HTTP 200), но не доступен извне из-за проблем с DNS.

## Решение

### 1. Проверьте A-запись для основного домена

В панели Timeweb: Домены → elenafitmagic.ru → DNS

Убедитесь что есть A-запись:
- **Тип:** A
- **Хост:** elenafitmagic.ru (или @)
- **Значение:** <SERVER_IP>
- **TTL:** 600 (или меньше для быстрого обновления)

### 2. Добавьте A-запись для www поддомена

Если её нет, добавьте:
- **Тип:** A
- **Хост:** www.elenafitmagic.ru (или www)
- **Значение:** <SERVER_IP>
- **TTL:** 600

### 3. Проверка DNS распространения

После добавления/изменения записей:

```bash
# Проверка с вашего компьютера
dig elenafitmagic.ru A
dig www.elenafitmagic.ru A

# Или используйте онлайн сервисы:
# https://dnschecker.org/
# https://www.whatsmydns.net/
```

DNS может распространяться до 24-48 часов, но обычно работает за несколько минут.

### 4. Очистка DNS кеша

Если DNS записи правильные, но сайт не открывается:

**На macOS:**
```bash
sudo dscacheutil -flushcache
sudo killall -HUP mDNSResponder
```

**На Windows:**
```cmd
ipconfig /flushdns
```

**В браузере:**
- Chrome: chrome://net-internals/#dns → Clear host cache
- Или используйте режим инкогнито

### 5. Проверка работы сайта

После настройки DNS проверьте:

```bash
# Проверка доступности
curl -I http://elenafitmagic.ru
curl -I http://www.elenafitmagic.ru

# Проверка с вашего компьютера
ping elenafitmagic.ru
```

## Текущие DNS записи (из скриншота)

У вас уже есть:
- ✅ A-запись для elenafitmagic.ru → <SERVER_IP>
- ✅ TXT запись (SPF)
- ✅ MX записи (почта)

**Возможно нужно добавить:**
- A-запись для www.elenafitmagic.ru → <SERVER_IP>

## Если DNS правильный, но сайт не открывается

1. Проверьте файрвол на сервере:
   ```bash
   sudo ufw status
   sudo iptables -L -n | grep 80
   ```

2. Проверьте что порт 80 открыт:
   ```bash
   netstat -tlnp | grep :80
   ```

3. Проверьте логи Nginx:
   ```bash
   tail -f /var/log/nginx/elenafitmagic_access.log
   tail -f /var/log/nginx/elenafitmagic_error.log
   ```


