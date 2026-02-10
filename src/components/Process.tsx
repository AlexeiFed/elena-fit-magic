/**
 * Process — секция «Как это работает»
 * Timeline из 4 шагов: Заявка → Диагностика → Программа → Результат.
 * Горизонтальный layout на десктопе, вертикальный на мобильном.
 * Иконки + краткий текст, staggered Reveal анимации.
 * Фон: section.default (чередование с About section.alt).
 */
import { Send, Stethoscope, ClipboardList, Trophy } from "lucide-react";
import { useI18n } from "@/hooks/useI18n";
import { Reveal } from "./animations/Reveal";
import { DESIGN_TOKENS } from "@/lib/design-tokens";

/** Конфигурация шагов timeline */
const STEPS = [
  { icon: Send, key: "process.step1" },
  { icon: Stethoscope, key: "process.step2" },
  { icon: ClipboardList, key: "process.step3" },
  { icon: Trophy, key: "process.step4" },
] as const;

export const Process = () => {
  const { t } = useI18n();

  return (
    <section id="process" className={`${DESIGN_TOKENS.section.default} relative overflow-hidden`}>
      <div className={DESIGN_TOKENS.container}>
        {/* Заголовок секции */}
        <div className="text-center mb-16 md:mb-20">
          <Reveal>
            <h2 className={DESIGN_TOKENS.heading.h2}>
              {t("process.title")}{" "}
              <span className="gradient-text">{t("process.titleHighlight")}</span>
            </h2>
          </Reveal>
          <Reveal delay={0.15}>
            <p className={`${DESIGN_TOKENS.text.muted} max-w-2xl mx-auto`}>
              {t("process.subtitle")}
            </p>
          </Reveal>
        </div>

        {/* Timeline: горизонтальный на lg+, вертикальный на мобильном */}
        <div className="relative">
          {/* === Горизонтальная соединительная линия (только десктоп) === */}
          <div className="hidden lg:block absolute top-[3.25rem] left-[12%] right-[12%] h-px">
            <div className="w-full h-full bg-gradient-to-r from-primary/10 via-primary/30 to-primary/10 timeline-line-grow" />
          </div>

          {/* === Вертикальная соединительная линия (только мобильный) === */}
          <div className="lg:hidden absolute top-0 bottom-0 left-[1.625rem] w-px">
            <div className="w-full h-full bg-gradient-to-b from-primary/10 via-primary/30 to-primary/10" />
          </div>

          {/* === Шаги === */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-6">
            {STEPS.map((step, index) => (
              <Reveal key={step.key} delay={0.2 + index * 0.12}>
                <div className="relative flex lg:flex-col items-start lg:items-center gap-5 lg:gap-4 group">
                  {/* Номер шага + иконка */}
                  <div className="relative z-10 flex-shrink-0">
                    {/* Glow-подложка */}
                    <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 scale-150" />
                    {/* Круг с иконкой */}
                    <div className="relative w-[3.25rem] h-[3.25rem] rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20 group-hover:shadow-xl group-hover:shadow-primary/30 transition-all duration-300 group-hover:scale-110">
                      <step.icon className="w-5 h-5 text-primary-foreground" />
                    </div>
                    {/* Numbered badge */}
                    <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-background border-2 border-primary text-[10px] font-bold text-primary flex items-center justify-center">
                      {index + 1}
                    </span>
                  </div>

                  {/* Текстовый блок */}
                  <div className="lg:text-center">
                    <h3 className="text-base font-semibold mb-1 group-hover:text-primary transition-colors">
                      {t(`${step.key}.title`)}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {t(`${step.key}.description`)}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
