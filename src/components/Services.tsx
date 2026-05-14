/**
 * Services — секция услуг
 * Карточки и модалка из services.json (API); заголовки секции — site-content + i18n;
 * подписи категорий «Тренировки» / «Нутрициология» из категорий в JSON (title / titleEn).
 */
import { useMemo } from "react";
import { ServiceCard } from "./ServiceCard";
import { useI18n } from "@/hooks/useI18n";
import { useServices } from "@/hooks/useSiteData";
import { useResolvedSiteContent } from "@/hooks/useResolvedSiteContent";
import { motion } from "@/lib/motion";
import { Reveal } from "./animations/Reveal";
import { DESIGN_TOKENS } from "@/lib/design-tokens";
import { resolveServiceForCard } from "@/lib/service-resolve";
import type { ServiceCategory } from "@/lib/api";

const FEATURED_ID_FALLBACK = "ПРЕМИУМ";

const TRAINING_SERVICE_IDS = new Set([
  "ПРЕМИУМ",
  "БАЗОВЫЙ ФОРМАТ",
  "МИНИ-ГРУППА",
  "СОПРОВОЖДЕНИЕ С КУРАТОРОМ",
]);
const NUTRITION_SERVICE_IDS = new Set(["СТАРТ", "ТРАНСФОРМАЦИЯ"]);

const FALLBACK_CATEGORIES: ServiceCategory[] = [
  {
    id: "training",
    title: "",
    services: [...TRAINING_SERVICE_IDS].map((id, order) => ({
      id,
      title: "",
      subtitle: "",
      features: [],
      order,
    })),
  },
  {
    id: "nutrition",
    title: "",
    services: [...NUTRITION_SERVICE_IDS].map((id, order) => ({
      id,
      title: "",
      subtitle: "",
      features: [],
      order,
    })),
  },
];

export const Services = () => {
  const { t, language } = useI18n();
  const { data: servicesFromApi } = useServices();
  const { servicesSection } = useResolvedSiteContent();

  const featuredServiceId =
    servicesFromApi?.featuredId != null && String(servicesFromApi.featuredId).length > 0
      ? servicesFromApi.featuredId
      : FEATURED_ID_FALLBACK;

  const serviceCategories = useMemo(() => {
    const sourceCategories =
      servicesFromApi?.categories?.length ? servicesFromApi.categories : FALLBACK_CATEGORIES;

    const fallbackCategoryLabel = (cat: ServiceCategory) => {
      if (cat.id === "training" || cat.services?.some((s) => TRAINING_SERVICE_IDS.has(s.id))) {
        return t("services.category.training");
      }
      if (cat.id === "nutrition" || cat.services?.some((s) => NUTRITION_SERVICE_IDS.has(s.id))) {
        return t("services.category.nutrition");
      }
      return t("services.title");
    };

    const pickCategoryLabel = (cat: ServiceCategory) => {
      if (language === "en") return cat.titleEn?.trim() || fallbackCategoryLabel(cat);
      return cat.title?.trim() || fallbackCategoryLabel(cat);
    };

    return sourceCategories
      .map((cat) => {
        const services = [...(cat.services ?? [])]
          .filter((svc) => !svc.hidden)
          .sort((a, b) => a.order - b.order)
          .map((svc) => resolveServiceForCard(svc.id, language, t, svc));

        return {
          id: cat.id,
          label: pickCategoryLabel(cat),
          services,
        };
      })
      .filter((cat) => cat.services.length > 0);
  }, [servicesFromApi, language, t]);

  return (
    <section id="services" className={`${DESIGN_TOKENS.section.default} relative`}>
      <div className={DESIGN_TOKENS.container}>
        <div className="text-center mb-16 md:mb-20">
          <Reveal>
            <h2 className={DESIGN_TOKENS.heading.h2}>
              {servicesSection.title}{" "}
              <span className="gradient-text">{servicesSection.titleHighlight}</span>
            </h2>
          </Reveal>
          <Reveal delay={0.15}>
            <p className={`${DESIGN_TOKENS.text.muted} max-w-2xl mx-auto`}>{servicesSection.subtitle}</p>
          </Reveal>
        </div>

        {serviceCategories.map((category, categoryIndex) => (
          <div
            key={category.id}
            className={categoryIndex < serviceCategories.length - 1 ? "mb-20" : ""}
          >
            <div className="flex items-center gap-4 mb-10">
              <div className={DESIGN_TOKENS.divider + " flex-grow"} />
              <h3 className={`${DESIGN_TOKENS.heading.h3} text-primary px-4 whitespace-nowrap`}>
                {category.label}
              </h3>
              <div className={DESIGN_TOKENS.divider + " flex-grow"} />
            </div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8"
              style={{ gridAutoRows: "1fr" }}
            >
              {category.services.map((service, index) => (
                <ServiceCard
                  key={service.id}
                  id={service.id}
                  title={service.title}
                  subtitle={service.subtitle}
                  features={service.features}
                  detailFromApi={service.detailFromApi}
                  index={index}
                  totalCards={category.services.length}
                  featured={service.id === featuredServiceId}
                />
              ))}
            </motion.div>
          </div>
        ))}
      </div>
    </section>
  );
};
