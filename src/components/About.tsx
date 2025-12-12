import { Heart, Sparkles, Target, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import elenaAbout from "@/assets/elena-about.jpg";

export const About = () => {
  const [isVisible, setIsVisible] = useState(false);
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
    { icon: Heart, text: "Здоровье" },
    { icon: Zap, text: "Энергия" },
    { icon: Sparkles, text: "Питание" },
    { icon: Target, text: "Цели" },
  ];

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
                Я ваш персональный проводник в мире здоровья и фитнеса. Мы выстраиваем стратегию 
                не просто под тело, а под ваш образ жизни, уровень стресса, цели и здоровье.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Моя миссия — помочь вам полностью изменить отношение к телу, питанию и себе.
              </p>

              <div className="grid grid-cols-2 gap-4 pt-4">
                {features.map((feature, index) => (
                  <div
                    key={feature.text}
                    className="relative group"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/50 transition-all duration-300 hover:scale-105 hover:shadow-glow">
                      <feature.icon className="w-8 h-8 text-primary mb-3" />
                      <p className="text-foreground font-medium">{feature.text}</p>
                    </div>
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
