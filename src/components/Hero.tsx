/**
 * Hero — главный экран лендинга (split layout)
 * PERF: Все entrance-анимации через CSS keyframes (без framer-motion)
 * для мгновенного рендера без ожидания JS bundle.
 * Содержит: заголовок, подзаголовок, shimmer CTA кнопку,
 * glass stats card с social proof, floating shapes, scroll indicator.
 */
import { Button } from "@/components/ui/button";
import { ArrowDown, Users, Award, TrendingUp } from "@/components/icons";
import elenaHeroWebp from "@/assets/elena-hero.webp";
import elenaHeroJpg from "@/assets/elena-hero.jpg";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import { useI18n } from "@/hooks/useI18n";
import { useResolvedSiteContent } from "@/hooks/useResolvedSiteContent";
import { DESIGN_TOKENS } from "@/lib/design-tokens";

// Вычисление лет опыта (начало — 13 февраля 2014)
const getYearsOfExperience = (): number => {
  const now = new Date();
  const baseYear = 2014;
  const isAfterFeb13 = now.getMonth() > 1 || (now.getMonth() === 1 && now.getDate() >= 13);
  return now.getFullYear() - baseYear - (isAfterFeb13 ? 0 : 1);
};

export const Hero = () => {
  const { t } = useI18n();
  const { hero: heroCms } = useResolvedSiteContent();
  const yearsOfExperience = getYearsOfExperience();

  const scrollToServices = () => {
    document.getElementById("services")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className={`relative min-h-screen flex items-center overflow-hidden ${DESIGN_TOKENS.heroSectionPaddingTop}`}>
      {/* === Animated gradient mesh background === */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[5%] w-[400px] h-[400px] bg-primary/8 rounded-full blur-[100px] animate-gradient-mesh-1" />
        <div className="absolute bottom-[15%] right-[5%] w-[350px] h-[350px] bg-accent/8 rounded-full blur-[100px] animate-gradient-mesh-2" />
        <div className="absolute top-[50%] left-[40%] w-[300px] h-[300px] bg-primary/5 rounded-full blur-[120px] animate-gradient-mesh-3" />
      </div>

      {/* === Floating decorative shapes === */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Geometric ring */}
        <div className="absolute top-[15%] right-[12%] w-16 h-16 md:w-20 md:h-20 border-2 border-primary/15 rounded-full animate-float-slow" />
        {/* Small dot */}
        <div className="absolute bottom-[25%] left-[8%] w-3 h-3 bg-primary/30 rounded-full animate-float-slow-reverse" />
        {/* Diamond shape */}
        <div className="absolute top-[60%] right-[20%] w-4 h-4 bg-accent/20 rotate-45 animate-float-slow" />
        {/* Large ring */}
        <div className="absolute bottom-[10%] right-[35%] w-10 h-10 border border-primary/10 rounded-full animate-float-slow-reverse" />
      </div>

      <div className={`${DESIGN_TOKENS.container} px-2 md:px-4 relative z-10 w-full`}>
        <div className="grid lg:grid-cols-[1fr_0.8fr] gap-8 lg:gap-16 items-center min-h-screen lg:min-h-[90vh]">

          {/* === Левая колонка — текст === */}
          <div className="flex flex-col justify-center py-12 lg:py-0 order-2 lg:order-1">
            {/* Headline */}
            <h1 className={`${DESIGN_TOKENS.heading.h1} mb-6 text-center lg:text-left hero-animate-1`}>
              {heroCms.title} <br />
              <span className="gradient-text">{heroCms.titleHighlight}</span>
            </h1>

            {/* Subtitle */}
            <p className={`${DESIGN_TOKENS.text.large} mb-10 max-w-xl text-center lg:text-left mx-auto lg:mx-0 hero-animate-2`}>
              {heroCms.subtitle}
            </p>

            {/* CTA Button with shimmer */}
            <div className="flex justify-center lg:justify-start hero-animate-3">
              <Button
                onClick={scrollToServices}
                size="lg"
                className="btn-shimmer rounded-full bg-primary hover:bg-primary/90 text-primary-foreground px-10 py-7 text-lg shadow-xl shadow-primary/25 hover:shadow-2xl hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 group"
              >
                {heroCms.cta}
                <ArrowDown className="ml-3 w-5 h-5 group-hover:translate-y-1 transition-transform" />
              </Button>
            </div>

            {/* === Social proof — glass card with stats === */}
            <div className="hero-animate-4 mt-12">
              <div className="grid grid-cols-3 gap-3 sm:gap-6 md:gap-8 p-4 sm:p-6 rounded-2xl bg-card/40 backdrop-blur-sm border border-border/30 shadow-lg overflow-hidden transform-gpu">
                {/* Stat: Clients */}
                <div className="flex flex-col sm:flex-row items-center sm:items-center gap-2 sm:gap-3 text-center sm:text-left">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Users className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-lg sm:text-2xl font-bold gradient-text leading-none">{heroCms.statsClients}</div>
                    <div className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">{heroCms.statsClientsLabel}</div>
                  </div>
                </div>
                {/* Stat: Experience */}
                <div className="flex flex-col sm:flex-row items-center sm:items-center gap-2 sm:gap-3 text-center sm:text-left">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Award className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-lg sm:text-2xl font-bold gradient-text leading-none">{yearsOfExperience}{t("cta.stats.years")}</div>
                    <div className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">{heroCms.statsExperienceLabel}</div>
                  </div>
                </div>
                {/* Stat: Success rate */}
                <div className="flex flex-col sm:flex-row items-center sm:items-center gap-2 sm:gap-3 text-center sm:text-left">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-lg sm:text-2xl font-bold gradient-text leading-none">{heroCms.statsSuccessRate}</div>
                    <div className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">{heroCms.statsSuccessLabel}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* === Правая колонка — фото с gradient ring === */}
          <div className="relative order-1 lg:order-2 flex justify-center lg:justify-end hero-animate-photo">
            <div className="relative w-[280px] h-[380px] sm:w-[340px] sm:h-[460px] md:w-[400px] md:h-[540px] lg:w-[460px] lg:h-[630px]">
              {/* Gradient glow ring behind photo */}
              <div className="absolute -inset-3 rounded-[2.5rem] lg:rounded-[3.5rem] bg-gradient-to-br from-primary/30 via-accent/20 to-primary/10 blur-sm animate-glow-pulse -z-10" />

              {/* Photo container */}
              <div className="w-full h-full overflow-hidden rounded-[2rem] lg:rounded-[3rem] shadow-2xl shadow-primary/15 border-2 border-white/20">
                <OptimizedImage
                  webpSrc={elenaHeroWebp}
                  fallbackSrc={elenaHeroJpg}
                  alt={heroCms.title}
                  width={1024}
                  height={1280}
                  loading="eager"
                  fetchPriority="high"
                  className="w-full h-full object-cover object-top"
                />
                {/* Subtle overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-background/20 via-transparent to-transparent rounded-[2rem] lg:rounded-[3rem]" />
              </div>

              {/* Floating accent decorations around photo */}
              <div className="absolute -bottom-6 -left-6 w-28 h-28 bg-primary/15 rounded-full blur-2xl animate-float-slow -z-10" />
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-accent/15 rounded-full blur-2xl animate-float-slow-reverse -z-10" />

            </div>
          </div>
        </div>
      </div>

    </section>
  );
};
