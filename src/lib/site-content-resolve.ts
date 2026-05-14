/**
 * Слияние site-content.json с i18n: RU из hero/about/…, EN из *En-блоков;
 * пустые поля EN не подставляют русский текст — только t() для текущего языка.
 */
import type { SiteContentData } from "@/lib/api";
import type { Language } from "@/contexts/i18n-types";

type TFn = (key: string, params?: Record<string, string | number>) => string;

export const DEFAULT_TELEGRAM_URL = "https://t.me/Elena_fitmentor";
export const DEFAULT_MAX_URL =
  "https://max.ru/u/f9LHodD0cOJ_T7iKN2Kw7zp58r7mbJF6Sxnhw0mBrfPbUgYA5AfZYCRnxgE";

function str(v: unknown): string | undefined {
  return typeof v === "string" ? v : undefined;
}

function cmsBlock(
  lang: Language,
  ru: Record<string, unknown> | undefined,
  en: Record<string, unknown> | undefined,
): Record<string, unknown> | undefined {
  if (lang === "en") return en && Object.keys(en).length ? en : undefined;
  return ru && Object.keys(ru).length ? ru : undefined;
}

export type ResolvedHero = {
  title: string;
  titleHighlight: string;
  subtitle: string;
  cta: string;
  statsClients: string;
  statsSuccessRate: string;
  statsClientsLabel: string;
  statsExperienceLabel: string;
  statsSuccessLabel: string;
};

export function resolveHeroContent(
  data: SiteContentData | undefined,
  lang: Language,
  t: TFn,
): ResolvedHero {
  const ru = data?.hero as Record<string, unknown> | undefined;
  const en = data?.heroEn as Record<string, unknown> | undefined;
  const cms = cmsBlock(lang, ru, en);
  const statsRu = (ru?.stats as Record<string, unknown> | undefined) ?? {};
  const statsEn = (en?.stats as Record<string, unknown> | undefined) ?? {};
  const stats = lang === "en" ? { ...statsRu, ...statsEn } : statsRu;

  const pick = (field: string, i18nKey: string) => {
    const v = str(cms?.[field])?.trim();
    return v || t(i18nKey);
  };

  return {
    title: pick("title", "hero.title"),
    titleHighlight: pick("titleHighlight", "hero.titleHighlight"),
    subtitle: pick("subtitle", "hero.subtitle"),
    cta: pick("cta", "hero.cta"),
    statsClients: str(stats.clients)?.trim() || "300+",
    statsSuccessRate: str(stats.successRate)?.trim() || "98%",
    statsClientsLabel: t("cta.stats.clients"),
    statsExperienceLabel: t("cta.stats.experience"),
    statsSuccessLabel: t("cta.stats.success"),
  };
}

export type ResolvedAbout = {
  title: string;
  titleHighlight: string;
  subtitle: string;
  descriptions: string[];
  regalia: string[];
  features: { icon: string; title: string; description: string }[];
};

export function resolveAboutContent(
  data: SiteContentData | undefined,
  lang: Language,
  t: TFn,
): ResolvedAbout {
  const ru = data?.about as Record<string, unknown> | undefined;
  const en = data?.aboutEn as Record<string, unknown> | undefined;
  const cms = cmsBlock(lang, ru, en);

  const defaultDesc = [t("about.description1"), t("about.description2"), t("about.description3")];
  const cmsDesc = cms?.descriptions as string[] | undefined;
  const descriptions =
    cmsDesc?.length && cmsDesc.some((d) => str(d)?.trim())
      ? [0, 1, 2].map((i) => str(cmsDesc[i])?.trim() || (defaultDesc[i] ?? ""))
      : defaultDesc;

  const defaultReg = [t("about.regalia1"), t("about.regalia2")];
  const cmsReg = cms?.regalia as string[] | undefined;
  const regalia =
    cmsReg?.length && cmsReg.some((r) => str(r)?.trim())
      ? [0, 1].map((i) => str(cmsReg[i])?.trim() || (defaultReg[i] ?? ""))
      : defaultReg;

  const defaultFeatures = [
    { icon: "Heart", title: t("about.feature.health"), description: t("about.feature.healthDesc") },
    { icon: "Zap", title: t("about.feature.energy"), description: t("about.feature.energyDesc") },
    { icon: "Apple", title: t("about.feature.nutrition"), description: t("about.feature.nutritionDesc") },
    { icon: "Target", title: t("about.feature.goals"), description: t("about.feature.goalsDesc") },
  ];
  type Feat = { icon?: string; title?: string; description?: string };
  const cmsFeats = cms?.features as Feat[] | undefined;
  const features =
    cmsFeats?.length && cmsFeats.some((f) => str(f?.title)?.trim() || str(f?.description)?.trim())
      ? cmsFeats.map((f, i) => ({
          icon: str(f?.icon)?.trim() || defaultFeatures[i]?.icon || "Heart",
          title: str(f?.title)?.trim() || defaultFeatures[i]?.title || "",
          description: str(f?.description)?.trim() || defaultFeatures[i]?.description || "",
        }))
      : defaultFeatures;

  const pick = (field: string, i18nKey: string) => str(cms?.[field])?.trim() || t(i18nKey);

  return {
    title: pick("title", "about.title"),
    titleHighlight: pick("titleHighlight", "about.titleHighlight"),
    subtitle: pick("subtitle", "about.subtitle"),
    descriptions,
    regalia,
    features,
  };
}

export type ResolvedProcessStep = { title: string; description: string };

export function resolveProcessContent(
  data: SiteContentData | undefined,
  lang: Language,
  t: TFn,
): { title: string; titleHighlight: string; subtitle: string; steps: ResolvedProcessStep[] } {
  const ru = data?.process as Record<string, unknown> | undefined;
  const en = data?.processEn as Record<string, unknown> | undefined;
  const cms = cmsBlock(lang, ru, en);

  const defaultSteps: ResolvedProcessStep[] = [1, 2, 3, 4].map((n) => ({
    title: t(`process.step${n}.title`),
    description: t(`process.step${n}.description`),
  }));
  const cmsSteps = cms?.steps as ResolvedProcessStep[] | undefined;
  const steps =
    cmsSteps?.length === 4 && cmsSteps.some((s) => str(s?.title)?.trim())
      ? [0, 1, 2, 3].map((i) => ({
          title: str(cmsSteps[i]?.title)?.trim() || defaultSteps[i].title,
          description: str(cmsSteps[i]?.description)?.trim() || defaultSteps[i].description,
        }))
      : defaultSteps;

  const pick = (field: string, i18nKey: string) => str(cms?.[field])?.trim() || t(i18nKey);

  return {
    title: pick("title", "process.title"),
    titleHighlight: pick("titleHighlight", "process.titleHighlight"),
    subtitle: pick("subtitle", "process.subtitle"),
    steps,
  };
}

export type ResolvedServicesSection = {
  title: string;
  titleHighlight: string;
  subtitle: string;
};

export function resolveServicesSectionContent(
  data: SiteContentData | undefined,
  lang: Language,
  t: TFn,
): ResolvedServicesSection {
  const ru = data?.services as Record<string, unknown> | undefined;
  const en = data?.servicesEn as Record<string, unknown> | undefined;
  const cms = cmsBlock(lang, ru, en);
  const pick = (field: string, i18nKey: string) => str(cms?.[field])?.trim() || t(i18nKey);
  return {
    title: pick("title", "services.title"),
    titleHighlight: pick("titleHighlight", "services.titleHighlight"),
    subtitle: pick("subtitle", "services.subtitle"),
  };
}

export type ResolvedCta = {
  title: string;
  titleHighlight: string;
  subtitle: string;
};

export function resolveCtaContent(
  data: SiteContentData | undefined,
  lang: Language,
  t: TFn,
): ResolvedCta {
  const ru = data?.cta as Record<string, unknown> | undefined;
  const en = data?.ctaEn as Record<string, unknown> | undefined;
  const cms = cmsBlock(lang, ru, en);
  const pick = (field: string, i18nKey: string) => str(cms?.[field])?.trim() || t(i18nKey);
  return {
    title: pick("title", "cta.title"),
    titleHighlight: pick("titleHighlight", "cta.titleHighlight"),
    subtitle: pick("subtitle", "cta.subtitle"),
  };
}

export type ResolvedContacts = {
  telegramUrl: string;
  maxUrl: string;
};

export function resolveContactsContent(data: SiteContentData | undefined): ResolvedContacts {
  const c = data?.contacts as Record<string, unknown> | undefined;
  return {
    telegramUrl: str(c?.telegramUrl)?.trim() || DEFAULT_TELEGRAM_URL,
    maxUrl: str(c?.maxUrl)?.trim() || DEFAULT_MAX_URL,
  };
}
