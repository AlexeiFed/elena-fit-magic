import { Heart, Sparkles, Target, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
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

  const handleCardInteraction = (text: string, event: React.MouseEvent | React.TouchEvent) => {
    const target = event.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    
    // Random offset for position variety
    const randomOffsetX = (Math.random() - 0.5) * 40;
    const randomOffsetY = (Math.random() - 0.5) * 20;
    
    // Position tooltip near the card with random offset
    const x = rect.width / 2 + randomOffsetX;
    const y = -10 + randomOffsetY;
    
    setTooltipPosition({ x, y });
    setActiveTooltip(activeTooltip === text ? null : text);
  };

  const handleMouseLeave = () => {
    setActiveTooltip(null);
  };

  return (
    <section ref={ref} className="py-20 md:py-28 px-4 relative">
      <div className="max-w-6xl mx-auto">
        <div className={`transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"}`}>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-8 leading-tight md:leading-snug">
            Меня зовут <span className="gradient-text">Елена Пильщакова</span>
          </h2>
          
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

              <div className="grid grid-cols-2 gap-4 pt-4">
                {features.map((feature, index) => (
                  <div
                    key={feature.text}
                    className="relative"
                    style={{ animationDelay: `${index * 100}ms` }}
                    onMouseLeave={handleMouseLeave}
                  >
                    <div 
                      onMouseEnter={(e) => handleCardInteraction(feature.text, e)}
                      onClick={(e) => handleCardInteraction(feature.text, e)}
                      className="p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/50 transition-all duration-300 hover:scale-105 hover:shadow-glow cursor-pointer"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <feature.icon className="w-8 h-8 text-primary" />
                      </div>
                      <p className="text-foreground font-medium">{feature.text}</p>
                    </div>
                    
                    {/* Floating tooltip */}
                    {activeTooltip === feature.text && (
                      <div 
                        className="absolute z-50 w-64 p-4 rounded-xl bg-card/95 backdrop-blur-md border border-primary/30 shadow-2xl animate-fade-in"
                        style={{
                          left: `${tooltipPosition.x}px`,
                          bottom: `calc(100% + ${tooltipPosition.y}px)`,
                          transform: 'translateX(-50%)',
                        }}
                      >
                        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-card/95 border-r border-b border-primary/30 rotate-45" />
                        <p className="text-sm text-foreground/90 leading-relaxed relative z-10">
                          {feature.description}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
