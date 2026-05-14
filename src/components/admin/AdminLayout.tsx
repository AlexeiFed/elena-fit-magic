/**
 * AdminLayout — основной layout админ-панели.
 * Sidebar с навигацией по разделам + область контента.
 * Будет наполнен редакторами на следующих шагах.
 */
import { useState } from "react";
import {
  LogOut, MessageSquare, Image, ShoppingBag, FileText, Settings, ChevronLeft } from "@/components/icons";
import { adminLogout } from "@/lib/api";
import { DESIGN_TOKENS } from "@/lib/design-tokens";
import { cn } from "@/lib/utils";
import { TestimonialsEditor } from "./TestimonialsEditor";
import { ScreenshotsEditor } from "./ScreenshotsEditor";
import { ServicesEditor } from "./ServicesEditor";
import { ContentEditor } from "./ContentEditor";

/** Разделы админки */
type AdminSection = "testimonials" | "screenshots" | "services" | "content" | "settings";

interface AdminLayoutProps {
  onLogout: () => void;
}

/** Элементы навигации sidebar */
const NAV_ITEMS: { id: AdminSection; label: string; icon: React.ElementType }[] = [
  { id: "testimonials", label: "Отзывы", icon: MessageSquare },
  { id: "screenshots", label: "Скриншоты", icon: Image },
  { id: "services", label: "Услуги", icon: ShoppingBag },
  { id: "content", label: "Контент", icon: FileText },
  { id: "settings", label: "Настройки", icon: Settings },
];

export const AdminLayout = ({ onLogout }: AdminLayoutProps) => {
  const [activeSection, setActiveSection] = useState<AdminSection>("testimonials");
  const [loggingOut, setLoggingOut] = useState(false);

  /** Выход из админки */
  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await adminLogout();
    } catch {
      // Даже при ошибке — выходим локально
    }
    onLogout();
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* === Sidebar === */}
      <aside className="w-64 border-r border-border/50 bg-card/30 flex flex-col">
        {/* Заголовок */}
        <div className="p-4 border-b border-border/50">
          <h2 className="font-bold text-lg">Админ-панель</h2>
          <p className="text-xs text-muted-foreground">elenafitmagic.ru</p>
        </div>

        {/* Навигация */}
        <nav className="flex-1 p-2 space-y-1">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                activeSection === item.id
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
        </nav>

        {/* Нижняя часть sidebar */}
        <div className="p-2 border-t border-border/50 space-y-1">
          <a
            href="/"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            На сайт
          </a>
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            {loggingOut ? "Выход..." : "Выйти"}
          </button>
        </div>
      </aside>

      {/* === Контент === */}
      <main className="flex-1 p-6 md:p-8 overflow-auto">
        <div className="max-w-4xl">
          {/* Заголовок раздела */}
          <h1 className={`${DESIGN_TOKENS.heading.h3} !mb-6`}>
            {NAV_ITEMS.find((i) => i.id === activeSection)?.label}
          </h1>

          {/* Контент раздела — заглушки (будут заменены редакторами) */}
          {activeSection === "testimonials" && <TestimonialsEditor />}

          {activeSection === "screenshots" && <ScreenshotsEditor />}

          {activeSection === "services" && <ServicesEditor />}

          {activeSection === "content" && <ContentEditor />}

          {activeSection === "settings" && (
            <div className="rounded-xl border border-border/50 bg-card/50 p-6">
              <p className="text-muted-foreground text-sm">
                Настройки будут здесь
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
