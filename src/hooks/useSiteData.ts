/**
 * React-query хуки для загрузки динамических данных сайта из PHP API.
 *
 * Каждый хук:
 *   - Кеширует данные через @tanstack/react-query (staleTime: 5 мин)
 *   - При ошибке API возвращает fallback-данные (хардкод из i18n не ломает сайт)
 *   - Используется как в публичной части, так и в админке
 */

import { useQuery } from "@tanstack/react-query";
import {
  fetchTestimonials,
  fetchScreenshots,
  fetchServices,
  fetchSiteContent,
  type TestimonialsData,
  type ScreenshotsData,
  type ServicesData,
  type SiteContentData,
} from "@/lib/api";

// === Ключи запросов (для инвалидации кеша из админки) ===
export const QUERY_KEYS = {
  testimonials: ["testimonials"] as const,
  screenshots: ["screenshots"] as const,
  services: ["services"] as const,
  siteContent: ["site-content"] as const,
};

/** Общие настройки для всех data-хуков */
const QUERY_OPTIONS = {
  staleTime: 5 * 60 * 1000,     // 5 минут — не перезапрашиваем слишком часто
  gcTime: 30 * 60 * 1000,       // 30 минут в кеше после unmount
  retry: 2,                      // 2 повторные попытки при ошибке
  refetchOnWindowFocus: false,   // Не перезапрашиваем при фокусе окна
};

// === Fallback-данные (сайт работает даже если API недоступен) ===

const FALLBACK_TESTIMONIALS: TestimonialsData = {
  textReviewsEnabled: true,
  screenshotsEnabled: true,
  items: [
    { id: "t1", name: "Анна М.", quote: "За 3 месяца я полностью изменила своё отношение к питанию. Елена помогла разобраться в анализах и выстроить систему, которая работает именно для меня.", result: "−8 кг за 3 месяца", order: 0 },
    { id: "t2", name: "Ольга К.", quote: "Наконец-то я нашла тренера, который слышит и понимает. Индивидуальный подход — это не просто слова, а реальность каждого дня.", result: "Энергия и тонус", order: 1 },
    { id: "t3", name: "Марина С.", quote: "Мини-группа — это невероятная мотивация! Поддержка команды и профессионализм Елены дали результат, о котором я мечтала.", result: "−12 кг за 6 месяцев", order: 2 },
    { id: "t4", name: "Екатерина Д.", quote: "Работа с куратором — это постоянный контроль и поддержка. Я чувствую себя увереннее и сильнее с каждой неделей.", result: "Сила и уверенность", order: 3 },
    { id: "t5", name: "Ирина В.", quote: "Программа нутрициологии помогла мне разобраться с проблемами ЖКТ и наладить сон. Результаты анализов улучшились уже через месяц.", result: "Здоровье изнутри", order: 4 },
  ],
};

const FALLBACK_SCREENSHOTS: ScreenshotsData = {
  items: [
    { id: "s1", src: "/screenshots/chat-1.jpg", caption: "Результат за 2 месяца", order: 0 },
    { id: "s2", src: "/screenshots/chat-2.jpg", caption: "Отзыв после программы питания", order: 1 },
    { id: "s3", src: "/screenshots/chat-3.jpg", caption: "Прогресс за 3 месяца", order: 2 },
    { id: "s4", src: "/screenshots/chat-4.jpg", caption: "Обратная связь по тренировкам", order: 3 },
    { id: "s5", src: "/screenshots/chat-5.jpg", caption: "Результат трансформации", order: 4 },
    { id: "s6", src: "/screenshots/chat-6.jpg", caption: "Благодарность после курса", order: 5 },
  ],
};

const FALLBACK_SERVICES: ServicesData = {
  featuredId: "",
  categories: [],
};

const FALLBACK_SITE_CONTENT: SiteContentData = {};

// === Хуки ===

/** Загрузка данных отзывов (текстовые + флаги видимости) */
export function useTestimonials() {
  return useQuery<TestimonialsData>({
    queryKey: QUERY_KEYS.testimonials,
    queryFn: fetchTestimonials,
    placeholderData: FALLBACK_TESTIMONIALS,
    ...QUERY_OPTIONS,
  });
}

/** Загрузка данных скриншотов переписок */
export function useScreenshots() {
  return useQuery<ScreenshotsData>({
    queryKey: QUERY_KEYS.screenshots,
    queryFn: fetchScreenshots,
    placeholderData: FALLBACK_SCREENSHOTS,
    ...QUERY_OPTIONS,
  });
}

/** Загрузка данных услуг */
export function useServices() {
  return useQuery<ServicesData>({
    queryKey: QUERY_KEYS.services,
    queryFn: fetchServices,
    placeholderData: FALLBACK_SERVICES,
    ...QUERY_OPTIONS,
  });
}

/** Загрузка текстов сайта (hero, about, cta и т.д.) */
export function useSiteContent() {
  return useQuery<SiteContentData>({
    queryKey: QUERY_KEYS.siteContent,
    queryFn: fetchSiteContent,
    placeholderData: FALLBACK_SITE_CONTENT,
    ...QUERY_OPTIONS,
  });
}
