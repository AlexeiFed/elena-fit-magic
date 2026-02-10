# Админ-панель для elenafitmagic.ru — План реализации

> Дата создания: 09.02.2026
> Цель: дать заказчику (Елене) возможность самостоятельно редактировать контент лендинга через браузер без привлечения разработчика.

---

## 1. Общая архитектура

### Подход: JSON-файлы на сервере + PHP API + React-админка

```
┌─────────────────────────────────────────────────────────┐
│  Браузер (публичный сайт)                               │
│  React → fetch GET /api/admin-data.php?type=...         │
│  Данные кешируются через @tanstack/react-query           │
│  Fallback: хардкод из i18n (если API недоступен)        │
└──────────────────────┬──────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────┐
│  Сервер Timeweb (Apache + PHP)                          │
│                                                          │
│  /api/admin-auth.php    — авторизация (session + пароль)│
│  /api/admin-data.php    — CRUD чтение/запись JSON       │
│  /api/admin-upload.php  — загрузка изображений          │
│                                                          │
│  /api/data/                                              │
│    ├── testimonials.json   — отзывы (текстовые)         │
│    ├── screenshots.json    — скриншоты переписок        │
│    ├── services.json       — услуги + детали + цены     │
│    └── site-content.json   — тексты секций + настройки  │
│                                                          │
│  /uploads/screenshots/     — загруженные изображения    │
└─────────────────────────────────────────────────────────┘
```

### Почему этот подход

- **Работает на текущем хостинге** (Timeweb, Apache + PHP) — без внешних сервисов
- **Мгновенные изменения** — без ребилда, данные загружаются при каждом визите
- **Минимум зависимостей** — только PHP + файловая система
- **Безопасно** — авторизация через PHP session, пароль хранится как bcrypt-хеш

---

## 2. Что будет редактируемым

### 2.1. Секция «Отзывы» (Testimonials) — **приоритет**

Секция содержит **2 независимых блока**, каждый из которых можно включить/отключить:

| Блок | Описание | Управление |
|------|----------|------------|
| **Блок 1: Текстовые отзывы** | Карусель с именем, цитатой, результатом | CRUD + toggle вкл/выкл |
| **Блок 2: Скриншоты переписок** | Masonry-галерея скриншотов из мессенджеров | Загрузка изображений + подписи + toggle вкл/выкл |

**Важно**: текстовые отзывы (Блок 1) **НЕ переводятся** через i18n. Отзывы хранятся в JSON как есть (на русском), без дублирования на английский. Это логично — отзывы реальных людей не нужно переводить.

#### Структура `testimonials.json`
```json
{
  "textReviewsEnabled": true,
  "screenshotsEnabled": true,
  "items": [
    {
      "id": "t1",
      "name": "Анна М.",
      "quote": "За 3 месяца я полностью изменила...",
      "result": "−8 кг за 3 месяца",
      "order": 0
    }
  ]
}
```

#### Структура `screenshots.json`
```json
{
  "items": [
    {
      "id": "s1",
      "src": "/uploads/screenshots/chat-1.jpg",
      "caption": "Результат за 2 месяца",
      "order": 0
    }
  ]
}
```

### 2.2. Секция «Услуги» (Services)

Редактирование:
- Название, подзаголовок, список фич для каждой услуги
- Детальная информация (секции, пункты, цены, доп. услуги)
- Порядок отображения
- Какая услуга отмечена как «Популярное» (featured)

#### Структура `services.json`
```json
{
  "featuredId": "ПРЕМИУМ",
  "categories": [
    {
      "id": "training",
      "title": { "ru": "Тренировки + питание", "en": "Training + Nutrition" },
      "services": [
        {
          "id": "ПРЕМИУМ",
          "title": { "ru": "ПРЕМИУМ", "en": "PREMIUM" },
          "subtitle": { "ru": "Личная работа со мной", "en": "Personal work with me" },
          "features": [
            { "ru": "Личное сопровождение со мной", "en": "Personal guidance with me" }
          ],
          "details": {
            "title": { "ru": "\"ПРЕМИУМ\"", "en": "\"PREMIUM\"" },
            "subtitle": { "ru": "(максимум результата)", "en": "(maximum results)" },
            "sections": [...],
            "pricing": {...},
            "extras": [...]
          },
          "order": 0
        }
      ]
    }
  ]
}
```

### 2.3. Тексты секций (site-content.json)

Редактирование заголовков, подзаголовков, описаний для:
- **Hero**: title, titleHighlight, subtitle
- **About**: title, titleHighlight, subtitle, description1-3, regalia, features
- **Process**: title, subtitle, шаги (title + description)
- **CTA**: title, titleHighlight, subtitle
- **Контактные ссылки**: Telegram URL, Max URL
- **Статистика Hero**: количество клиентов, процент успеха

#### Структура `site-content.json`
```json
{
  "hero": {
    "title": { "ru": "Персональный фитнес с", "en": "Personal Fitness with" },
    "titleHighlight": { "ru": "Еленой Пильщиковой", "en": "Elena Pilshchikova" },
    "subtitle": { "ru": "Комплексное сопровождение...", "en": "Comprehensive support..." },
    "stats": {
      "clients": "300+",
      "successRate": "98%"
    }
  },
  "about": {
    "title": { "ru": "Меня зовут", "en": "My name is" },
    "descriptions": [
      { "ru": "Я — ваш персональный...", "en": "I am your personal..." }
    ],
    "regalia": [
      { "ru": "Чемпионка Дальнего Востока...", "en": "Far East Champion..." }
    ],
    "features": [
      {
        "icon": "Heart",
        "text": { "ru": "Здоровье", "en": "Health" },
        "description": { "ru": "Комплексный подход...", "en": "Comprehensive approach..." }
      }
    ]
  },
  "process": {
    "steps": [
      {
        "title": { "ru": "Заявка", "en": "Application" },
        "description": { "ru": "Напишите мне...", "en": "Write to me..." }
      }
    ]
  },
  "cta": {
    "title": { "ru": "Готовы изменить", "en": "Ready to change" },
    "titleHighlight": { "ru": "свой образ жизни?", "en": "your lifestyle?" },
    "subtitle": { "ru": "Напишите мне...", "en": "Write to me..." },
    "telegramUrl": "https://t.me/Elena_fitmentor",
    "maxUrl": "https://max.ru/u/..."
  },
  "contacts": {
    "telegramUrl": "https://t.me/Elena_fitmentor",
    "maxUrl": "https://max.ru/u/f9LHodD0cOJ_T7iKN2Kw7zp58r7mbJF6Sxnhw0mBrfPbUgYA5AfZYCRnxgE"
  }
}
```

---

## 3. PHP API — Эндпоинты

### 3.1. `admin-auth.php` — Авторизация

| Метод | Действие | Тело запроса | Ответ |
|-------|----------|-------------|-------|
| `POST` action=login | Вход | `{ password }` | `{ ok, token }` |
| `POST` action=logout | Выход | — | `{ ok }` |
| `GET` action=check | Проверка сессии | — | `{ ok, authenticated }` |

- Пароль хранится как **bcrypt-хеш** в `.env.php`
- Авторизация через **PHP session** (cookie `PHPSESSID`)
- Rate limiting: 5 попыток / 15 минут

### 3.2. `admin-data.php` — CRUD данных

| Метод | Параметры | Описание |
|-------|-----------|----------|
| `GET ?type=testimonials` | — | Чтение отзывов (публичный) |
| `GET ?type=screenshots` | — | Чтение скриншотов (публичный) |
| `GET ?type=services` | — | Чтение услуг (публичный) |
| `GET ?type=site-content` | — | Чтение текстов (публичный) |
| `POST ?type=testimonials` | JSON body | Сохранение отзывов (auth) |
| `POST ?type=screenshots` | JSON body | Сохранение скриншотов (auth) |
| `POST ?type=services` | JSON body | Сохранение услуг (auth) |
| `POST ?type=site-content` | JSON body | Сохранение текстов (auth) |

- **GET** — публичный, без авторизации (данные для сайта)
- **POST** — требует авторизации (запись из админки)
- Валидация JSON-схемы на сервере
- Бэкап предыдущей версии перед записью (`data/backups/`)

### 3.3. `admin-upload.php` — Загрузка изображений

| Метод | Описание |
|-------|----------|
| `POST` multipart/form-data | Загрузка изображения (auth) |
| `DELETE ?file=...` | Удаление изображения (auth) |

- Только JPEG/PNG/WebP, макс. 5 МБ
- Автоматическое сжатие и ресайз
- Сохранение в `/uploads/screenshots/`

---

## 4. React — Клиентская часть

### 4.1. API клиент (`src/lib/api.ts`)

```typescript
// Функции для работы с API
fetchSiteData(type: DataType): Promise<T>
saveSiteData(type: DataType, data: T): Promise<void>
uploadImage(file: File): Promise<{ url: string }>
adminLogin(password: string): Promise<boolean>
adminLogout(): Promise<void>
checkAuth(): Promise<boolean>
```

### 4.2. Хук `useSiteData` (`src/hooks/useSiteData.ts`)

- Использует `@tanstack/react-query` для кеширования
- `staleTime: 5 min` — не перезапрашивает данные слишком часто
- Fallback на хардкод-данные из i18n при ошибке API
- Отдельные хуки: `useTestimonials()`, `useScreenshots()`, `useServices()`, `useSiteContent()`

### 4.3. Обновление компонентов

| Компонент | Изменения |
|-----------|-----------|
| `Testimonials.tsx` | Данные из `useTestimonials()` + `useScreenshots()`, toggle блоков, отзывы без i18n |
| `Services.tsx` | Данные из `useServices()` |
| `Hero.tsx` | Статистика и тексты из `useSiteContent()` |
| `About.tsx` | Тексты и фичи из `useSiteContent()` |
| `CTA.tsx` | Тексты и ссылки из `useSiteContent()` |
| `Process.tsx` | Шаги из `useSiteContent()` |

### 4.4. Страница `/admin` (`src/pages/Admin.tsx`)

Lazy-loaded страница с:
- **Формой входа** (пароль)
- **Sidebar-навигацией** по разделам
- **Формами редактирования**:
  - Отзывы: добавить/удалить/редактировать + toggle блоков
  - Скриншоты: drag-n-drop загрузка + подписи + порядок
  - Услуги: редактирование всех полей + порядок
  - Тексты секций: inline-редактирование
  - Контакты: ссылки Telegram/Max
- **Предпросмотр** изменений перед сохранением
- **Кнопка «Сохранить»** с подтверждением

---

## 5. Безопасность

- [ ] Пароль хранится как **bcrypt-хеш** в `.env.php` (не в Git)
- [ ] PHP session с `httponly`, `secure`, `samesite=strict`
- [ ] CORS ограничен доменом `elenafitmagic.ru`
- [ ] Rate limiting на login (5 попыток / 15 мин)
- [ ] Валидация JSON-схемы при записи
- [ ] Санитизация имён файлов при загрузке
- [ ] Ограничение размера загружаемых файлов (5 МБ)
- [ ] Бэкап данных перед каждой записью
- [ ] `.htaccess` запрет прямого доступа к `/api/data/`

---

## 6. Структура новых файлов

```
public/api/
├── admin-auth.php              # Авторизация (login/logout/check)
├── admin-data.php              # CRUD для JSON-данных
├── admin-upload.php            # Загрузка изображений
└── data/                       # JSON-файлы с данными
    ├── .htaccess               # Запрет прямого доступа
    ├── testimonials.json       # Текстовые отзывы + настройки видимости
    ├── screenshots.json        # Скриншоты переписок
    ├── services.json           # Услуги + детали + цены
    ├── site-content.json       # Тексты секций + контакты + статистика
    └── backups/                # Автобэкапы перед записью

src/
├── lib/
│   └── api.ts                  # API клиент для работы с PHP бэкендом
├── hooks/
│   └── useSiteData.ts          # Хуки react-query для загрузки данных
├── pages/
│   └── Admin.tsx               # Страница админки (lazy loaded)
└── components/admin/
    ├── AdminLogin.tsx           # Форма входа
    ├── AdminLayout.tsx          # Layout: sidebar + content area
    ├── TestimonialsEditor.tsx   # CRUD отзывов + toggle блоков
    ├── ScreenshotsEditor.tsx    # Загрузка скриншотов + подписи
    ├── ServicesEditor.tsx       # Редактирование услуг
    └── ContentEditor.tsx        # Редактирование текстов секций
```

---

## 7. Порядок реализации (этапы)

### Этап 1: Бэкенд (PHP API)
1. ✅ Создать JSON-файлы с начальными данными (вынести из i18n)
2. ✅ `admin-auth.php` — авторизация
3. ✅ `admin-data.php` — CRUD чтение/запись
4. ✅ `admin-upload.php` — загрузка изображений
5. ✅ `.htaccess` для защиты `/api/data/`

### Этап 2: React — загрузка данных
6. ✅ `src/lib/api.ts` — API клиент
7. ✅ `src/hooks/useSiteData.ts` — хуки react-query
8. ✅ Обновить `Testimonials.tsx` — данные из API, toggle блоков, убрать i18n для отзывов
9. Обновить `Services.tsx`, `Hero.tsx`, `About.tsx`, `CTA.tsx`, `Process.tsx`

### Этап 3: Админка
10. ✅ Роут `/admin` в `App.tsx`
11. ✅ `AdminLogin.tsx` — форма входа
12. ✅ `AdminLayout.tsx` — layout с sidebar
13. ✅ `TestimonialsEditor.tsx` — CRUD отзывов + toggle
14. ✅ `ScreenshotsEditor.tsx` — загрузка скриншотов
15. `ServicesEditor.tsx` — редактирование услуг
16. `ContentEditor.tsx` — редактирование текстов

### Этап 4: Финализация
17. Тестирование всех CRUD операций
18. Документация для Елены (инструкция по использованию)
19. Деплой PHP API на сервер
20. Добавить пароль в `.env.php` на сервере

---

## 8. Особенности секции «Отзывы»

### Два независимых блока с toggle

В админке Елена видит:

```
┌─────────────────────────────────────────┐
│ Секция «Отзывы»                         │
│                                          │
│ [✓] Текстовые отзывы (карусель)         │
│     ├── + Добавить отзыв                │
│     ├── Анна М. — «За 3 месяца...»  [✎][✕]│
│     ├── Ольга К. — «Наконец-то...»  [✎][✕]│
│     └── ...                              │
│                                          │
│ [✓] Скриншоты переписок (галерея)       │
│     ├── + Загрузить скриншот            │
│     ├── chat-1.jpg — «Результат...» [✎][✕]│
│     └── ...                              │
└─────────────────────────────────────────┘
```

- Если оба блока выключены — секция Testimonials полностью скрыта
- Если включён только один — показывается только он
- Текстовые отзывы хранятся **без перевода** (только русский текст)
- Заголовки секции («Отзывы клиентов», «Реальные переписки») остаются в i18n (переводимые)

---

## 9. Деплой на сервер

### Что нужно сделать на Timeweb

1. Загрузить PHP-файлы в `/api/` на сервере
2. Создать директорию `/api/data/` с правами записи (chmod 755)
3. Создать директорию `/uploads/screenshots/` с правами записи
4. Загрузить начальные JSON-файлы в `/api/data/`
5. Добавить в `.env.php`:
   ```php
   define('ADMIN_PASSWORD_HASH', '$2y$10$...');  // bcrypt хеш пароля
   ```
6. Добавить `.htaccess` в `/api/data/` для запрета прямого доступа

### Генерация хеша пароля

```php
// Выполнить один раз на сервере или локально
echo password_hash('пароль_елены', PASSWORD_BCRYPT);
```

---

## 10. Риски и митигация

| Риск | Митигация |
|------|-----------|
| API недоступен | Fallback на хардкод-данные из i18n |
| Потеря данных | Автобэкап перед каждой записью |
| Взлом админки | bcrypt + rate limiting + session security |
| Большие изображения | Серверный ресайз + лимит 5 МБ |
| Конфликт при одновременном редактировании | Одна учётная запись — конфликтов не будет |
