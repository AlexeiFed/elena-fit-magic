/**
 * Testimonials — секция отзывов клиентов
 * 1) Карусель текстовых отзывов на Embla Carousel (shadcn Carousel).
 * 2) Галерея скриншотов переписок с клиентками.
 * Данные загружаются из JSON API (useTestimonials / useScreenshots).
 * Каждый блок можно включить/отключить через админку (textReviewsEnabled / screenshotsEnabled).
 * Тексты отзывов НЕ переводятся (хранятся как есть на русском).
 * Заголовки секции остаются в i18n (переводимые).
 * Фон: section.alt (чередование с WhyChoose default).
 */
import { useState, useCallback, useEffect } from "react";
import { Quote, Star, MessageCircle, ZoomIn, X } from "lucide-react";
import { useI18n } from "@/hooks/useI18n";
import { useTestimonials, useScreenshots } from "@/hooks/useSiteData";
import { Reveal } from "./animations/Reveal";
import { DESIGN_TOKENS } from "@/lib/design-tokens";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

/**
 * Placeholder-градиенты для заглушек скриншотов.
 * Используются когда реальное изображение ещё не загружено.
 */
const SCREENSHOT_PLACEHOLDERS = [
  "from-slate-100 to-slate-200",
  "from-slate-50 to-slate-150",
  "from-gray-100 to-gray-200",
  "from-zinc-100 to-zinc-200",
  "from-stone-100 to-stone-200",
  "from-neutral-100 to-neutral-200",
];

/** Генерация инициалов из имени */
const getInitials = (name: string) =>
  name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

/** Цвета аватаров — чередуются для визуального разнообразия */
const AVATAR_COLORS = [
  "from-primary to-accent",
  "from-accent to-primary",
  "from-orange-400 to-rose-400",
  "from-amber-400 to-orange-500",
  "from-rose-400 to-primary",
];

export const Testimonials = () => {
  const { t } = useI18n();

  /* Данные из API (с fallback на хардкод если API недоступен) */
  const { data: testimonialsData, isPlaceholderData: isTestimonialsPlaceholder } = useTestimonials();
  const { data: screenshotsData } = useScreenshots();

  /* Карусель текстовых отзывов */
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  /* Карусель скриншотов */
  const [screenshotsApi, setScreenshotsApi] = useState<CarouselApi>();
  const [sCurrent, setSCurrent] = useState(0);
  const [sCount, setSCount] = useState(0);

  /** Индекс открытого скриншота в lightbox (-1 = закрыт) */
  const [lightboxIndex, setLightboxIndex] = useState(-1);

  /* Флаги видимости блоков (управляются из админки) */
  const textReviewsEnabled = testimonialsData?.textReviewsEnabled ?? true;
  const screenshotsEnabled = testimonialsData?.screenshotsEnabled ?? true;

  /* Отзывы из API, отсортированные по order */
  const testimonials = [...(testimonialsData?.items ?? [])].sort((a, b) => a.order - b.order);

  /* Скриншоты из API, отсортированные по order */
  const screenshots = [...(screenshotsData?.items ?? [])].sort((a, b) => a.order - b.order);

  /* Синхронизация текущего слайда текстовых отзывов с Embla API */
  useEffect(() => {
    if (!api) return;
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());
    const onSelect = () => setCurrent(api.selectedScrollSnap());
    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  /* Синхронизация текущего слайда скриншотов с Embla API */
  useEffect(() => {
    if (!screenshotsApi) return;
    setSCount(screenshotsApi.scrollSnapList().length);
    setSCurrent(screenshotsApi.selectedScrollSnap());
    const onSelect = () => setSCurrent(screenshotsApi.selectedScrollSnap());
    screenshotsApi.on("select", onSelect);
    return () => {
      screenshotsApi.off("select", onSelect);
    };
  }, [screenshotsApi]);

  /** Переход к конкретному слайду по клику на dot */
  const scrollTo = useCallback(
    (index: number) => api?.scrollTo(index),
    [api],
  );

  /** Переход к конкретному слайду скриншотов */
  const sScrollTo = useCallback(
    (index: number) => screenshotsApi?.scrollTo(index),
    [screenshotsApi],
  );

  /* Если оба блока выключены — секция полностью скрыта.
     Проверяем только когда реальные данные загружены (не placeholder). */
  if (!isTestimonialsPlaceholder && !textReviewsEnabled && !screenshotsEnabled) {
    return null;
  }

  return (
    <section id="testimonials" className={`${DESIGN_TOKENS.section.alt} relative overflow-hidden`}>
      <div className={DESIGN_TOKENS.container}>
        {/* Заголовок секции — только если текстовые отзывы включены (у скриншотов свой заголовок) */}
        {(isTestimonialsPlaceholder || textReviewsEnabled) && (
        <div className="text-center mb-16 md:mb-20">
          <Reveal>
            <h2 className={DESIGN_TOKENS.heading.h2}>
              {t("testimonials.title")}{" "}
              <span className="gradient-text">{t("testimonials.titleHighlight")}</span>
            </h2>
          </Reveal>
          <Reveal delay={0.15}>
            <p className={`${DESIGN_TOKENS.text.muted} max-w-2xl mx-auto`}>
              {t("testimonials.subtitle")}
            </p>
          </Reveal>
        </div>
        )}

        {/* Карусель отзывов (Блок 1 — toggle из админки) */}
        {(isTestimonialsPlaceholder || textReviewsEnabled) && testimonials.length > 0 && (
        <Reveal delay={0.2} width="100%">
          <Carousel
            setApi={setApi}
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4 md:-ml-6">
              {testimonials.map((item, index) => (
                <CarouselItem
                  key={index}
                  className="pl-4 md:pl-6 basis-full md:basis-1/2 lg:basis-1/3"
                >
                  {/* Карточка отзыва */}
                  <div className="h-full p-6 md:p-7 rounded-2xl bg-card/60 backdrop-blur-sm border border-border/30 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 flex flex-col">
                    {/* Иконка цитаты */}
                    <Quote className="w-8 h-8 text-primary/20 mb-4 flex-shrink-0" />

                    {/* Цитата */}
                    <p className="text-sm md:text-base text-foreground/80 leading-relaxed mb-6 flex-grow italic">
                      «{item.quote}»
                    </p>

                    {/* Результат — badge */}
                    <div className="mb-5">
                      <span className={DESIGN_TOKENS.badge}>
                        <Star className="w-3 h-3 mr-1.5 fill-primary" />
                        {item.result}
                      </span>
                    </div>

                    {/* Автор */}
                    <div className="flex items-center gap-3 pt-4 border-t border-border/20">
                      {/* Аватар-инициалы */}
                      <div
                        className={cn(
                          "w-10 h-10 rounded-full bg-gradient-to-br flex items-center justify-center text-sm font-bold text-white flex-shrink-0",
                          AVATAR_COLORS[index % AVATAR_COLORS.length],
                        )}
                      >
                        {getInitials(item.name)}
                      </div>
                      <span className="text-sm font-medium text-foreground/90">
                        {item.name}
                      </span>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>

            {/* Dot-индикаторы */}
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: count }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => scrollTo(index)}
                  className={cn(
                    "h-2 rounded-full transition-all duration-300",
                    current === index
                      ? "w-8 bg-primary"
                      : "w-2 bg-primary/20 hover:bg-primary/40",
                  )}
                  aria-label={`Slide ${index + 1}`}
                />
              ))}
            </div>
          </Carousel>
        </Reveal>
        )}

        {/* ===== Блок скриншотов переписок (Блок 2 — toggle из админки) ===== */}
        {(isTestimonialsPlaceholder || screenshotsEnabled) && screenshots.length > 0 && (
        <div className={cn("mt-20 md:mt-28", !textReviewsEnabled && "mt-0")}>
          {/* Подзаголовок */}
          <div className="text-center mb-12 md:mb-16">
            <Reveal>
              <h3 className={DESIGN_TOKENS.heading.h3}>
                <MessageCircle className="inline-block w-6 h-6 mr-2 text-primary -mt-1" />
                {t("testimonials.screenshotsTitle")}{" "}
                <span className="gradient-text">{t("testimonials.screenshotsTitleHighlight")}</span>
              </h3>
            </Reveal>
            <Reveal delay={0.1}>
              <p className={`${DESIGN_TOKENS.text.muted} max-w-xl mx-auto`}>
                {t("testimonials.screenshotsSubtitle")}
              </p>
            </Reveal>
          </div>

          {/* Карусель скриншотов */}
          <Carousel
            setApi={setScreenshotsApi}
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4 md:-ml-6">
              {screenshots.map((shot, index) => (
                <CarouselItem
                  key={shot.id}
                  className="pl-4 md:pl-6 basis-full sm:basis-1/2 lg:basis-1/3"
                >
                  <button
                    onClick={() => setLightboxIndex(index)}
                    className="group relative w-full rounded-2xl overflow-hidden border border-border/30 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 cursor-pointer block"
                  >
                    {/* Скриншот — фиксированная высота для единообразия */}
                    <div
                      className={cn(
                        "w-full h-80 bg-gradient-to-b flex items-center justify-center text-muted-foreground/40 relative",
                        SCREENSHOT_PLACEHOLDERS[index % SCREENSHOT_PLACEHOLDERS.length],
                      )}
                    >
                      {shot.src && (
                        <img
                          src={shot.src}
                          alt={shot.caption}
                          className="absolute inset-0 w-full h-full object-cover"
                          loading="lazy"
                        />
                      )}
                      {/* Placeholder — имитация мессенджера */}
                      {!shot.src && (
                        <>
                          <div className="w-full px-4 pt-3 pb-2 bg-white/60 flex items-center gap-2 absolute top-0 left-0">
                            <div className="w-7 h-7 rounded-full bg-primary/20" />
                            <div className="h-3 w-20 rounded-full bg-primary/15" />
                          </div>
                          <div className="space-y-2 px-4 w-full mt-8">
                            <div className="ml-auto w-3/4 h-8 rounded-xl bg-primary/10 rounded-br-sm" />
                            <div className="w-2/3 h-10 rounded-xl bg-white/70 rounded-bl-sm" />
                            <div className="ml-auto w-1/2 h-6 rounded-xl bg-primary/10 rounded-br-sm" />
                            <div className="w-3/4 h-12 rounded-xl bg-white/70 rounded-bl-sm" />
                            <div className="ml-auto w-2/3 h-8 rounded-xl bg-primary/10 rounded-br-sm" />
                          </div>
                        </>
                      )}
                      {/* Иконка зума при hover */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
                        <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-80 transition-opacity duration-300 drop-shadow-lg" />
                      </div>
                    </div>

                    {/* Подпись */}
                    <div className="px-4 py-3 bg-card/80 backdrop-blur-sm text-left">
                      <span className="text-xs font-medium text-muted-foreground">
                        {shot.caption}
                      </span>
                    </div>
                  </button>
                </CarouselItem>
              ))}
            </CarouselContent>

            {/* Dot-индикаторы */}
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: sCount }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => sScrollTo(index)}
                  className={cn(
                    "h-2 rounded-full transition-all duration-300",
                    sCurrent === index
                      ? "w-8 bg-primary"
                      : "w-2 bg-primary/20 hover:bg-primary/40",
                  )}
                  aria-label={`Screenshot ${index + 1}`}
                />
              ))}
            </div>
          </Carousel>
        </div>
        )}
      </div>

      {/* ===== Lightbox для увеличения скриншота ===== */}
      {lightboxIndex >= 0 && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setLightboxIndex(-1)}
        >
          {/* Кнопка закрытия */}
          <button
            onClick={() => setLightboxIndex(-1)}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-white" />
          </button>

          {/* Контент lightbox — реальное изображение или placeholder */}
          <div
            className="max-w-sm w-full max-h-[85vh] rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {screenshots[lightboxIndex]?.src ? (
              /* Реальное изображение */
              <img
                src={screenshots[lightboxIndex].src}
                alt={screenshots[lightboxIndex].caption}
                className="w-full max-h-[70vh] object-contain bg-card"
              />
            ) : (
              /* Placeholder */
              <div
                className={cn(
                  "w-full h-[70vh] bg-gradient-to-b flex flex-col items-center justify-center text-muted-foreground/40 relative",
                  SCREENSHOT_PLACEHOLDERS[lightboxIndex % SCREENSHOT_PLACEHOLDERS.length],
                )}
              >
                <div className="w-full px-5 pt-4 pb-3 bg-white/60 flex items-center gap-3 absolute top-0 left-0">
                  <div className="w-9 h-9 rounded-full bg-primary/20" />
                  <div className="h-4 w-24 rounded-full bg-primary/15" />
                </div>
                <div className="space-y-3 px-5 w-full mt-12">
                  <div className="ml-auto w-3/4 h-10 rounded-xl bg-primary/10 rounded-br-sm" />
                  <div className="w-2/3 h-14 rounded-xl bg-white/70 rounded-bl-sm" />
                  <div className="ml-auto w-1/2 h-8 rounded-xl bg-primary/10 rounded-br-sm" />
                  <div className="w-3/4 h-16 rounded-xl bg-white/70 rounded-bl-sm" />
                  <div className="ml-auto w-2/3 h-10 rounded-xl bg-primary/10 rounded-br-sm" />
                  <div className="w-1/2 h-12 rounded-xl bg-white/70 rounded-bl-sm" />
                </div>
                <p className="text-sm text-muted-foreground/60 mt-6 px-5">
                  {t("testimonials.screenshotsPlaceholder")}
                </p>
              </div>
            )}
            {/* Подпись */}
            <div className="px-5 py-4 bg-card text-center">
              <span className="text-sm font-medium text-foreground/80">
                {screenshots[lightboxIndex]?.caption}
              </span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
