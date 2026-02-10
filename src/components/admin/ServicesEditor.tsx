/**
 * ServicesEditor — редактор услуг в админ-панели.
 * Позволяет редактировать категории, услуги, фичи карточек,
 * детальную информацию (модальное окно), цены и доп. услуги.
 * Данные сохраняются в services.json через PHP API.
 */
import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  Save,
  Plus,
  Trash2,
  GripVertical,
  ChevronDown,
  ChevronRight,
  Star,
  Pencil,
  X,
  Check,
} from "lucide-react";
import { useServices, QUERY_KEYS } from "@/hooks/useSiteData";
import { saveServices } from "@/lib/api";
import type { ServicesData } from "@/lib/api";
import { cn } from "@/lib/utils";

/* ===== Типы для локального редактирования ===== */

interface ServiceSection {
  title: string;
  items: string[];
}

interface ServicePricing {
  label: string;
  options: string[];
}

interface ServiceDetails {
  title: string;
  subtitle: string;
  description?: string;
  sections: ServiceSection[];
  pricing: ServicePricing;
  extras?: string[];
}

interface ServiceItem {
  id: string;
  title: string;
  subtitle: string;
  features: string[];
  details?: ServiceDetails;
  order: number;
}

interface ServiceCategory {
  id: string;
  title: string;
  services: ServiceItem[];
}

interface LocalServicesData {
  featuredId: string;
  categories: ServiceCategory[];
}

/** Генерация уникального ID */
const generateId = () => `svc_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;

export const ServicesEditor = () => {
  const queryClient = useQueryClient();
  const { data: serverData, isLoading, isPlaceholderData } = useServices();

  /* Локальное состояние */
  const [localData, setLocalData] = useState<LocalServicesData | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");
  const [initialized, setInitialized] = useState(false);

  /* UI состояние — какие секции развёрнуты */
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [expandedServices, setExpandedServices] = useState<Set<string>>(new Set());
  const [expandedDetails, setExpandedDetails] = useState<Set<string>>(new Set());

  /* Синхронизация серверных данных — только реальные, не placeholder */
  useEffect(() => {
    if (serverData && !isPlaceholderData && !initialized) {
      setLocalData(serverData as unknown as LocalServicesData);
      setInitialized(true);
      /* Развернуть все категории по умолчанию */
      const cats = (serverData as unknown as LocalServicesData).categories?.map((c) => c.id) ?? [];
      setExpandedCategories(new Set(cats));
    }
  }, [serverData, isPlaceholderData, initialized]);

  const hasChanges = localData && JSON.stringify(localData) !== JSON.stringify(serverData);

  /** Сохранение данных на сервер */
  const handleSave = async () => {
    if (!localData) return;
    setSaving(true);
    setSaveStatus("idle");
    try {
      await saveServices(localData as unknown as ServicesData);
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.services });
      setSaveStatus("success");
      setTimeout(() => setSaveStatus("idle"), 2000);
    } catch {
      setSaveStatus("error");
    } finally {
      setSaving(false);
    }
  };

  /* ===== Хелперы для обновления вложенных данных ===== */

  /** Обновить категорию */
  const updateCategory = (catId: string, updates: Partial<ServiceCategory>) => {
    if (!localData) return;
    setLocalData({
      ...localData,
      categories: localData.categories.map((c) =>
        c.id === catId ? { ...c, ...updates } : c,
      ),
    });
  };

  /** Обновить услугу внутри категории */
  const updateService = (catId: string, svcId: string, updates: Partial<ServiceItem>) => {
    if (!localData) return;
    setLocalData({
      ...localData,
      categories: localData.categories.map((c) =>
        c.id === catId
          ? {
              ...c,
              services: c.services.map((s) =>
                s.id === svcId ? { ...s, ...updates } : s,
              ),
            }
          : c,
      ),
    });
  };

  /** Добавить услугу в категорию */
  const addService = (catId: string) => {
    if (!localData) return;
    const cat = localData.categories.find((c) => c.id === catId);
    if (!cat) return;
    const maxOrder = cat.services.length > 0
      ? Math.max(...cat.services.map((s) => s.order))
      : -1;
    const newSvc: ServiceItem = {
      id: generateId(),
      title: "Новая услуга",
      subtitle: "",
      features: [],
      order: maxOrder + 1,
    };
    updateCategory(catId, { services: [...cat.services, newSvc] });
    /* Развернуть новую услугу */
    setExpandedServices((prev) => new Set([...prev, newSvc.id]));
  };

  /** Удалить услугу */
  const removeService = (catId: string, svcId: string) => {
    if (!localData) return;
    const cat = localData.categories.find((c) => c.id === catId);
    if (!cat) return;
    updateCategory(catId, { services: cat.services.filter((s) => s.id !== svcId) });
  };

  /** Переместить услугу вверх/вниз */
  const moveService = (catId: string, svcId: string, direction: "up" | "down") => {
    if (!localData) return;
    const cat = localData.categories.find((c) => c.id === catId);
    if (!cat) return;
    const sorted = [...cat.services].sort((a, b) => a.order - b.order);
    const idx = sorted.findIndex((s) => s.id === svcId);
    if (idx < 0) return;
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= sorted.length) return;
    const temp = sorted[idx].order;
    sorted[idx] = { ...sorted[idx], order: sorted[swapIdx].order };
    sorted[swapIdx] = { ...sorted[swapIdx], order: temp };
    updateCategory(catId, { services: sorted });
  };

  /** Добавить фичу к услуге */
  const addFeature = (catId: string, svcId: string) => {
    if (!localData) return;
    const cat = localData.categories.find((c) => c.id === catId);
    const svc = cat?.services.find((s) => s.id === svcId);
    if (!svc) return;
    updateService(catId, svcId, { features: [...svc.features, ""] });
  };

  /** Обновить фичу */
  const updateFeature = (catId: string, svcId: string, featureIdx: number, value: string) => {
    if (!localData) return;
    const cat = localData.categories.find((c) => c.id === catId);
    const svc = cat?.services.find((s) => s.id === svcId);
    if (!svc) return;
    const features = [...svc.features];
    features[featureIdx] = value;
    updateService(catId, svcId, { features });
  };

  /** Удалить фичу */
  const removeFeature = (catId: string, svcId: string, featureIdx: number) => {
    if (!localData) return;
    const cat = localData.categories.find((c) => c.id === catId);
    const svc = cat?.services.find((s) => s.id === svcId);
    if (!svc) return;
    updateService(catId, svcId, { features: svc.features.filter((_, i) => i !== featureIdx) });
  };

  /** Установить featured */
  const setFeatured = (svcId: string) => {
    if (!localData) return;
    setLocalData({
      ...localData,
      featuredId: localData.featuredId === svcId ? "" : svcId,
    });
  };

  /** Добавить категорию */
  const addCategory = () => {
    if (!localData) return;
    const newCat: ServiceCategory = {
      id: generateId(),
      title: "Новая категория",
      services: [],
    };
    setLocalData({
      ...localData,
      categories: [...localData.categories, newCat],
    });
    setExpandedCategories((prev) => new Set([...prev, newCat.id]));
  };

  /** Удалить категорию */
  const removeCategory = (catId: string) => {
    if (!localData) return;
    setLocalData({
      ...localData,
      categories: localData.categories.filter((c) => c.id !== catId),
    });
  };

  /* ===== Хелперы для details ===== */

  /** Инициализировать details если нет */
  const ensureDetails = (catId: string, svcId: string) => {
    if (!localData) return;
    const cat = localData.categories.find((c) => c.id === catId);
    const svc = cat?.services.find((s) => s.id === svcId);
    if (!svc || svc.details) return;
    updateService(catId, svcId, {
      details: {
        title: svc.title,
        subtitle: "",
        sections: [],
        pricing: { label: "Инвестиция:", options: [] },
      },
    });
  };

  /** Обновить поле details */
  const updateDetails = (catId: string, svcId: string, updates: Partial<ServiceDetails>) => {
    if (!localData) return;
    const cat = localData.categories.find((c) => c.id === catId);
    const svc = cat?.services.find((s) => s.id === svcId);
    if (!svc?.details) return;
    updateService(catId, svcId, { details: { ...svc.details, ...updates } });
  };

  /** Добавить секцию в details */
  const addDetailSection = (catId: string, svcId: string) => {
    if (!localData) return;
    const cat = localData.categories.find((c) => c.id === catId);
    const svc = cat?.services.find((s) => s.id === svcId);
    if (!svc?.details) return;
    updateDetails(catId, svcId, {
      sections: [...svc.details.sections, { title: "", items: [] }],
    });
  };

  /** Обновить секцию details */
  const updateDetailSection = (catId: string, svcId: string, secIdx: number, updates: Partial<ServiceSection>) => {
    if (!localData) return;
    const cat = localData.categories.find((c) => c.id === catId);
    const svc = cat?.services.find((s) => s.id === svcId);
    if (!svc?.details) return;
    const sections = [...svc.details.sections];
    sections[secIdx] = { ...sections[secIdx], ...updates };
    updateDetails(catId, svcId, { sections });
  };

  /** Удалить секцию details */
  const removeDetailSection = (catId: string, svcId: string, secIdx: number) => {
    if (!localData) return;
    const cat = localData.categories.find((c) => c.id === catId);
    const svc = cat?.services.find((s) => s.id === svcId);
    if (!svc?.details) return;
    updateDetails(catId, svcId, {
      sections: svc.details.sections.filter((_, i) => i !== secIdx),
    });
  };

  /** Добавить пункт в секцию details */
  const addDetailSectionItem = (catId: string, svcId: string, secIdx: number) => {
    if (!localData) return;
    const cat = localData.categories.find((c) => c.id === catId);
    const svc = cat?.services.find((s) => s.id === svcId);
    if (!svc?.details) return;
    const sections = [...svc.details.sections];
    sections[secIdx] = { ...sections[secIdx], items: [...sections[secIdx].items, ""] };
    updateDetails(catId, svcId, { sections });
  };

  /** Обновить пункт секции details */
  const updateDetailSectionItem = (catId: string, svcId: string, secIdx: number, itemIdx: number, value: string) => {
    if (!localData) return;
    const cat = localData.categories.find((c) => c.id === catId);
    const svc = cat?.services.find((s) => s.id === svcId);
    if (!svc?.details) return;
    const sections = [...svc.details.sections];
    const items = [...sections[secIdx].items];
    items[itemIdx] = value;
    sections[secIdx] = { ...sections[secIdx], items };
    updateDetails(catId, svcId, { sections });
  };

  /** Удалить пункт секции details */
  const removeDetailSectionItem = (catId: string, svcId: string, secIdx: number, itemIdx: number) => {
    if (!localData) return;
    const cat = localData.categories.find((c) => c.id === catId);
    const svc = cat?.services.find((s) => s.id === svcId);
    if (!svc?.details) return;
    const sections = [...svc.details.sections];
    sections[secIdx] = { ...sections[secIdx], items: sections[secIdx].items.filter((_, i) => i !== itemIdx) };
    updateDetails(catId, svcId, { sections });
  };

  /** Добавить вариант цены */
  const addPricingOption = (catId: string, svcId: string) => {
    if (!localData) return;
    const cat = localData.categories.find((c) => c.id === catId);
    const svc = cat?.services.find((s) => s.id === svcId);
    if (!svc?.details) return;
    updateDetails(catId, svcId, {
      pricing: { ...svc.details.pricing, options: [...svc.details.pricing.options, ""] },
    });
  };

  /** Обновить вариант цены */
  const updatePricingOption = (catId: string, svcId: string, optIdx: number, value: string) => {
    if (!localData) return;
    const cat = localData.categories.find((c) => c.id === catId);
    const svc = cat?.services.find((s) => s.id === svcId);
    if (!svc?.details) return;
    const options = [...svc.details.pricing.options];
    options[optIdx] = value;
    updateDetails(catId, svcId, { pricing: { ...svc.details.pricing, options } });
  };

  /** Удалить вариант цены */
  const removePricingOption = (catId: string, svcId: string, optIdx: number) => {
    if (!localData) return;
    const cat = localData.categories.find((c) => c.id === catId);
    const svc = cat?.services.find((s) => s.id === svcId);
    if (!svc?.details) return;
    updateDetails(catId, svcId, {
      pricing: { ...svc.details.pricing, options: svc.details.pricing.options.filter((_, i) => i !== optIdx) },
    });
  };

  /** Добавить доп. услугу */
  const addExtra = (catId: string, svcId: string) => {
    if (!localData) return;
    const cat = localData.categories.find((c) => c.id === catId);
    const svc = cat?.services.find((s) => s.id === svcId);
    if (!svc?.details) return;
    updateDetails(catId, svcId, { extras: [...(svc.details.extras ?? []), ""] });
  };

  /** Обновить доп. услугу */
  const updateExtra = (catId: string, svcId: string, extIdx: number, value: string) => {
    if (!localData) return;
    const cat = localData.categories.find((c) => c.id === catId);
    const svc = cat?.services.find((s) => s.id === svcId);
    if (!svc?.details) return;
    const extras = [...(svc.details.extras ?? [])];
    extras[extIdx] = value;
    updateDetails(catId, svcId, { extras });
  };

  /** Удалить доп. услугу */
  const removeExtra = (catId: string, svcId: string, extIdx: number) => {
    if (!localData) return;
    const cat = localData.categories.find((c) => c.id === catId);
    const svc = cat?.services.find((s) => s.id === svcId);
    if (!svc?.details) return;
    updateDetails(catId, svcId, { extras: (svc.details.extras ?? []).filter((_, i) => i !== extIdx) });
  };

  /* ===== Toggle хелперы ===== */
  const toggleCategory = (id: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const toggleService = (id: string) => {
    setExpandedServices((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const toggleDetails = (id: string) => {
    setExpandedDetails((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
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

      {/* Категории */}
      {localData.categories.map((cat) => (
        <div key={cat.id} className="rounded-xl border border-border/50 bg-card/50 overflow-hidden">
          {/* Заголовок категории */}
          <div
            className="flex items-center gap-3 px-4 py-3 bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors"
            onClick={() => toggleCategory(cat.id)}
          >
            {expandedCategories.has(cat.id) ? (
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            )}
            <input
              type="text"
              value={cat.title}
              onChange={(e) => updateCategory(cat.id, { title: e.target.value })}
              onClick={(e) => e.stopPropagation()}
              className="flex-1 bg-transparent font-semibold text-sm focus:outline-none focus:ring-1 focus:ring-primary/30 rounded px-1"
            />
            <span className="text-xs text-muted-foreground">{cat.services.length} услуг</span>
            <button
              onClick={(e) => { e.stopPropagation(); removeCategory(cat.id); }}
              className="p-1 text-destructive/60 hover:text-destructive transition-colors"
              title="Удалить категорию"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Услуги категории */}
          {expandedCategories.has(cat.id) && (
            <div className="p-4 space-y-3">
              {[...cat.services].sort((a, b) => a.order - b.order).map((svc, svcIdx) => (
                <div key={svc.id} className="rounded-lg border border-border/30 bg-background/50 overflow-hidden">
                  {/* Заголовок услуги */}
                  <div
                    className="flex items-center gap-2 px-3 py-2.5 cursor-pointer hover:bg-muted/30 transition-colors"
                    onClick={() => toggleService(svc.id)}
                  >
                    {expandedServices.has(svc.id) ? (
                      <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
                    )}
                    <span className="text-sm font-medium flex-1">{svc.title || "Без названия"}</span>
                    {localData.featuredId === svc.id && (
                      <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                        <Star className="w-3 h-3 inline -mt-0.5 mr-0.5" />Популярное
                      </span>
                    )}
                    {/* Кнопки порядка */}
                    <button
                      onClick={(e) => { e.stopPropagation(); moveService(cat.id, svc.id, "up"); }}
                      disabled={svcIdx === 0}
                      className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
                      title="Вверх"
                    >
                      <GripVertical className="w-3.5 h-3.5 rotate-180" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); moveService(cat.id, svc.id, "down"); }}
                      disabled={svcIdx === cat.services.length - 1}
                      className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
                      title="Вниз"
                    >
                      <GripVertical className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); removeService(cat.id, svc.id); }}
                      className="p-1 text-destructive/60 hover:text-destructive transition-colors"
                      title="Удалить"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Содержимое услуги */}
                  {expandedServices.has(svc.id) && (
                    <div className="px-3 pb-3 space-y-3 border-t border-border/20 pt-3">
                      {/* Основные поля */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs text-muted-foreground mb-1 block">Название</label>
                          <input
                            type="text"
                            value={svc.title}
                            onChange={(e) => updateService(cat.id, svc.id, { title: e.target.value })}
                            className="w-full px-3 py-1.5 text-sm rounded-md border border-border/50 bg-background focus:outline-none focus:ring-1 focus:ring-primary/30"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground mb-1 block">Подзаголовок</label>
                          <input
                            type="text"
                            value={svc.subtitle}
                            onChange={(e) => updateService(cat.id, svc.id, { subtitle: e.target.value })}
                            className="w-full px-3 py-1.5 text-sm rounded-md border border-border/50 bg-background focus:outline-none focus:ring-1 focus:ring-primary/30"
                          />
                        </div>
                      </div>

                      {/* Featured toggle */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setFeatured(svc.id)}
                          className={cn(
                            "flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-colors",
                            localData.featuredId === svc.id
                              ? "bg-primary/15 text-primary border border-primary/30"
                              : "bg-muted/50 text-muted-foreground border border-border/30 hover:border-primary/30",
                          )}
                        >
                          <Star className={cn("w-3 h-3", localData.featuredId === svc.id && "fill-primary")} />
                          {localData.featuredId === svc.id ? "Популярное ✓" : "Сделать популярным"}
                        </button>
                      </div>

                      {/* Фичи карточки */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-xs text-muted-foreground font-medium">Фичи карточки</label>
                          <button
                            onClick={() => addFeature(cat.id, svc.id)}
                            className="text-xs text-primary hover:text-primary/80 flex items-center gap-1"
                          >
                            <Plus className="w-3 h-3" /> Добавить
                          </button>
                        </div>
                        <div className="space-y-1.5">
                          {svc.features.map((feat, fIdx) => (
                            <div key={fIdx} className="flex items-center gap-2">
                              <input
                                type="text"
                                value={feat}
                                onChange={(e) => updateFeature(cat.id, svc.id, fIdx, e.target.value)}
                                placeholder="Текст фичи..."
                                className="flex-1 px-2.5 py-1 text-xs rounded-md border border-border/50 bg-background focus:outline-none focus:ring-1 focus:ring-primary/30"
                              />
                              <button
                                onClick={() => removeFeature(cat.id, svc.id, fIdx)}
                                className="p-1 text-destructive/50 hover:text-destructive transition-colors"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Детали (модальное окно) */}
                      <div className="border-t border-border/20 pt-3">
                        <div
                          className="flex items-center gap-2 cursor-pointer"
                          onClick={() => {
                            ensureDetails(cat.id, svc.id);
                            toggleDetails(svc.id);
                          }}
                        >
                          {expandedDetails.has(svc.id) ? (
                            <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                          ) : (
                            <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
                          )}
                          <Pencil className="w-3 h-3 text-muted-foreground" />
                          <span className="text-xs font-medium text-muted-foreground">
                            Детали (модальное окно «Подробнее»)
                          </span>
                        </div>

                        {expandedDetails.has(svc.id) && svc.details && (
                          <div className="mt-3 ml-5 space-y-3">
                            {/* Заголовок и подзаголовок details */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              <div>
                                <label className="text-xs text-muted-foreground mb-1 block">Заголовок модалки</label>
                                <input
                                  type="text"
                                  value={svc.details.title}
                                  onChange={(e) => updateDetails(cat.id, svc.id, { title: e.target.value })}
                                  className="w-full px-2.5 py-1 text-xs rounded-md border border-border/50 bg-background focus:outline-none focus:ring-1 focus:ring-primary/30"
                                />
                              </div>
                              <div>
                                <label className="text-xs text-muted-foreground mb-1 block">Подзаголовок модалки</label>
                                <input
                                  type="text"
                                  value={svc.details.subtitle}
                                  onChange={(e) => updateDetails(cat.id, svc.id, { subtitle: e.target.value })}
                                  className="w-full px-2.5 py-1 text-xs rounded-md border border-border/50 bg-background focus:outline-none focus:ring-1 focus:ring-primary/30"
                                />
                              </div>
                            </div>

                            {/* Описание */}
                            <div>
                              <label className="text-xs text-muted-foreground mb-1 block">Описание (опционально)</label>
                              <textarea
                                value={svc.details.description ?? ""}
                                onChange={(e) => updateDetails(cat.id, svc.id, { description: e.target.value || undefined })}
                                rows={2}
                                className="w-full px-2.5 py-1 text-xs rounded-md border border-border/50 bg-background focus:outline-none focus:ring-1 focus:ring-primary/30 resize-none"
                              />
                            </div>

                            {/* Секции */}
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <label className="text-xs text-muted-foreground font-medium">Секции</label>
                                <button
                                  onClick={() => addDetailSection(cat.id, svc.id)}
                                  className="text-xs text-primary hover:text-primary/80 flex items-center gap-1"
                                >
                                  <Plus className="w-3 h-3" /> Добавить секцию
                                </button>
                              </div>
                              <div className="space-y-3">
                                {svc.details.sections.map((sec, secIdx) => (
                                  <div key={secIdx} className="rounded-md border border-border/30 bg-muted/20 p-2.5">
                                    <div className="flex items-center gap-2 mb-2">
                                      <input
                                        type="text"
                                        value={sec.title}
                                        onChange={(e) => updateDetailSection(cat.id, svc.id, secIdx, { title: e.target.value })}
                                        placeholder="Название секции..."
                                        className="flex-1 px-2 py-1 text-xs font-medium rounded border border-border/50 bg-background focus:outline-none focus:ring-1 focus:ring-primary/30"
                                      />
                                      <button
                                        onClick={() => removeDetailSection(cat.id, svc.id, secIdx)}
                                        className="p-1 text-destructive/50 hover:text-destructive"
                                      >
                                        <Trash2 className="w-3 h-3" />
                                      </button>
                                    </div>
                                    {/* Пункты секции */}
                                    <div className="space-y-1 ml-2">
                                      {sec.items.map((item, itemIdx) => (
                                        <div key={itemIdx} className="flex items-center gap-1.5">
                                          <span className="text-xs text-muted-foreground">•</span>
                                          <input
                                            type="text"
                                            value={item}
                                            onChange={(e) => updateDetailSectionItem(cat.id, svc.id, secIdx, itemIdx, e.target.value)}
                                            className="flex-1 px-2 py-0.5 text-xs rounded border border-border/30 bg-background focus:outline-none focus:ring-1 focus:ring-primary/30"
                                          />
                                          <button
                                            onClick={() => removeDetailSectionItem(cat.id, svc.id, secIdx, itemIdx)}
                                            className="p-0.5 text-destructive/40 hover:text-destructive"
                                          >
                                            <X className="w-2.5 h-2.5" />
                                          </button>
                                        </div>
                                      ))}
                                      <button
                                        onClick={() => addDetailSectionItem(cat.id, svc.id, secIdx)}
                                        className="text-xs text-primary/60 hover:text-primary flex items-center gap-1 mt-1"
                                      >
                                        <Plus className="w-2.5 h-2.5" /> Пункт
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Цены */}
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <label className="text-xs text-muted-foreground font-medium">Цены</label>
                                <button
                                  onClick={() => addPricingOption(cat.id, svc.id)}
                                  className="text-xs text-primary hover:text-primary/80 flex items-center gap-1"
                                >
                                  <Plus className="w-3 h-3" /> Вариант
                                </button>
                              </div>
                              <div className="space-y-1.5">
                                {svc.details.pricing.options.map((opt, optIdx) => (
                                  <div key={optIdx} className="flex items-center gap-2">
                                    <input
                                      type="text"
                                      value={opt}
                                      onChange={(e) => updatePricingOption(cat.id, svc.id, optIdx, e.target.value)}
                                      placeholder="Вариант цены..."
                                      className="flex-1 px-2.5 py-1 text-xs rounded-md border border-border/50 bg-background focus:outline-none focus:ring-1 focus:ring-primary/30"
                                    />
                                    <button
                                      onClick={() => removePricingOption(cat.id, svc.id, optIdx)}
                                      className="p-1 text-destructive/50 hover:text-destructive"
                                    >
                                      <X className="w-3 h-3" />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Доп. услуги */}
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <label className="text-xs text-muted-foreground font-medium">Доп. услуги</label>
                                <button
                                  onClick={() => addExtra(cat.id, svc.id)}
                                  className="text-xs text-primary hover:text-primary/80 flex items-center gap-1"
                                >
                                  <Plus className="w-3 h-3" /> Добавить
                                </button>
                              </div>
                              <div className="space-y-1.5">
                                {(svc.details.extras ?? []).map((ext, extIdx) => (
                                  <div key={extIdx} className="flex items-center gap-2">
                                    <input
                                      type="text"
                                      value={ext}
                                      onChange={(e) => updateExtra(cat.id, svc.id, extIdx, e.target.value)}
                                      placeholder="Доп. услуга..."
                                      className="flex-1 px-2.5 py-1 text-xs rounded-md border border-border/50 bg-background focus:outline-none focus:ring-1 focus:ring-primary/30"
                                    />
                                    <button
                                      onClick={() => removeExtra(cat.id, svc.id, extIdx)}
                                      className="p-1 text-destructive/50 hover:text-destructive"
                                    >
                                      <X className="w-3 h-3" />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* Кнопка добавления услуги */}
              <button
                onClick={() => addService(cat.id)}
                className="w-full py-2 border border-dashed border-border/50 rounded-lg text-xs text-muted-foreground hover:text-primary hover:border-primary/30 transition-colors flex items-center justify-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" /> Добавить услугу
              </button>
            </div>
          )}
        </div>
      ))}

      {/* Кнопка добавления категории */}
      <button
        onClick={addCategory}
        className="w-full py-3 border border-dashed border-border/50 rounded-xl text-sm text-muted-foreground hover:text-primary hover:border-primary/30 transition-colors flex items-center justify-center gap-2"
      >
        <Plus className="w-4 h-4" /> Добавить категорию
      </button>
    </div>
  );
};
