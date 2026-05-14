/**
 * Footer — расширенный footer
 * 3-колоночный layout: бренд + описание, быстрые ссылки, контакты.
 * Нижняя строка: копирайт + политика конфиденциальности.
 */
import { Send } from "@/components/icons";
import maxLogoWebp from "@/assets/max-logo.webp";
import maxLogoPng from "@/assets/max-logo.png";
import { Link } from "react-router-dom";
import { useI18n } from "@/hooks/useI18n";
import { useResolvedSiteContent } from "@/hooks/useResolvedSiteContent";
import { DESIGN_TOKENS } from "@/lib/design-tokens";

/** Якорные ссылки для быстрой навигации */
const QUICK_LINKS = [
  { key: "nav.about", id: "about" },
  { key: "nav.services", id: "services" },
  { key: "nav.contact", id: "cta" },
] as const;

export const Footer = () => {
  const { t } = useI18n();
  const { contacts } = useResolvedSiteContent();

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="py-16 md:py-20 border-t border-border/20 bg-card/30 backdrop-blur-sm">
      <div className={DESIGN_TOKENS.container}>
        {/* 3-колоночный grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 text-center md:text-left">
          {/* Колонка 1: Бренд — на мобиле заголовок и подзаголовок по центру */}
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-bold gradient-text mb-3">
              {t("footer.name")}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto md:mx-0">
              {t("footer.role")}
            </p>
          </div>

          {/* Колонка 2: Быстрые ссылки */}
          <div>
            <h4 className="text-sm font-semibold text-foreground/80 uppercase tracking-wider mb-4">
              {t("nav.about").split(" ")[0] === "Обо" ? "Навигация" : "Navigation"}
            </h4>
            <ul className="space-y-2.5">
              {QUICK_LINKS.map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => scrollTo(link.id)}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
                  >
                    {t(link.key)}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Колонка 3: Контакты */}
          <div>
            <h4 className="text-sm font-semibold text-foreground/80 uppercase tracking-wider mb-4">
              {t("nav.contact")}
            </h4>
            <div className="flex gap-4 justify-center md:justify-start">
              <a
                href={contacts.telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Telegram"
                className="w-14 h-14 rounded-2xl bg-card/60 border border-border/30 flex items-center justify-center transition-all duration-300 hover:bg-primary/10 hover:border-primary/30 hover:scale-110 shadow-sm group"
              >
                <Send className="w-6 h-6 text-primary" />
              </a>
              <a
                href={contacts.maxUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Max"
                className="w-14 h-14 rounded-2xl bg-card/60 border border-border/30 flex items-center justify-center transition-all duration-300 hover:bg-primary/10 hover:border-primary/30 hover:scale-110 shadow-sm group"
              >
                <picture>
                  <source srcSet={maxLogoWebp} type="image/webp" />
                  <img src={maxLogoPng} alt="Max" width={28} height={28} loading="lazy" className="w-7 h-7" />
                </picture>
              </a>
            </div>
          </div>
        </div>

        {/* Нижняя строка */}
        <div className="mt-12 pt-8 border-t border-border/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
          <p>{t("footer.copyright", { year: new Date().getFullYear() })}</p>
          <Link
            to="/privacy"
            className="hover:text-primary transition-colors duration-200"
          >
            {t("footer.privacy")}
          </Link>
        </div>
      </div>
    </footer>
  );
};
