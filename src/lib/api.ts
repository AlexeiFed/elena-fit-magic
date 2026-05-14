/**
 * API клиент для работы с PHP бэкендом админ-панели elenafitmagic.ru.
 *
 * Публичные функции (GET без авторизации):
 *   fetchTestimonials, fetchScreenshots, fetchServices, fetchSiteContent
 *
 * Админские функции (POST/DELETE с авторизацией):
 *   saveTestimonials, saveScreenshots, saveServices, saveSiteContent
 *   uploadImage, deleteImage, listImages
 *   adminLogin, adminLogout, checkAuth
 */

// === Типы данных ===

/** Текстовый отзыв */
export interface Testimonial {
  id: string;
  name: string;
  quote: string;
  result: string;
  order: number;
}

/** Данные отзывов с флагами видимости блоков */
export interface TestimonialsData {
  textReviewsEnabled: boolean;
  screenshotsEnabled: boolean;
  items: Testimonial[];
}

/** Скриншот переписки */
export interface Screenshot {
  id: string;
  src: string;
  caption: string;
  order: number;
}

/** Данные скриншотов */
export interface ScreenshotsData {
  items: Screenshot[];
}

/** Двуязычный текст */
export interface LocalizedText {
  ru: string;
  en: string;
}

/** Детали услуги для модалки «Подробнее» (как в services.json / админке) */
export interface ServiceDetailsPayload {
  title: string;
  subtitle: string;
  description?: string;
  sections: { title: string; items: string[] }[];
  pricing: { label: string; options: string[] };
  extras?: string[];
}

/** Услуга (плоские строки из админки; EN — опционально) */
export interface Service {
  id: string;
  title: string;
  titleEn?: string;
  subtitle: string;
  subtitleEn?: string;
  features: string[];
  featuresEn?: string[];
  details?: ServiceDetailsPayload;
  detailsEn?: ServiceDetailsPayload;
  order: number;
  /** Не показывать карточку на сайте (только админка) */
  hidden?: boolean;
}

/** Категория услуг */
export interface ServiceCategory {
  id: string;
  title: string;
  titleEn?: string;
  services: Service[];
}

/** Данные услуг */
export interface ServicesData {
  featuredId: string;
  categories: ServiceCategory[];
}

/** Данные контента сайта (+ опциональные блоки для EN) */
export interface SiteContentData {
  hero?: Record<string, unknown>;
  heroEn?: Record<string, unknown>;
  about?: Record<string, unknown>;
  aboutEn?: Record<string, unknown>;
  process?: Record<string, unknown>;
  processEn?: Record<string, unknown>;
  services?: Record<string, unknown>;
  servicesEn?: Record<string, unknown>;
  cta?: Record<string, unknown>;
  ctaEn?: Record<string, unknown>;
  contacts?: Record<string, unknown>;
  [key: string]: unknown;
}

/** Загруженный файл */
export interface UploadedFile {
  name: string;
  url: string;
  size: number;
  modified?: number;
}

/** Стандартный ответ API */
interface ApiResponse<T = unknown> {
  ok: boolean;
  error?: string;
  message?: string;
  data?: T;
}

// === Конфигурация ===

/**
 * Базовый URL API.
 * В dev-режиме используем относительный путь (Vite proxy или прямой доступ к PHP).
 * В production — /api/ на том же домене.
 */
const API_BASE = '/api';

// === Вспомогательные функции ===

/**
 * Выполняет fetch-запрос к API с обработкой ошибок.
 */
async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const url = `${API_BASE}/${endpoint}`;

  const response = await fetch(url, {
    credentials: 'include', // Для отправки session cookie
    ...options,
    headers: {
      ...options.headers,
    },
  });

  // Парсим JSON-ответ
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || `API error: ${response.status}`);
  }

  return data;
}

// === Публичные функции (GET, без авторизации) ===

/** Загрузка данных отзывов */
export async function fetchTestimonials(): Promise<TestimonialsData> {
  return apiFetch<TestimonialsData>('admin-data.php?type=testimonials');
}

/** Загрузка данных скриншотов */
export async function fetchScreenshots(): Promise<ScreenshotsData> {
  return apiFetch<ScreenshotsData>('admin-data.php?type=screenshots');
}

/** Загрузка данных услуг */
export async function fetchServices(): Promise<ServicesData> {
  return apiFetch<ServicesData>('admin-data.php?type=services');
}

/** Загрузка текстов сайта */
export async function fetchSiteContent(): Promise<SiteContentData> {
  return apiFetch<SiteContentData>('admin-data.php?type=site-content');
}

// === Админские функции (POST, требуют авторизации) ===

/** Сохранение данных отзывов */
export async function saveTestimonials(data: TestimonialsData): Promise<ApiResponse> {
  return apiFetch<ApiResponse>('admin-data.php?type=testimonials', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

/** Сохранение данных скриншотов */
export async function saveScreenshots(data: ScreenshotsData): Promise<ApiResponse> {
  return apiFetch<ApiResponse>('admin-data.php?type=screenshots', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

/** Сохранение данных услуг */
export async function saveServices(data: ServicesData): Promise<ApiResponse> {
  return apiFetch<ApiResponse>('admin-data.php?type=services', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

/** Сохранение текстов сайта */
export async function saveSiteContent(data: SiteContentData): Promise<ApiResponse> {
  return apiFetch<ApiResponse>('admin-data.php?type=site-content', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

// === Загрузка изображений ===

/** Загрузка изображения на сервер */
export async function uploadImage(
  file: File,
  type: string = 'screenshots',
): Promise<UploadedFile> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('type', type);

  const response = await fetch(`${API_BASE}/admin-upload.php`, {
    method: 'POST',
    credentials: 'include',
    body: formData,
    // Не устанавливаем Content-Type — браузер сам добавит boundary для multipart
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Upload failed');
  }

  return data.file;
}

/** Удаление изображения с сервера */
export async function deleteImage(
  fileName: string,
  type: string = 'screenshots',
): Promise<void> {
  await apiFetch<ApiResponse>(
    `admin-upload.php?file=${encodeURIComponent(fileName)}&type=${type}`,
    { method: 'DELETE' },
  );
}

/** Получение списка загруженных изображений */
export async function listImages(
  type: string = 'screenshots',
): Promise<UploadedFile[]> {
  const data = await apiFetch<{ ok: boolean; files: UploadedFile[] }>(
    `admin-upload.php?list=1&type=${type}`,
  );
  return data.files;
}

// === Авторизация ===

/** Вход в админку */
export async function adminLogin(password: string): Promise<boolean> {
  const data = await apiFetch<{ ok: boolean; authenticated: boolean }>(
    'admin-auth.php?action=login',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    },
  );
  return data.authenticated;
}

/** Выход из админки */
export async function adminLogout(): Promise<void> {
  await apiFetch<ApiResponse>('admin-auth.php?action=logout', {
    method: 'POST',
  });
}

/** Проверка текущей авторизации */
export async function checkAuth(): Promise<boolean> {
  try {
    const data = await apiFetch<{ ok: boolean; authenticated: boolean }>(
      'admin-auth.php?action=check',
    );
    return data.authenticated;
  } catch {
    return false;
  }
}
