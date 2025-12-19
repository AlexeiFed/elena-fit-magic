import { Heart, Sparkles, Target, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import elenaAbout from "@/assets/elena-about.jpg";

interface TooltipPosition {
  x: number;
  y: number;
}

export const About = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<TooltipPosition>({ x: 0, y: 0 });
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  const features = [
    {
      icon: Heart,
      text: "Здоровье",
      description: "Комплексный подход к вашему здоровью: анализ показателей, работа с врачами и создание устойчивых привычек для долгосрочного результата."
    },
    {
      icon: Zap,
      text: "Энергия",
      description: "Восстановление энергетического баланса через правильное питание, режим сна и физическую активность для максимальной продуктивности."
    },
    {
      icon: Sparkles,
      text: "Питание",
      description: "Индивидуальный план питания на основе ваших целей, предпочтений и особенностей организма — без жёстких диет и ограничений."
    },
    {
      icon: Target,
      text: "Цели",
      description: "Постановка реалистичных целей и пошаговая стратегия их достижения с регулярным отслеживанием прогресса и корректировкой плана."
    },
  ];

  const handleCardInteraction = (text: string, index: number, event: React.MouseEvent | React.TouchEvent) => {
    const target = event.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const tooltipWidth = 320;
    const tooltipHeight = 100;
    const x = rect.left + rect.width / 2 - tooltipWidth / 2;
    const y = rect.top - tooltipHeight - 12;
    setTooltipPosition({ x, y });
    setActiveTooltip(text);
  };

  const handleMouseLeave = () => {
    setActiveTooltip(null);
  };

  // Hide tooltip on scroll/touchmove for mobile devices
  useEffect(() => {
    if (!activeTooltip) return;
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    if (!isMobile) return;

    const hide = () => setActiveTooltip(null);
    window.addEventListener('scroll', hide, { passive: true });
    window.addEventListener('touchmove', hide, { passive: true });

    return () => {
      window.removeEventListener('scroll', hide);
      window.removeEventListener('touchmove', hide as any);
    };
  }, [activeTooltip]);

  return (
    <section ref={ref} className="py-20 md:py-28 px-4 relative">
      <div className="max-w-6xl mx-auto">
        <div className={`transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"}`}>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-8 leading-tight md:leading-snug">
            Меня зовут <span className="gradient-text">Елена Пильщакова</span>
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground text-center mb-6">
            Фитнес тренер международного уровня, нутрициолог, наставник
          </p>

          <div className="grid md:grid-cols-2 gap-12 items-center mt-16">
            {/* Image */}
            <div className="relative order-2 md:order-1">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src={elenaAbout}
                  alt="Елена Пильщакова - чемпион по фитнес-бикини"
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/50 via-transparent to-transparent" />
              </div>
              {/* Decorative glow */}
              <div className="absolute -inset-4 bg-primary/20 rounded-3xl blur-3xl -z-10 opacity-50" />
            </div>

            <div className="space-y-6 order-1 md:order-2">
              <p className="text-lg text-muted-foreground leading-relaxed">
                Я — ваш персональный проводник в мире здоровья и фитнеса. Выстраиваю стратегию не просто под тело, а под ваш образ жизни, цели и состояние здоровья.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                В своей работе я опираюсь не только на личную экспертизу, но и на команду специалистов, с которыми мы сопровождаем вас комплексно и безопасно — от питания и тренировок до вашего желаемого результата, восстановления и самочувствия.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Моя миссия — помочь вам изменить отношение к телу, питанию и себе, чтобы результат стал частью вашей жизни.
              </p>

              <div className="my-6 flex justify-center">
                <div className="bg-card border border-border/50 rounded-2xl p-4 max-w-xl w-full text-sm md:text-base">
                  <h4 className="text-lg font-semibold mb-3 text-center text-primary">Регалии</h4>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-3">
                      <span className="mt-1 w-2 h-2 rounded-full bg-primary/70 flex-shrink-0" />
                      <span>
                        Чемпионка Дальнего Востока по бодибилдингу в категории эстетический фитнес 2014г. (Гран-при Амур)
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-1 w-2 h-2 rounded-full bg-primary/70 flex-shrink-0" />
                      <span>
                        Бронзовая призерка Приморского края Российской Федерации 2024г.
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4">
                {features.map((feature, index) => {
                  const isLeftSide = index % 2 === 0;
                  const animationClass = isLeftSide ? 'animate-slide-in-left' : 'animate-slide-in-right';

                  return (
                    <div
                      key={feature.text}
                      className={`relative p-6 bg-card rounded-2xl border border-border/50 hover:border-primary/50 transition-all duration-300 cursor-pointer group ${isVisible ? animationClass : 'opacity-0'
                        }`}
                      style={{
                        animationFillMode: 'both',
                        animationDelay: `${index * 100}ms`,
                      }}
                      onMouseEnter={(e) => handleCardInteraction(feature.text, index, e)}
                      onMouseLeave={handleMouseLeave}
                      onTouchStart={(e) => handleCardInteraction(feature.text, index, e as any)}
                      onTouchEnd={handleMouseLeave}
                    >
                      <div className="flex items-center gap-2 md:gap-4 min-w-0">
                        <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary/20 transition-colors duration-300">
                          <feature.icon className="w-5 h-5 md:w-6 md:h-6" />
                        </div>
                        <h3 className="text-sm md:text-lg font-semibold group-hover:text-primary transition-colors duration-300 truncate">
                          {feature.text}
                        </h3>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {activeTooltip && createPortal(
        <div
          className="fixed z-[100] pointer-events-none"
          style={{
            left: `${Math.max(8, Math.min(tooltipPosition.x, window.innerWidth - 328))}px`,
            top: `${Math.max(8, tooltipPosition.y)}px`,
            width: "320px",
          }}
        >
          <div className="relative p-4 bg-card border border-border rounded-lg shadow-lg" style={{
            animation: "tooltipFadeIn 0.25s ease-out forwards",
          }}>
            <p className="text-sm text-muted-foreground">
              {features.find(f => f.text === activeTooltip)?.description}
            </p>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-card border-b border-r border-border transform rotate-45" />
          </div>
        </div>,
        document.body
      )}
    </section>
  );
};
