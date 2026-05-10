/**
 * Services — секция услуг
 * Featured card для Премиум (gradient border, badge),
 * категории Training и Nutrition с divider,
 * staggered entrance анимации.
 * Скрытые в админке услуги (services.json → hidden) не рендерятся.
 */
import { useMemo } from "react";
import { ServiceCard } from "./ServiceCard";
import { useI18n } from "@/hooks/useI18n";
import { useServices } from "@/hooks/useSiteData";
import { motion } from "framer-motion";
import { Reveal } from "./animations/Reveal";
import { DESIGN_TOKENS } from "@/lib/design-tokens";

/** ID Премиум-карточки для featured-режима */
const FEATURED_ID = "ПРЕМИУМ";

const TRAINING_SERVICE_IDS = new Set([
  "ПРЕМИУМ",
  "БАЗОВЫЙ ФОРМАТ",
  "МИНИ-ГРУППА",
  "СОПРОВОЖДЕНИЕ С КУРАТОРОМ",
]);
const NUTRITION_SERVICE_IDS = new Set(["СТАРТ", "ТРАНСФОРМАЦИЯ"]);

export const Services = () => {
  const { t } = useI18n();
  const { data: servicesFromApi } = useServices();

  const hiddenIds = useMemo(() => {
    const ids = new Set<string>();
    for (const cat of servicesFromApi?.categories ?? []) {
      for (const svc of cat.services) {
        if (svc.hidden) ids.add(svc.id);
      }
    }
    return ids;
  }, [servicesFromApi]);

  const featuredServiceId =
    servicesFromApi?.featuredId != null && String(servicesFromApi.featuredId).length > 0
      ? servicesFromApi.featuredId
      : FEATURED_ID;

  const services = [
    {
      id: "ПРЕМИУМ",
      title: t("services.premium.title"),
      subtitle: t("services.premium.subtitle"),
      features: [
        t("services.premium.feature1"),
        t("services.premium.feature2"),
        t("services.premium.feature3"),
        t("services.premium.feature4"),
        t("services.premium.feature5"),
        t("services.premium.feature6"),
      ],
    },
    {
      id: "БАЗОВЫЙ ФОРМАТ",
      title: t("services.basic.title"),
      subtitle: t("services.basic.subtitle"),
      features: [
        t("services.basic.feature1"),
        t("services.basic.feature2"),
        t("services.basic.feature3"),
        t("services.basic.feature4"),
        t("services.basic.feature5"),
      ],
    },
    {
      id: "МИНИ-ГРУППА",
      title: t("services.miniGroup.title"),
      subtitle: t("services.miniGroup.subtitle"),
      features: [
        t("services.miniGroup.feature1"),
        t("services.miniGroup.feature2"),
        t("services.miniGroup.feature3"),
        t("services.miniGroup.feature4"),
        t("services.miniGroup.feature5"),
        t("services.miniGroup.feature6"),
      ],
    },
    {
      id: "СОПРОВОЖДЕНИЕ С КУРАТОРОМ",
      title: t("services.curator.title"),
      subtitle: t("services.curator.subtitle"),
      features: [
        t("services.curator.feature1"),
        t("services.curator.feature2"),
        t("services.curator.feature3"),
        t("services.curator.feature4"),
        t("services.curator.feature5"),
      ],
    },
    {
      id: "СТАРТ",
      title: t("services.start.title"),
      subtitle: t("services.start.subtitle"),
      features: [
        t("services.start.feature1"),
        t("services.start.feature2"),
        t("services.start.feature3"),
        t("services.start.feature4"),
        t("services.start.feature5"),
      ],
    },
    {
      id: "ТРАНСФОРМАЦИЯ",
      title: t("services.transformation.title"),
      subtitle: t("services.transformation.subtitle"),
      features: [
        t("services.transformation.feature1"),
        t("services.transformation.feature2"),
        t("services.transformation.feature3"),
        t("services.transformation.feature4"),
        t("services.transformation.feature5"),
      ],
    },
  ];

  const trainingServices = services.filter(
    (s) => TRAINING_SERVICE_IDS.has(s.id) && !hiddenIds.has(s.id),
  );
  const nutritionServices = services.filter(
    (s) => NUTRITION_SERVICE_IDS.has(s.id) && !hiddenIds.has(s.id),
  );

  return (
    <section id="services" className={`${DESIGN_TOKENS.section.default} relative`}>
      <div className={DESIGN_TOKENS.container}>
        {/* Заголовок секции */}
        <div className="text-center mb-16 md:mb-20">
          <Reveal>
            <h2 className={DESIGN_TOKENS.heading.h2}>
              {t("services.title")}{" "}
              <span className="gradient-text">{t("services.titleHighlight")}</span>
            </h2>
          </Reveal>
          <Reveal delay={0.15}>
            <p className={`${DESIGN_TOKENS.text.muted} max-w-2xl mx-auto`}>
              {t("services.subtitle")}
            </p>
          </Reveal>
        </div>

        {/* === Категория: Тренировки === */}
        <div className="mb-20">
          <div className="flex items-center gap-4 mb-10">
            <div className={DESIGN_TOKENS.divider + " flex-grow"} />
            <h3 className={`${DESIGN_TOKENS.heading.h3} text-primary px-4 whitespace-nowrap`}>
              {t("services.category.training")}
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
            {trainingServices.map((service, index) => (
              <ServiceCard
                key={service.id}
                {...service}
                index={index}
                totalCards={trainingServices.length}
                featured={service.id === featuredServiceId}
              />
            ))}
          </motion.div>
        </div>

        {/* === Категория: Нутрициология === */}
        <div>
          <div className="flex items-center gap-4 mb-10">
            <div className={DESIGN_TOKENS.divider + " flex-grow"} />
            <h3 className={`${DESIGN_TOKENS.heading.h3} text-primary px-4 whitespace-nowrap`}>
              {t("services.category.nutrition")}
            </h3>
            <div className={DESIGN_TOKENS.divider + " flex-grow"} />
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto"
            style={{ gridAutoRows: "1fr" }}
          >
            {nutritionServices.map((service, index) => (
              <ServiceCard
                key={service.id}
                {...service}
                index={index}
                totalCards={nutritionServices.length}
              />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
