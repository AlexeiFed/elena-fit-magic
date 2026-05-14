import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Check, Diamond } from "@/components/icons";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useI18n } from "@/hooks/useI18n";

import type { ServiceDetailData } from "./serviceDetails";

interface ServiceDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: ServiceDetailData | null;
  /** cms — текст уже языковой из API; legacy — i18n serviceDetails для EN */
  contentSource?: "cms" | "legacy";
}

export const ServiceDetailModal = ({
  isOpen,
  onClose,
  data,
  contentSource = "legacy",
}: ServiceDetailModalProps) => {
  const { t, language } = useI18n();
  if (!data) return null;

  // Helper function to translate service detail data
  const translateServiceData = (serviceKey: string, field: string, defaultValue: string): string => {
    const translationKey = `serviceDetails.${serviceKey}.${field}`;
    const translated = t(translationKey);
    // If translation key is returned (meaning no translation found), return original
    return translated === translationKey ? defaultValue : translated;
  };

  // Get service key from data title (reverse lookup)
  const getServiceKey = (): string => {
    const titleMap: Record<string, string> = {
      '"БАЗОВЫЙ"': "БАЗОВЫЙ ФОРМАТ",
      '"СОПРОВОЖДЕНИЕ С КУРАТОРОМ"': "СОПРОВОЖДЕНИЕ С КУРАТОРОМ",
      '"ПРЕМИУМ"': "ПРЕМИУМ",
      '"МИНИ-ГРУППА"': "МИНИ-ГРУППА",
      '"СТАРТ"': "СТАРТ",
      '"ТРАНСФОРМАЦИЯ"': "ТРАНСФОРМАЦИЯ",
    };
    return titleMap[data.title] || "";
  };

  const serviceKey = getServiceKey();

  const translatedData =
    contentSource === "cms"
      ? data
      : serviceKey && language !== "ru"
        ? {
            ...data,
            title: translateServiceData(serviceKey, "title", data.title),
            subtitle: translateServiceData(serviceKey, "subtitle", data.subtitle),
            description: data.description
              ? translateServiceData(serviceKey, "description", data.description)
              : undefined,
            sections: data.sections.map((section, sectionIdx) => ({
              ...section,
              title: translateServiceData(serviceKey, `sections.${sectionIdx}.title`, section.title),
              items: section.items.map((item, itemIdx) =>
                translateServiceData(serviceKey, `sections.${sectionIdx}.items.${itemIdx}`, item),
              ),
            })),
            pricing: {
              label: translateServiceData(serviceKey, "pricing.label", data.pricing.label),
              options: data.pricing.options.map((option, optionIdx) =>
                translateServiceData(serviceKey, `pricing.options.${optionIdx}`, option),
              ),
            },
            extras: data.extras?.map((extra, extraIdx) =>
              translateServiceData(serviceKey, `extras.${extraIdx}`, extra),
            ),
          }
        : data;

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="p-0 overflow-hidden sm:max-w-2xl">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border/30">
          <DialogTitle className="text-2xl md:text-3xl font-bold gradient-text">
            {translatedData.title}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {translatedData.subtitle}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[calc(100vh-200px)] sm:h-auto sm:max-h-[60vh] px-6 py-4">
          {translatedData.description && (
            <p className="text-foreground/80 italic mb-6 text-sm leading-relaxed">
              {translatedData.description}
            </p>
          )}

          <div className="space-y-6">
            {translatedData.sections.map((section, idx) => (
              <div key={idx} className="space-y-3">
                <h4 className="font-semibold text-primary flex items-center gap-2">
                  <Diamond className="w-4 h-4" />
                  {section.title}
                </h4>
                <ul className="space-y-2 pl-1">
                  {section.items.map((item, itemIdx) => (
                    <li key={itemIdx} className="flex items-start gap-2 text-sm text-foreground/80">
                      <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-border/30">
            <h4 className="font-semibold text-foreground mb-3">{translatedData.pricing.label}</h4>
            <ul className="space-y-2">
              {translatedData.pricing.options.map((option, idx) => (
                <li key={idx} className="text-primary text-sm font-medium flex items-start gap-2">
                  <Diamond className="w-3 h-3 mt-1 flex-shrink-0" />
                  {option}
                </li>
              ))}
            </ul>
          </div>

          {translatedData.extras && translatedData.extras.length > 0 && (
            <div className="mt-6 pt-4 border-t border-border/30">
              <h4 className="font-semibold text-foreground mb-3">{t("serviceDetail.extras")}</h4>
              <ul className="space-y-1">
                {translatedData.extras.map((extra, idx) => (
                  <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                    <Diamond className="w-3 h-3 mt-1 flex-shrink-0 text-primary" />
                    {extra}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
