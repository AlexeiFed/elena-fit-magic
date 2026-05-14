/**
 * ServiceCard — карточка услуги
 * Поддерживает featured mode (для Премиум): gradient border,
 * badge «Популярное», увеличенная тень, shimmer CTA.
 */
import { Check, ChevronRight, Star } from "@/components/icons";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ServiceDetailModal } from "./ServiceDetailModal";
import { RegistrationModal } from "./RegistrationModal";
import { serviceDetails, type ServiceDetailData } from "./serviceDetails";
import { useI18n } from "@/hooks/useI18n";
import { motion } from "@/lib/motion";
import { DESIGN_TOKENS } from "@/lib/design-tokens";
import { cn } from "@/lib/utils";

interface ServiceCardProps {
  id: string;
  title: string;
  subtitle: string;
  features: string[];
  /** Детали модалки из API (если есть — приоритет над статическим serviceDetails.ts) */
  detailFromApi: ServiceDetailData | null;
  index: number;
  totalCards: number;
  featured?: boolean;
}

export const ServiceCard = ({
  id,
  title,
  subtitle,
  features,
  detailFromApi,
  index,
  totalCards,
  featured = false,
}: ServiceCardProps) => {
  const { t } = useI18n();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);

  const legacyDetail = serviceDetails[id] || null;
  const detailData = detailFromApi ?? legacyDetail;
  const modalSource: "cms" | "legacy" = detailFromApi ? "cms" : "legacy";

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0 }
      }}
      transition={{ duration: 0.5 }}
      className="relative h-full"
    >
      {/* Мягкий gradient glow для featured card */}
      {featured && (
        <div className="absolute -inset-[1px] rounded-[calc(1.5rem+1px)] bg-gradient-to-br from-primary/30 via-accent/20 to-primary/15 -z-10" />
      )}

      <motion.div
        whileHover={{ y: -6 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className={cn(
          "group relative overflow-hidden h-full flex flex-col p-7 md:p-8 rounded-3xl border transition-all duration-300",
          featured
            ? "bg-card border-primary/15 shadow-xl shadow-primary/10"
            : "bg-card/80 backdrop-blur-sm border-border/30 shadow-lg shadow-black/5 hover:shadow-xl hover:shadow-primary/10 hover:border-primary/20"
        )}
      >
        {/* Фоновый glow при ховере */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        {/* Featured badge */}
        {featured && (
          <div className="absolute top-4 right-4 z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary">
              <Star className="w-3 h-3 fill-primary" />
              {t("services.card.popular") || "Популярное"}
            </span>
          </div>
        )}

        {/* Top accent line */}
        <div className={cn(
          "absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent transition-opacity duration-500 pointer-events-none",
          featured ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        )} />

        {/* Заголовок */}
        <div className="mb-4 relative z-10">
          <h3 className={cn(
            "text-xl md:text-2xl font-bold transition-colors duration-300",
            featured ? "text-primary" : "group-hover:text-primary"
          )}>
            {title}
          </h3>
        </div>

        <p className="text-sm text-muted-foreground mb-6 relative z-10">
          {subtitle}
        </p>

        {/* Features list */}
        <ul className="space-y-3 flex-grow mb-6 relative z-10">
          {features.map((feature, idx) => (
            <li key={idx} className="flex items-start gap-3">
              <div className="mt-0.5 flex-shrink-0">
                <div className={cn(
                  "w-5 h-5 rounded-full flex items-center justify-center transition-colors duration-300",
                  featured ? "bg-primary/15" : "bg-primary/10"
                )}>
                  <Check className="w-3 h-3 text-primary" />
                </div>
              </div>
              <span className="text-sm text-foreground/80 leading-relaxed">{feature}</span>
            </li>
          ))}
        </ul>

        {/* Кнопки */}
        <div className="mt-auto pt-5 border-t border-border/20 flex flex-col sm:flex-row gap-3 relative z-10">
          <Button
            className={cn(
              "flex-1 rounded-full text-sm shadow-md transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]",
              featured
                ? "btn-shimmer bg-primary hover:bg-primary/90 text-primary-foreground shadow-primary/20"
                : "bg-primary hover:bg-primary/90 text-primary-foreground shadow-primary/10"
            )}
            onClick={() => setIsRegistrationOpen(true)}
          >
            {t("services.card.select")}
          </Button>

          <Button
            variant="ghost"
            className="flex-1 rounded-full justify-center text-primary hover:text-primary hover:bg-primary/5 group/btn text-sm"
            onClick={() => setIsModalOpen(true)}
          >
            <span>{t("services.card.details")}</span>
            <ChevronRight className="ml-1 w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
          </Button>
        </div>
      </motion.div>

      <ServiceDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        data={detailData}
        contentSource={modalSource}
      />

      <RegistrationModal
        isOpen={isRegistrationOpen}
        onClose={() => setIsRegistrationOpen(false)}
        serviceName={id}
      />
    </motion.div>
  );
};
