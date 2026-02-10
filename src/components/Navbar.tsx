/**
 * Navbar — sticky навигационная панель
 * PERF: CSS-анимация входа (animate-navbar-enter), без framer-motion.
 * Содержит: лого, якорные ссылки с active-подсветкой по скроллу,
 * переключатель языка, shimmer CTA кнопку.
 * На мобильных — бургер-меню через Sheet (shadcn).
 */
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Globe, Menu, Send } from "lucide-react";
import { useI18n } from "@/hooks/useI18n";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DESIGN_TOKENS } from "@/lib/design-tokens";
import { cn } from "@/lib/utils";

/** Якорные ссылки навбара: key — i18n ключ, id — id секции */
const NAV_LINKS = [
  { key: "nav.about", id: "about" },
  { key: "nav.services", id: "services" },
  { key: "nav.contact", id: "cta" },
] as const;

export const Navbar = () => {
  const { t, language, setLanguage } = useI18n();
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Единый scroll handler: backdrop + active section tracking
  const handleScroll = useCallback(() => {
    setIsScrolled(window.scrollY > 50);

    // Определяем активную секцию по позиции скролла
    const sections = NAV_LINKS.map((l) => l.id);
    let current = "";
    for (const id of sections) {
      const el = document.getElementById(id);
      if (el) {
        const rect = el.getBoundingClientRect();
        // Секция считается активной если её верх ушёл за 30% viewport
        if (rect.top <= window.innerHeight * 0.3) {
          current = id;
        }
      }
    }
    setActiveSection(current);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  /** Плавный скролл к секции */
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setIsMobileOpen(false);
  };

  return (
    <nav
      className={cn(
        DESIGN_TOKENS.navbar,
        "animate-navbar-enter",
        isScrolled ? DESIGN_TOKENS.navbarScrolled : "bg-transparent"
      )}
    >
      <div className={`${DESIGN_TOKENS.container} px-4 md:px-8`}>
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Лого / Имя */}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="text-lg md:text-xl font-bold gradient-text whitespace-nowrap hover:opacity-80 transition-opacity"
          >
            {t("footer.name")}
          </a>

          {/* Десктоп навигация */}
          <div className="hidden md:flex items-center gap-8">
            {/* Якорные ссылки с active indicator */}
            <div className="flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <button
                  key={link.key}
                  onClick={() => scrollTo(link.id)}
                  className={cn(
                    "relative px-4 py-2 text-sm font-medium rounded-full transition-all duration-300",
                    activeSection === link.id
                      ? "text-primary bg-primary/10"
                      : "text-foreground/60 hover:text-foreground hover:bg-foreground/5"
                  )}
                >
                  {t(link.key)}
                </button>
              ))}
            </div>

            {/* Переключатель языка */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-full px-3 gap-1.5 text-xs font-medium text-foreground/60 hover:text-foreground hover:bg-foreground/5"
                >
                  <Globe className="w-3.5 h-3.5" />
                  {language.toUpperCase()}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-36 backdrop-blur-xl bg-background/95 border-border/50 shadow-xl"
              >
                <DropdownMenuItem
                  onClick={() => setLanguage("ru")}
                  className={cn(
                    "cursor-pointer",
                    language === "ru" && "bg-primary/10 text-primary"
                  )}
                >
                  {t("lang.ru")}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setLanguage("en")}
                  className={cn(
                    "cursor-pointer",
                    language === "en" && "bg-primary/10 text-primary"
                  )}
                >
                  {t("lang.en")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* CTA кнопка с shimmer */}
            <Button
              size="sm"
              className="btn-shimmer rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 px-5 transition-all duration-300"
              asChild
            >
              <a
                href="https://t.me/Elena_fitmentor"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Send className="w-3.5 h-3.5 mr-2" />
                {t("nav.cta")}
              </a>
            </Button>
          </div>

          {/* Мобильное меню (бургер) */}
          <div className="md:hidden">
            <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full hover:bg-foreground/5">
                  <Menu className="w-5 h-5" />
                  <span className="sr-only">Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-[300px] bg-background/95 backdrop-blur-xl border-l border-border/30"
              >
                <SheetHeader>
                  <SheetTitle className="gradient-text text-left text-xl">
                    {t("footer.name")}
                  </SheetTitle>
                  <SheetDescription className="sr-only">
                    {t("footer.role")}
                  </SheetDescription>
                </SheetHeader>

                {/* Мобильные ссылки с active state */}
                <div className="flex flex-col gap-1 mt-8">
                  {NAV_LINKS.map((link) => (
                    <button
                      key={link.key}
                      onClick={() => scrollTo(link.id)}
                      className={cn(
                        "text-left py-3.5 px-5 rounded-xl text-base font-medium transition-all duration-200",
                        activeSection === link.id
                          ? "bg-primary/10 text-primary"
                          : "text-foreground/70 hover:bg-foreground/5 hover:text-foreground"
                      )}
                    >
                      {t(link.key)}
                    </button>
                  ))}
                </div>

                {/* Разделитель */}
                <div className={`${DESIGN_TOKENS.divider} mx-4 my-6`} />

                {/* Мобильный переключатель языка */}
                <div className="px-4">
                  <p className="text-xs text-muted-foreground mb-3 uppercase tracking-widest font-medium">
                    {language === "ru" ? "Язык" : "Language"}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant={language === "ru" ? "default" : "outline"}
                      size="sm"
                      className="rounded-full flex-1"
                      onClick={() => setLanguage("ru")}
                    >
                      RU
                    </Button>
                    <Button
                      variant={language === "en" ? "default" : "outline"}
                      size="sm"
                      className="rounded-full flex-1"
                      onClick={() => setLanguage("en")}
                    >
                      EN
                    </Button>
                  </div>
                </div>

                {/* Мобильная CTA кнопка с shimmer */}
                <div className="mt-8 px-4">
                  <Button
                    className="btn-shimmer w-full rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 py-6"
                    asChild
                  >
                    <a
                      href="https://t.me/Elena_fitmentor"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      {t("nav.cta")}
                    </a>
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};
