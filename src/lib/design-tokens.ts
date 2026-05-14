/**
 * Система дизайн-токенов проекта elenafitmagic.ru
 * Все визуальные стили компонентов должны использовать эти токены
 * для обеспечения консистентности дизайна.
 */
export const DESIGN_TOKENS = {
  // --- Базовые стили поверхностей ---
  glass: "backdrop-blur-md bg-white/10 border border-white/20 shadow-xl",
  glassDark: "backdrop-blur-md bg-black/20 border border-white/10 shadow-xl",
  card: "rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-300",
  button: "rounded-full transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]",

  // --- Layout ---
  sectionPadding: "py-24 px-6 md:px-12",
  container: "max-w-7xl mx-auto",

  // --- Navbar ---
  navbar: "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
  navbarScrolled: "bg-background/80 backdrop-blur-xl shadow-sm border-b border-border/50",

  /** Hero: отступ под fixed navbar (на lg раньше был pt-0 — контент впритык к меню) */
  heroSectionPaddingTop: "pt-24 lg:pt-28 xl:pt-32",

  // --- Секции с чередованием фона ---
  section: {
    default: "py-24 px-6 md:px-12",
    alt: "py-24 px-6 md:px-12 bg-muted/30",
  },

  // --- Типографика (3 размера шрифта для всего лендинга) ---
  heading: {
    h1: "text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-[1.1]",
    h2: "text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-8",
    h3: "text-xl md:text-2xl font-semibold mb-4",
  },
  text: {
    base: "text-base leading-relaxed",
    large: "text-lg md:text-xl leading-relaxed",
    muted: "text-base text-muted-foreground leading-relaxed",
  },

  // --- Тени ---
  shadow: {
    sm: "shadow-sm",
    xl: "shadow-xl",
  },

  // --- Скругления ---
  radius: "rounded-2xl",

  // --- Дополнительные элементы ---
  badge: "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium bg-primary/10 text-primary",
  featuredCard: "rounded-2xl border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-accent/5 backdrop-blur-sm shadow-xl shadow-primary/10",
  divider: "h-px bg-gradient-to-r from-transparent via-border to-transparent",
};
