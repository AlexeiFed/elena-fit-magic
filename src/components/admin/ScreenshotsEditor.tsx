/**
 * ScreenshotsEditor — редактор скриншотов переписок.
 *
 * Функции:
 *   - Загрузка изображений (drag-n-drop + кнопка)
 *   - Редактирование подписей
 *   - Изменение порядка (вверх/вниз)
 *   - Удаление скриншотов (файл + запись)
 *   - Сохранение в screenshots.json через PHP API
 */
import { useState, useEffect, useRef } from "react";
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
  Upload,
  ImageIcon,
} from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useScreenshots, QUERY_KEYS } from "@/hooks/useSiteData";
import { saveScreenshots, uploadImage, deleteImage } from "@/lib/api";
import type { ScreenshotsData, Screenshot } from "@/lib/api";
import { cn } from "@/lib/utils";

/** Генерация уникального ID */
const generateId = () => `s${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;

export const ScreenshotsEditor = () => {
  const queryClient = useQueryClient();
  const { data: serverData, isLoading, isPlaceholderData } = useScreenshots();
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* Локальное состояние */
  const [localData, setLocalData] = useState<ScreenshotsData | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editCaption, setEditCaption] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [initialized, setInitialized] = useState(false);

  /* Синхронизация серверных данных — только реальные, не placeholder */
  useEffect(() => {
    if (serverData && !isPlaceholderData && !initialized) {
      setLocalData(serverData);
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
      await saveScreenshots(localData);
      // Инвалидируем кеш — публичная часть сайта подхватит новые данные
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.screenshots });
      setSaveStatus("success");
      setTimeout(() => setSaveStatus("idle"), 2000);
    } catch {
      setSaveStatus("error");
    } finally {
      setSaving(false);
    }
  };

  /** Загрузка файла на сервер и добавление в список */
  const handleUpload = async (files: FileList | null) => {
    if (!files || !localData) return;
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const uploaded = await uploadImage(file, "screenshots");
        const maxOrder = localData.items.length > 0
          ? Math.max(...localData.items.map((i) => i.order))
          : -1;
        const newItem: Screenshot = {
          id: generateId(),
          src: uploaded.url,
          caption: "",
          order: maxOrder + 1,
        };
        setLocalData((prev) =>
          prev ? { ...prev, items: [...prev.items, newItem] } : prev,
        );
      }
    } catch {
      alert("Ошибка загрузки файла");
    } finally {
      setUploading(false);
      // Сбрасываем input
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  /** Удаление скриншота (файл + запись) */
  const removeScreenshot = async (item: Screenshot) => {
    if (!localData) return;
    // Извлекаем имя файла из URL для удаления с сервера
    const fileName = item.src.split("/").pop();
    if (fileName && item.src.startsWith("/uploads/")) {
      try {
        await deleteImage(fileName, "screenshots");
      } catch {
        // Файл мог быть уже удалён — не критично
      }
    }
    setLocalData({
      ...localData,
      items: localData.items.filter((i) => i.id !== item.id),
    });
    if (editingId === item.id) setEditingId(null);
  };

  /** Начало редактирования подписи */
  const startEdit = (item: Screenshot) => {
    setEditingId(item.id);
    setEditCaption(item.caption);
  };

  /** Сохранение подписи */
  const saveEdit = () => {
    if (!localData || !editingId) return;
    setLocalData({
      ...localData,
      items: localData.items.map((i) =>
        i.id === editingId ? { ...i, caption: editCaption } : i,
      ),
    });
    setEditingId(null);
  };

  /** Перемещение скриншота */
  const moveItem = (id: string, direction: "up" | "down") => {
    if (!localData) return;
    const sorted = [...localData.items].sort((a, b) => a.order - b.order);
    const idx = sorted.findIndex((i) => i.id === id);
    if (idx < 0) return;
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= sorted.length) return;
    const tempOrder = sorted[idx].order;
    sorted[idx] = { ...sorted[idx], order: sorted[swapIdx].order };
    sorted[swapIdx] = { ...sorted[swapIdx], order: tempOrder };
    setLocalData({ ...localData, items: sorted });
  };

  /** Обработка drag-n-drop */
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleUpload(e.dataTransfer.files);
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
      {/* === Зона загрузки === */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={cn(
          "rounded-xl border-2 border-dashed p-8 text-center transition-colors",
          dragOver
            ? "border-primary bg-primary/5"
            : "border-border/50 hover:border-primary/30",
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          onChange={(e) => handleUpload(e.target.files)}
          className="hidden"
        />

        {uploading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Загрузка...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <Upload className="w-10 h-10 text-muted-foreground/40" />
            <div>
              <p className="text-sm font-medium">
                Перетащите изображения сюда
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                JPEG, PNG, WebP — до 5 МБ
              </p>
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 rounded-lg bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 transition-colors"
            >
              <Plus className="w-4 h-4 inline mr-1.5" />
              Выбрать файлы
            </button>
          </div>
        )}
      </div>

      {/* === Список скриншотов === */}
      <div className="space-y-3">
        {sortedItems.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-8">
            Нет загруженных скриншотов
          </p>
        )}

        {sortedItems.map((item, index) => (
          <div
            key={item.id}
            className="rounded-xl border border-border/50 bg-card/50 p-3 flex items-center gap-3"
          >
            {/* Стрелки порядка */}
            <div className="flex flex-col items-center gap-0.5">
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

            {/* Превью изображения */}
            <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted/30 flex-shrink-0">
              {item.src ? (
                <img
                  src={item.src}
                  alt={item.caption}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ImageIcon className="w-6 h-6 text-muted-foreground/30" />
                </div>
              )}
            </div>

            {/* Подпись */}
            <div className="flex-1 min-w-0">
              {editingId === item.id ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={editCaption}
                    onChange={(e) => setEditCaption(e.target.value)}
                    placeholder="Подпись к скриншоту"
                    className="flex-1 px-3 py-1.5 rounded-lg border border-border/50 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    autoFocus
                    onKeyDown={(e) => e.key === "Enter" && saveEdit()}
                  />
                  <button
                    onClick={saveEdit}
                    className="p-1.5 rounded-lg bg-primary text-white hover:opacity-90 transition-all"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="p-1.5 rounded-lg border border-border/50 hover:bg-muted/50 transition-all"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div>
                  <p className="text-sm font-medium truncate">
                    {item.caption || <span className="text-muted-foreground italic">Без подписи</span>}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">{item.src}</p>
                </div>
              )}
            </div>

            {/* Действия */}
            {editingId !== item.id && (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => startEdit(item)}
                  className="p-1.5 rounded-lg hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors"
                  title="Редактировать подпись"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => removeScreenshot(item)}
                  className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                  title="Удалить"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        ))}
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
