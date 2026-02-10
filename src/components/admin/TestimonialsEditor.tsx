/**
 * TestimonialsEditor — CRUD-редактор текстовых отзывов + toggle блоков.
 *
 * Функции:
 *   - Включение/отключение блока текстовых отзывов и блока скриншотов
 *   - Добавление / редактирование / удаление отзывов
 *   - Изменение порядка отзывов (вверх/вниз)
 *   - Сохранение в JSON через PHP API
 */
import { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  Save,
  ChevronUp,
  ChevronDown,
  Pencil,
  X,
  Loader2,
  Check,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useTestimonials, QUERY_KEYS } from "@/hooks/useSiteData";
import { saveTestimonials } from "@/lib/api";
import type { TestimonialsData, Testimonial } from "@/lib/api";
import { cn } from "@/lib/utils";

/** Генерация уникального ID для нового отзыва */
const generateId = () => `t${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;

export const TestimonialsEditor = () => {
  const queryClient = useQueryClient();
  const { data: serverData, isLoading, isPlaceholderData } = useTestimonials();

  /* Локальное состояние для редактирования */
  const [localData, setLocalData] = useState<TestimonialsData | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: "", quote: "", result: "" });
  const [initialized, setInitialized] = useState(false);

  /* Синхронизация серверных данных — только реальные, не placeholder */
  useEffect(() => {
    if (serverData && !isPlaceholderData && !initialized) {
      setLocalData(serverData);
      setInitialized(true);
    }
  }, [serverData, isPlaceholderData, initialized]);

  /* Проверка наличия несохранённых изменений */
  const hasChanges = localData && JSON.stringify(localData) !== JSON.stringify(serverData);

  /** Сохранение данных на сервер */
  const handleSave = async () => {
    if (!localData) return;
    setSaving(true);
    setSaveStatus("idle");
    try {
      await saveTestimonials(localData);
      // Инвалидируем кеш — публичная часть сайта подхватит новые данные
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.testimonials });
      setSaveStatus("success");
      setTimeout(() => setSaveStatus("idle"), 2000);
    } catch {
      setSaveStatus("error");
    } finally {
      setSaving(false);
    }
  };

  /** Toggle блока текстовых отзывов */
  const toggleTextReviews = () => {
    if (!localData) return;
    setLocalData({ ...localData, textReviewsEnabled: !localData.textReviewsEnabled });
  };

  /** Toggle блока скриншотов */
  const toggleScreenshots = () => {
    if (!localData) return;
    setLocalData({ ...localData, screenshotsEnabled: !localData.screenshotsEnabled });
  };

  /** Добавление нового отзыва */
  const addTestimonial = () => {
    if (!localData) return;
    const maxOrder = localData.items.length > 0
      ? Math.max(...localData.items.map((i) => i.order))
      : -1;
    const newItem: Testimonial = {
      id: generateId(),
      name: "",
      quote: "",
      result: "",
      order: maxOrder + 1,
    };
    setLocalData({ ...localData, items: [...localData.items, newItem] });
    // Сразу открываем редактирование нового отзыва
    setEditingId(newItem.id);
    setEditForm({ name: "", quote: "", result: "" });
  };

  /** Удаление отзыва */
  const removeTestimonial = (id: string) => {
    if (!localData) return;
    setLocalData({
      ...localData,
      items: localData.items.filter((i) => i.id !== id),
    });
    if (editingId === id) setEditingId(null);
  };

  /** Начало редактирования отзыва */
  const startEdit = (item: Testimonial) => {
    setEditingId(item.id);
    setEditForm({ name: item.name, quote: item.quote, result: item.result });
  };

  /** Сохранение редактирования отзыва (локально) */
  const saveEdit = () => {
    if (!localData || !editingId) return;
    setLocalData({
      ...localData,
      items: localData.items.map((i) =>
        i.id === editingId
          ? { ...i, name: editForm.name, quote: editForm.quote, result: editForm.result }
          : i,
      ),
    });
    setEditingId(null);
  };

  /** Отмена редактирования */
  const cancelEdit = () => {
    if (!localData || !editingId) return;
    // Если новый отзыв пустой — удаляем его
    const item = localData.items.find((i) => i.id === editingId);
    if (item && !item.name && !item.quote && !item.result) {
      removeTestimonial(editingId);
    }
    setEditingId(null);
  };

  /** Перемещение отзыва вверх/вниз */
  const moveItem = (id: string, direction: "up" | "down") => {
    if (!localData) return;
    const sorted = [...localData.items].sort((a, b) => a.order - b.order);
    const idx = sorted.findIndex((i) => i.id === id);
    if (idx < 0) return;
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= sorted.length) return;
    // Меняем order местами
    const tempOrder = sorted[idx].order;
    sorted[idx] = { ...sorted[idx], order: sorted[swapIdx].order };
    sorted[swapIdx] = { ...sorted[swapIdx], order: tempOrder };
    setLocalData({ ...localData, items: sorted });
  };

  /* Загрузка */
  if (isLoading || !localData) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  const sortedItems = [...localData.items].sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-6">
      {/* === Toggle блоков === */}
      <div className="rounded-xl border border-border/50 bg-card/50 p-5 space-y-4">
        <h3 className="text-sm font-semibold text-foreground/80 uppercase tracking-wider">
          Видимость блоков
        </h3>

        {/* Toggle текстовых отзывов */}
        <button
          onClick={toggleTextReviews}
          className="w-full flex items-center justify-between py-2 group"
        >
          <span className="text-sm font-medium">Текстовые отзывы (карусель)</span>
          {localData.textReviewsEnabled ? (
            <ToggleRight className="w-8 h-8 text-primary" />
          ) : (
            <ToggleLeft className="w-8 h-8 text-muted-foreground" />
          )}
        </button>

        {/* Toggle скриншотов */}
        <button
          onClick={toggleScreenshots}
          className="w-full flex items-center justify-between py-2 group"
        >
          <span className="text-sm font-medium">Скриншоты переписок (галерея)</span>
          {localData.screenshotsEnabled ? (
            <ToggleRight className="w-8 h-8 text-primary" />
          ) : (
            <ToggleLeft className="w-8 h-8 text-muted-foreground" />
          )}
        </button>
      </div>

      {/* === Список отзывов === */}
      <div className="space-y-3">
        {sortedItems.map((item, index) => (
          <div
            key={item.id}
            className="rounded-xl border border-border/50 bg-card/50 p-4"
          >
            {editingId === item.id ? (
              /* --- Режим редактирования --- */
              <div className="space-y-3">
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  placeholder="Имя (напр. Анна М.)"
                  className="w-full px-3 py-2 rounded-lg border border-border/50 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  autoFocus
                />
                <textarea
                  value={editForm.quote}
                  onChange={(e) => setEditForm({ ...editForm, quote: e.target.value })}
                  placeholder="Текст отзыва"
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg border border-border/50 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-y"
                />
                <input
                  type="text"
                  value={editForm.result}
                  onChange={(e) => setEditForm({ ...editForm, result: e.target.value })}
                  placeholder="Результат (напр. −8 кг за 3 месяца)"
                  className="w-full px-3 py-2 rounded-lg border border-border/50 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
                <div className="flex gap-2">
                  <button
                    onClick={saveEdit}
                    disabled={!editForm.name.trim() || !editForm.quote.trim()}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-white text-sm font-medium hover:opacity-90 disabled:opacity-40 transition-all"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Готово
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border/50 text-sm font-medium hover:bg-muted/50 transition-all"
                  >
                    <X className="w-3.5 h-3.5" />
                    Отмена
                  </button>
                </div>
              </div>
            ) : (
              /* --- Режим просмотра --- */
              <div className="flex items-start gap-3">
                {/* Порядок и стрелки */}
                <div className="flex flex-col items-center gap-0.5 pt-1">
                  <button
                    onClick={() => moveItem(item.id, "up")}
                    disabled={index === 0}
                    className="p-0.5 rounded hover:bg-muted/50 disabled:opacity-20 transition-colors"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>
                  <span className="text-xs text-muted-foreground font-mono">{index + 1}</span>
                  <button
                    onClick={() => moveItem(item.id, "down")}
                    disabled={index === sortedItems.length - 1}
                    className="p-0.5 rounded hover:bg-muted/50 disabled:opacity-20 transition-colors"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>

                {/* Контент */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold">{item.name || "Без имени"}</span>
                    {item.result && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                        {item.result}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {item.quote || "Нет текста"}
                  </p>
                </div>

                {/* Действия */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => startEdit(item)}
                    className="p-1.5 rounded-lg hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors"
                    title="Редактировать"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => removeTestimonial(item.id)}
                    className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                    title="Удалить"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Кнопка добавления */}
        <button
          onClick={addTestimonial}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-border/50 text-sm font-medium text-muted-foreground hover:border-primary/30 hover:text-primary transition-colors"
        >
          <Plus className="w-4 h-4" />
          Добавить отзыв
        </button>
      </div>

      {/* === Кнопка сохранения === */}
      <div className="sticky bottom-0 bg-background/80 backdrop-blur-sm py-4 border-t border-border/30 -mx-6 px-6 md:-mx-8 md:px-8 flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={saving || !hasChanges}
          className={cn(
            "flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all",
            hasChanges
              ? "bg-primary text-white hover:opacity-90"
              : "bg-muted text-muted-foreground cursor-not-allowed",
          )}
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {saving ? "Сохранение..." : "Сохранить"}
        </button>

        {/* Статус сохранения */}
        {saveStatus === "success" && (
          <span className="text-sm text-green-600 flex items-center gap-1">
            <Check className="w-4 h-4" /> Сохранено
          </span>
        )}
        {saveStatus === "error" && (
          <span className="text-sm text-destructive">Ошибка сохранения</span>
        )}
        {hasChanges && saveStatus === "idle" && (
          <span className="text-sm text-amber-600">Есть несохранённые изменения</span>
        )}
      </div>
    </div>
  );
};
