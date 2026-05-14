/**
 * Готовые тексты/URL из CMS + i18n для текущего языка.
 * При placeholder-данных react-query (ещё не загрузилось с API) — только t().
 */
import { useMemo } from "react";
import { useSiteContent } from "@/hooks/useSiteData";
import { useI18n } from "@/hooks/useI18n";
import {
  resolveAboutContent,
  resolveContactsContent,
  resolveCtaContent,
  resolveHeroContent,
  resolveProcessContent,
  resolveServicesSectionContent,
} from "@/lib/site-content-resolve";

export function useResolvedSiteContent() {
  const { data, isPlaceholderData } = useSiteContent();
  const { t, language } = useI18n();

  return useMemo(() => {
    const raw = isPlaceholderData ? undefined : data;
    return {
      hero: resolveHeroContent(raw, language, t),
      about: resolveAboutContent(raw, language, t),
      process: resolveProcessContent(raw, language, t),
      servicesSection: resolveServicesSectionContent(raw, language, t),
      cta: resolveCtaContent(raw, language, t),
      contacts: resolveContactsContent(raw),
    };
  }, [data, isPlaceholderData, language, t]);
}
