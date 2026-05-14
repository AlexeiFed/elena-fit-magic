/**
 * Слияние услуг из API с i18n для карточек и модалки.
 */
import type { Service, ServicesData } from "@/lib/api";
import type { ServiceDetailData } from "@/components/serviceDetails";
import type { Language } from "@/contexts/i18n-types";

type TFn = (key: string, params?: Record<string, string | number>) => string;

/** ID → префикс ключей i18n для фолбэков */
export const SERVICE_I18N_PREFIX: Record<string, string> = {
  ПРЕМИУМ: "services.premium",
  "БАЗОВЫЙ ФОРМАТ": "services.basic",
  "МИНИ-ГРУППА": "services.miniGroup",
  "СОПРОВОЖДЕНИЕ С КУРАТОРОМ": "services.curator",
  СТАРТ: "services.start",
  ТРАНСФОРМАЦИЯ: "services.transformation",
};

export function buildServiceMap(data: ServicesData | undefined): Map<string, Service> {
  const m = new Map<string, Service>();
  for (const c of data?.categories ?? []) {
    for (const s of c.services) m.set(s.id, s);
  }
  return m;
}

function i18nFeatureList(t: TFn, prefix: string): string[] {
  const out: string[] = [];
  for (let i = 1; i <= 12; i++) {
    const k = `${prefix}.feature${i}`;
    const v = t(k);
    if (v === k) break;
    out.push(v);
  }
  return out;
}

function isDetailsPayload(v: unknown): v is ServiceDetailData {
  if (!v || typeof v !== "object") return false;
  const o = v as Record<string, unknown>;
  const p = o.pricing as Record<string, unknown> | undefined;
  return (
    typeof o.title === "string" &&
    typeof o.subtitle === "string" &&
    Array.isArray(o.sections) &&
    typeof p?.label === "string" &&
    Array.isArray(p?.options)
  );
}

function hasText(v: unknown): boolean {
  if (typeof v === "string") return v.trim().length > 0;
  if (Array.isArray(v)) return v.some(hasText);
  if (v && typeof v === "object") return Object.values(v).some(hasText);
  return false;
}

export function resolveServiceForCard(
  id: string,
  lang: Language,
  t: TFn,
  api: Service | undefined,
): {
  id: string;
  title: string;
  subtitle: string;
  features: string[];
  detailFromApi: ServiceDetailData | null;
} {
  const prefix = SERVICE_I18N_PREFIX[id];

  const title =
    lang === "en"
      ? api?.titleEn?.trim() || (prefix ? t(`${prefix}.title`) : "")
      : api?.title?.trim() || (prefix ? t(`${prefix}.title`) : "");

  const subtitle =
    lang === "en"
      ? api?.subtitleEn?.trim() || (prefix ? t(`${prefix}.subtitle`) : "")
      : api?.subtitle?.trim() || (prefix ? t(`${prefix}.subtitle`) : "");

  const cmsFeatures =
    lang === "en"
      ? api?.featuresEn?.filter((f) => f.trim())
      : api?.features?.filter((f) => f.trim());

  const features = cmsFeatures?.length ? cmsFeatures : prefix ? i18nFeatureList(t, prefix) : [];

  const rawDetails = lang === "en" ? api?.detailsEn : api?.details;
  const detailFromApi = isDetailsPayload(rawDetails) && hasText(rawDetails) ? rawDetails : null;

  return { id, title, subtitle, features, detailFromApi };
}
