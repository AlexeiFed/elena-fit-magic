/**
 * CTA — секция призыва к действию
 * Full-width gradient фон, увеличенные кнопки Telegram + Max,
 * без статов (перенесены в Hero).
 */
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import maxLogoWebp from "@/assets/max-logo.webp";
import maxLogoPng from "@/assets/max-logo.png";
import { useI18n } from "@/hooks/useI18n";
import { Reveal } from "./animations/Reveal";
import { DESIGN_TOKENS } from "@/lib/design-tokens";

export const CTA = () => {
  const { t } = useI18n();

  return (
    <section id="cta" className="relative py-24 md:py-32 overflow-visible">
      {/* Background with subtle gradient mesh — clip only the bg */}
      <div className="absolute inset-0 -z-10 bg-muted/30 overflow-hidden">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[100px]" />
      </div>

      <div className={`${DESIGN_TOKENS.container} px-6 md:px-12 relative z-10`}>
        {/* Card Component */}
        <div className="relative max-w-4xl mx-auto rounded-[2.5rem] bg-white border border-primary/5 px-6 py-12 md:px-12 md:py-20 text-center transform-gpu overflow-visible card-drop-shadow">
          
          {/* Decorative background inside card — clipped to rounded shape */}
          <div className="absolute inset-0 pointer-events-none rounded-[2.5rem] overflow-hidden">
            <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
            <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(255,255,255,0.8)_100%)]" />
          </div>

          <div className="relative z-10 w-full mx-auto text-center flex flex-col items-center">
            {/* Heading + subtitle — полная ширина Reveal и явное центрирование */}
            <div className="w-full max-w-2xl mx-auto text-center">
              <Reveal width="100%" overflow="visible">
                <h2 className={`${DESIGN_TOKENS.heading.h2} mb-6 text-center`}>
                  {t("cta.title")} <br />
                  <span className="gradient-text">{t("cta.titleHighlight")}</span>
                </h2>
              </Reveal>

              <Reveal width="100%" overflow="visible" delay={0.1}>
                <p className={`${DESIGN_TOKENS.text.large} mb-10 text-muted-foreground text-center`}>
                  {t("cta.subtitle")}
                </p>
              </Reveal>
            </div>

            {/* Buttons — Reveal не режет при scale */}
            <Reveal width="100%" overflow="visible" delay={0.2}>
              <div className="w-full flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button
                  size="lg"
                  className="btn-shimmer btn-cta-shadow w-full sm:w-56 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground h-14 text-lg font-semibold hover:scale-[1.02] active:scale-[0.98] group transition-all duration-300"
                  asChild
                >
                  <a href="https://t.me/Elena_fitmentor" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
                    <Send className="mr-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    {t("cta.telegram")}
                  </a>
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  className="btn-cta-shadow w-full sm:w-56 rounded-full border-2 border-primary/10 hover:border-primary/30 hover:bg-primary/5 text-foreground hover:text-foreground h-14 text-lg group transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] bg-transparent"
                  asChild
                >
                  <a href="https://max.ru/u/f9LHodD0cOJ_T7iKN2Kw7zp58r7mbJF6Sxnhw0mBrfPbUgYA5AfZYCRnxgE" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
                    <picture className="flex items-center">
                      <source srcSet={maxLogoWebp} type="image/webp" />
                      <img src={maxLogoPng} alt="Max" width={24} height={24} loading="lazy" className="w-6 h-6 mr-2 group-hover:scale-110 transition-transform" />
                    </picture>
                    {t("cta.max")}
                  </a>
                </Button>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
};
