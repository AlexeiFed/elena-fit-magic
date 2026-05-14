/**
 * ContentEditor — редактор текстов секций сайта в админ-панели.
 * Позволяет редактировать тексты Hero, About, Process, Services (заголовки),
 * CTA и контактные ссылки. Данные сохраняются в site-content.json через PHP API.
 */
import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  Save, Plus, Trash2, ChevronDown, ChevronRight, Check, X } from "@/components/icons";
import { useSiteContent, QUERY_KEYS } from "@/hooks/useSiteData";
import { saveSiteContent } from "@/lib/api";
import type { SiteContentData } from "@/lib/api";
import { cn } from "@/lib/utils";

/* ===== Типы для локального редактирования ===== */

interface AboutFeature {
  icon: string;
  title: string;
  description: string;
}

interface ProcessStep {
  title: string;
  description: string;
}

interface HeroBlock {
  title: string;
  titleHighlight: string;
  subtitle: string;
  cta: string;
  stats: { clients: string; successRate: string };
}

interface AboutBlock {
  title: string;
  titleHighlight: string;
  subtitle: string;
  descriptions: string[];
  regalia: string[];
  features: AboutFeature[];
}

interface ProcessBlock {
  title: string;
  titleHighlight: string;
  subtitle: string;
  steps: ProcessStep[];
}

interface ServicesBlock {
  title: string;
  titleHighlight: string;
  subtitle: string;
}

interface CtaBlock {
  title: string;
  titleHighlight: string;
  subtitle: string;
}

interface ContactsBlock {
  telegramUrl: string;
  maxUrl: string;
}

interface LocalContentData {
  hero: HeroBlock;
  heroEn?: Partial<HeroBlock>;
  about: AboutBlock;
  aboutEn?: Partial<AboutBlock>;
  process: ProcessBlock;
  processEn?: Partial<ProcessBlock>;
  services: ServicesBlock;
  servicesEn?: Partial<ServicesBlock>;
  cta: CtaBlock;
  ctaEn?: Partial<CtaBlock>;
  contacts: ContactsBlock;
}

/** Иконки доступные для About features */
const AVAILABLE_ICONS = ["Heart", "Zap", "Apple", "Target", "Shield", "Trophy", "Star", "Users"];

export const ContentEditor = () => {
  const queryClient = useQueryClient();
  const { data: serverData, isLoading, isPlaceholderData } = useSiteContent();

  /* Локальное состояние */
  const [localData, setLocalData] = useState<LocalContentData | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");
  const [initialized, setInitialized] = useState(false);

  /* UI — какие секции развёрнуты */
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(["hero", "about", "process", "services", "cta", "contacts"]),
  );

  /* Синхронизация серверных данных — только реальные, не placeholder */
  useEffect(() => {
    if (serverData && !isPlaceholderData && !initialized) {
      setLocalData(serverData as unknown as LocalContentData);
      setInitialized(true);
    }
  }, [serverData, isPlaceholderData, initialized]);

  const hasChanges = localData && JSON.stringify(localData) !== JSON.stringify(serverData);

  /** Сохранение данных на сервер */
  const handleSave = async () => {
    if (!localData) return;
    setSaving(true);
    setSaveStatus("idle");
    try {
      await saveSiteContent(localData as unknown as SiteContentData);
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.siteContent });
      setSaveStatus("success");
      setTimeout(() => setSaveStatus("idle"), 2000);
    } catch {
      setSaveStatus("error");
    } finally {
      setSaving(false);
    }
  };

  /** Toggle секции */
  const toggleSection = (id: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  /* ===== Хелперы обновления ===== */

  /** Обновить вложенный объект */
  const update = <K extends keyof LocalContentData>(
    section: K,
    updates: Partial<LocalContentData[K]>,
  ) => {
    if (!localData) return;
    setLocalData({
      ...localData,
      [section]: { ...localData[section], ...updates },
    });
  };

  const mergeEn = (
    enKey: "heroEn" | "aboutEn" | "processEn" | "servicesEn" | "ctaEn",
    patch: Record<string, unknown>,
  ) => {
    if (!localData) return;
    const prev = (localData[enKey] as Record<string, unknown> | undefined) ?? {};
    setLocalData({
      ...localData,
      [enKey]: { ...prev, ...patch },
    });
  };

  /* ===== Рендер ===== */

  if (isLoading && !localData) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!localData) return null;

  /** Компонент секции с аккордеоном */
  const Section = ({ id, title, children }: { id: string; title: string; children: React.ReactNode }) => (
    <div className="rounded-xl border border-border/50 bg-card/50 overflow-hidden">
      <div
        className="flex items-center gap-3 px-4 py-3 bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors"
        onClick={() => toggleSection(id)}
      >
        {expandedSections.has(id) ? (
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        )}
        <span className="font-semibold text-sm">{title}</span>
      </div>
      {expandedSections.has(id) && (
        <div className="p-4 space-y-3">{children}</div>
      )}
    </div>
  );

  /** Компонент текстового поля */
  const Field = ({
    label,
    value,
    onChange,
    multiline = false,
    placeholder = "",
  }: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    multiline?: boolean;
    placeholder?: string;
  }) => (
    <div>
      <label className="text-xs text-muted-foreground mb-1 block">{label}</label>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={3}
          className="w-full px-3 py-1.5 text-sm rounded-md border border-border/50 bg-background focus:outline-none focus:ring-1 focus:ring-primary/30 resize-none"
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-3 py-1.5 text-sm rounded-md border border-border/50 bg-background focus:outline-none focus:ring-1 focus:ring-primary/30"
        />
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Кнопка сохранения */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={saving || !hasChanges}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
            hasChanges
              ? "bg-primary text-primary-foreground hover:bg-primary/90"
              : "bg-muted text-muted-foreground cursor-not-allowed",
          )}
        >
          <Save className="w-4 h-4" />
          {saving ? "Сохранение..." : "Сохранить"}
        </button>
        {saveStatus === "success" && (
          <span className="text-sm text-green-600 flex items-center gap-1">
            <Check className="w-4 h-4" /> Сохранено
          </span>
        )}
        {saveStatus === "error" && (
          <span className="text-sm text-destructive">Ошибка сохранения</span>
        )}
        {hasChanges && (
          <span className="text-xs text-amber-600">Есть несохранённые изменения</span>
        )}
      </div>

      {/* ===== Hero ===== */}
      <Section id="hero" title="Hero (главный экран)">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Field
            label="Заголовок"
            value={localData.hero?.title ?? ""}
            onChange={(v) => update("hero", { title: v })}
          />
          <Field
            label="Выделенная часть заголовка"
            value={localData.hero?.titleHighlight ?? ""}
            onChange={(v) => update("hero", { titleHighlight: v })}
          />
        </div>
        <Field
          label="Подзаголовок"
          value={localData.hero?.subtitle ?? ""}
          onChange={(v) => update("hero", { subtitle: v })}
          multiline
        />
        <Field
          label="Текст кнопки CTA"
          value={localData.hero?.cta ?? ""}
          onChange={(v) => update("hero", { cta: v })}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Field
            label="Статистика: клиенты"
            value={localData.hero?.stats?.clients ?? ""}
            onChange={(v) => update("hero", { stats: { ...localData.hero.stats, clients: v } })}
            placeholder="300+"
          />
          <Field
            label="Статистика: успех"
            value={localData.hero?.stats?.successRate ?? ""}
            onChange={(v) => update("hero", { stats: { ...localData.hero.stats, successRate: v } })}
            placeholder="98%"
          />
        </div>
        <div className="pt-4 mt-2 border-t border-border/30 space-y-3">
          <p className="text-xs font-medium text-muted-foreground">English (опционально, для переключателя EN на сайте)</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Field
              label="Title"
              value={localData.heroEn?.title ?? ""}
              onChange={(v) => mergeEn("heroEn", { title: v })}
            />
            <Field
              label="Title highlight"
              value={localData.heroEn?.titleHighlight ?? ""}
              onChange={(v) => mergeEn("heroEn", { titleHighlight: v })}
            />
          </div>
          <Field
            label="Subtitle"
            value={localData.heroEn?.subtitle ?? ""}
            onChange={(v) => mergeEn("heroEn", { subtitle: v })}
            multiline
          />
          <Field
            label="CTA button"
            value={localData.heroEn?.cta ?? ""}
            onChange={(v) => mergeEn("heroEn", { cta: v })}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Field
              label="Stats: clients"
              value={localData.heroEn?.stats?.clients ?? ""}
              onChange={(v) =>
                mergeEn("heroEn", {
                  stats: { ...(localData.heroEn?.stats ?? {}), clients: v },
                })
              }
              placeholder="300+"
            />
            <Field
              label="Stats: success"
              value={localData.heroEn?.stats?.successRate ?? ""}
              onChange={(v) =>
                mergeEn("heroEn", {
                  stats: { ...(localData.heroEn?.stats ?? {}), successRate: v },
                })
              }
              placeholder="98%"
            />
          </div>
        </div>
      </Section>

      {/* ===== About ===== */}
      <Section id="about" title="О себе (About)">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Field
            label="Заголовок"
            value={localData.about?.title ?? ""}
            onChange={(v) => update("about", { title: v })}
          />
          <Field
            label="Выделенная часть"
            value={localData.about?.titleHighlight ?? ""}
            onChange={(v) => update("about", { titleHighlight: v })}
          />
        </div>
        <Field
          label="Подзаголовок"
          value={localData.about?.subtitle ?? ""}
          onChange={(v) => update("about", { subtitle: v })}
        />

        {/* Описания */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs text-muted-foreground font-medium">Описания (абзацы)</label>
            <button
              onClick={() => update("about", { descriptions: [...(localData.about?.descriptions ?? []), ""] })}
              className="text-xs text-primary hover:text-primary/80 flex items-center gap-1"
            >
              <Plus className="w-3 h-3" /> Добавить
            </button>
          </div>
          <div className="space-y-2">
            {(localData.about?.descriptions ?? []).map((desc, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <textarea
                  value={desc}
                  onChange={(e) => {
                    const descs = [...(localData.about?.descriptions ?? [])];
                    descs[idx] = e.target.value;
                    update("about", { descriptions: descs });
                  }}
                  rows={2}
                  className="flex-1 px-3 py-1.5 text-sm rounded-md border border-border/50 bg-background focus:outline-none focus:ring-1 focus:ring-primary/30 resize-none"
                />
                <button
                  onClick={() => {
                    const descs = (localData.about?.descriptions ?? []).filter((_, i) => i !== idx);
                    update("about", { descriptions: descs });
                  }}
                  className="p-1 mt-1 text-destructive/50 hover:text-destructive"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Регалии */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs text-muted-foreground font-medium">Регалии</label>
            <button
              onClick={() => update("about", { regalia: [...(localData.about?.regalia ?? []), ""] })}
              className="text-xs text-primary hover:text-primary/80 flex items-center gap-1"
            >
              <Plus className="w-3 h-3" /> Добавить
            </button>
          </div>
          <div className="space-y-1.5">
            {(localData.about?.regalia ?? []).map((reg, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="text"
                  value={reg}
                  onChange={(e) => {
                    const regs = [...(localData.about?.regalia ?? [])];
                    regs[idx] = e.target.value;
                    update("about", { regalia: regs });
                  }}
                  className="flex-1 px-3 py-1.5 text-sm rounded-md border border-border/50 bg-background focus:outline-none focus:ring-1 focus:ring-primary/30"
                />
                <button
                  onClick={() => {
                    const regs = (localData.about?.regalia ?? []).filter((_, i) => i !== idx);
                    update("about", { regalia: regs });
                  }}
                  className="p-1 text-destructive/50 hover:text-destructive"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Features */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs text-muted-foreground font-medium">Преимущества (карточки)</label>
            <button
              onClick={() =>
                update("about", {
                  features: [...(localData.about?.features ?? []), { icon: "Heart", title: "", description: "" }],
                })
              }
              className="text-xs text-primary hover:text-primary/80 flex items-center gap-1"
            >
              <Plus className="w-3 h-3" /> Добавить
            </button>
          </div>
          <div className="space-y-3">
            {(localData.about?.features ?? []).map((feat, idx) => (
              <div key={idx} className="rounded-md border border-border/30 bg-muted/20 p-3 space-y-2">
                <div className="flex items-center gap-2">
                  <select
                    value={feat.icon}
                    onChange={(e) => {
                      const feats = [...(localData.about?.features ?? [])];
                      feats[idx] = { ...feats[idx], icon: e.target.value };
                      update("about", { features: feats });
                    }}
                    className="px-2 py-1 text-xs rounded border border-border/50 bg-background"
                  >
                    {AVAILABLE_ICONS.map((icon) => (
                      <option key={icon} value={icon}>{icon}</option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={feat.title}
                    onChange={(e) => {
                      const feats = [...(localData.about?.features ?? [])];
                      feats[idx] = { ...feats[idx], title: e.target.value };
                      update("about", { features: feats });
                    }}
                    placeholder="Название"
                    className="flex-1 px-2.5 py-1 text-xs rounded border border-border/50 bg-background focus:outline-none focus:ring-1 focus:ring-primary/30"
                  />
                  <button
                    onClick={() => {
                      const feats = (localData.about?.features ?? []).filter((_, i) => i !== idx);
                      update("about", { features: feats });
                    }}
                    className="p-1 text-destructive/50 hover:text-destructive"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
                <textarea
                  value={feat.description}
                  onChange={(e) => {
                    const feats = [...(localData.about?.features ?? [])];
                    feats[idx] = { ...feats[idx], description: e.target.value };
                    update("about", { features: feats });
                  }}
                  placeholder="Описание..."
                  rows={2}
                  className="w-full px-2.5 py-1 text-xs rounded border border-border/50 bg-background focus:outline-none focus:ring-1 focus:ring-primary/30 resize-none"
                />
              </div>
            ))}
          </div>
        </div>
        <div className="pt-4 mt-2 border-t border-border/30 space-y-3">
          <p className="text-xs font-medium text-muted-foreground">English — About (опционально)</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Field
              label="Title"
              value={localData.aboutEn?.title ?? ""}
              onChange={(v) => mergeEn("aboutEn", { title: v })}
            />
            <Field
              label="Title highlight"
              value={localData.aboutEn?.titleHighlight ?? ""}
              onChange={(v) => mergeEn("aboutEn", { titleHighlight: v })}
            />
          </div>
          <Field
            label="Subtitle"
            value={localData.aboutEn?.subtitle ?? ""}
            onChange={(v) => mergeEn("aboutEn", { subtitle: v })}
          />
        </div>
      </Section>

      {/* ===== Process ===== */}
      <Section id="process" title="Процесс (шаги)">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Field
            label="Заголовок"
            value={localData.process?.title ?? ""}
            onChange={(v) => update("process", { title: v })}
          />
          <Field
            label="Выделенная часть"
            value={localData.process?.titleHighlight ?? ""}
            onChange={(v) => update("process", { titleHighlight: v })}
          />
        </div>
        <Field
          label="Подзаголовок"
          value={localData.process?.subtitle ?? ""}
          onChange={(v) => update("process", { subtitle: v })}
        />

        {/* Шаги */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs text-muted-foreground font-medium">Шаги</label>
            <button
              onClick={() =>
                update("process", {
                  steps: [...(localData.process?.steps ?? []), { title: "", description: "" }],
                })
              }
              className="text-xs text-primary hover:text-primary/80 flex items-center gap-1"
            >
              <Plus className="w-3 h-3" /> Добавить шаг
            </button>
          </div>
          <div className="space-y-2">
            {(localData.process?.steps ?? []).map((step, idx) => (
              <div key={idx} className="flex items-start gap-2 rounded-md border border-border/30 bg-muted/20 p-2.5">
                <span className="text-xs font-bold text-primary mt-1.5 w-5 text-center flex-shrink-0">{idx + 1}</span>
                <div className="flex-1 space-y-1.5">
                  <input
                    type="text"
                    value={step.title}
                    onChange={(e) => {
                      const steps = [...(localData.process?.steps ?? [])];
                      steps[idx] = { ...steps[idx], title: e.target.value };
                      update("process", { steps });
                    }}
                    placeholder="Название шага"
                    className="w-full px-2.5 py-1 text-xs font-medium rounded border border-border/50 bg-background focus:outline-none focus:ring-1 focus:ring-primary/30"
                  />
                  <input
                    type="text"
                    value={step.description}
                    onChange={(e) => {
                      const steps = [...(localData.process?.steps ?? [])];
                      steps[idx] = { ...steps[idx], description: e.target.value };
                      update("process", { steps });
                    }}
                    placeholder="Описание шага"
                    className="w-full px-2.5 py-1 text-xs rounded border border-border/50 bg-background focus:outline-none focus:ring-1 focus:ring-primary/30"
                  />
                </div>
                <button
                  onClick={() => {
                    const steps = (localData.process?.steps ?? []).filter((_, i) => i !== idx);
                    update("process", { steps });
                  }}
                  className="p-1 mt-1 text-destructive/50 hover:text-destructive"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="pt-4 mt-2 border-t border-border/30 space-y-3">
          <p className="text-xs font-medium text-muted-foreground">English — Process (опционально)</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Field
              label="Title"
              value={localData.processEn?.title ?? ""}
              onChange={(v) => mergeEn("processEn", { title: v })}
            />
            <Field
              label="Title highlight"
              value={localData.processEn?.titleHighlight ?? ""}
              onChange={(v) => mergeEn("processEn", { titleHighlight: v })}
            />
          </div>
          <Field
            label="Subtitle"
            value={localData.processEn?.subtitle ?? ""}
            onChange={(v) => mergeEn("processEn", { subtitle: v })}
          />
        </div>
      </Section>

      {/* ===== Services заголовки ===== */}
      <Section id="services" title="Услуги (заголовки секции)">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Field
            label="Заголовок"
            value={localData.services?.title ?? ""}
            onChange={(v) => update("services", { title: v })}
          />
          <Field
            label="Выделенная часть"
            value={localData.services?.titleHighlight ?? ""}
            onChange={(v) => update("services", { titleHighlight: v })}
          />
        </div>
        <Field
          label="Подзаголовок"
          value={localData.services?.subtitle ?? ""}
          onChange={(v) => update("services", { subtitle: v })}
        />
        <div className="pt-4 mt-2 border-t border-border/30 space-y-3">
          <p className="text-xs font-medium text-muted-foreground">English — Services section (опционально)</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Field
              label="Title"
              value={localData.servicesEn?.title ?? ""}
              onChange={(v) => mergeEn("servicesEn", { title: v })}
            />
            <Field
              label="Title highlight"
              value={localData.servicesEn?.titleHighlight ?? ""}
              onChange={(v) => mergeEn("servicesEn", { titleHighlight: v })}
            />
          </div>
          <Field
            label="Subtitle"
            value={localData.servicesEn?.subtitle ?? ""}
            onChange={(v) => mergeEn("servicesEn", { subtitle: v })}
          />
        </div>
      </Section>

      {/* ===== CTA ===== */}
      <Section id="cta" title="CTA (призыв к действию)">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Field
            label="Заголовок"
            value={localData.cta?.title ?? ""}
            onChange={(v) => update("cta", { title: v })}
          />
          <Field
            label="Выделенная часть"
            value={localData.cta?.titleHighlight ?? ""}
            onChange={(v) => update("cta", { titleHighlight: v })}
          />
        </div>
        <Field
          label="Подзаголовок"
          value={localData.cta?.subtitle ?? ""}
          onChange={(v) => update("cta", { subtitle: v })}
          multiline
        />
        <div className="pt-4 mt-2 border-t border-border/30 space-y-3">
          <p className="text-xs font-medium text-muted-foreground">English — CTA (опционально)</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Field
              label="Title"
              value={localData.ctaEn?.title ?? ""}
              onChange={(v) => mergeEn("ctaEn", { title: v })}
            />
            <Field
              label="Title highlight"
              value={localData.ctaEn?.titleHighlight ?? ""}
              onChange={(v) => mergeEn("ctaEn", { titleHighlight: v })}
            />
          </div>
          <Field
            label="Subtitle"
            value={localData.ctaEn?.subtitle ?? ""}
            onChange={(v) => mergeEn("ctaEn", { subtitle: v })}
            multiline
          />
        </div>
      </Section>

      {/* ===== Contacts ===== */}
      <Section id="contacts" title="Контакты (ссылки)">
        <Field
          label="Telegram URL"
          value={localData.contacts?.telegramUrl ?? ""}
          onChange={(v) => update("contacts", { telegramUrl: v })}
          placeholder="https://t.me/..."
        />
        <Field
          label="Max URL"
          value={localData.contacts?.maxUrl ?? ""}
          onChange={(v) => update("contacts", { maxUrl: v })}
          placeholder="https://max.ru/u/..."
        />
      </Section>
    </div>
  );
};
