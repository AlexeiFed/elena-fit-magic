import { Button } from "@/components/ui/button";
import { Instagram, Send } from "lucide-react";
import { useCountUp } from "@/hooks/useCountUp";

const AnimatedStat = ({ value, suffix, label }: { value: number; suffix: string; label: string }) => {
  const { count, ref } = useCountUp(value, 2000);
  
  return (
    <div ref={ref} className="text-center">
      <div className="text-2xl sm:text-3xl md:text-4xl font-bold gradient-text mb-2">
        {count}{suffix}
      </div>
      <div className="text-xs sm:text-sm text-muted-foreground">{label}</div>
    </div>
  );
};

export const CTA = () => {
  return (
    <section className="py-20 md:py-28 px-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/20 rounded-full blur-[150px] animate-glow" />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center space-y-6 md:space-y-8">
          <div className="inline-block animate-float">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-primary to-accent mx-auto mb-4 md:mb-6 flex items-center justify-center">
              <Send className="w-8 h-8 md:w-10 md:h-10 text-background" />
            </div>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-7xl font-bold leading-tight md:leading-snug">
            Готовы изменить <br />
            <span className="gradient-text">свою жизнь?</span>
          </h2>

          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Напишите мне, чтобы узнать детали и начать путь к себе обновленной
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4 md:pt-8">
            <Button
              size="lg"
              className="group relative overflow-hidden bg-primary hover:bg-primary/90 text-primary-foreground px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg rounded-full transition-all duration-300 hover:scale-105 min-w-[200px] sm:min-w-[240px]"
              asChild
            >
              <a href="https://t.me/yourusername" target="_blank" rel="noopener noreferrer">
                <Send className="mr-2 group-hover:translate-x-1 transition-transform" />
                Написать в Telegram
              </a>
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="group border-2 border-primary/50 hover:border-primary hover:bg-primary/10 px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg rounded-full transition-all duration-300 hover:scale-105 min-w-[200px] sm:min-w-[240px]"
              asChild
            >
              <a href="https://instagram.com/yourusername" target="_blank" rel="noopener noreferrer">
                <Instagram className="mr-2 group-hover:rotate-12 transition-transform" />
                Написать в Instagram
              </a>
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="grid grid-cols-3 gap-4 sm:gap-8 pt-10 md:pt-16 max-w-2xl mx-auto">
            <AnimatedStat value={500} suffix="+" label="Довольных клиентов" />
            <AnimatedStat value={5} suffix=" лет" label="Опыта в фитнесе" />
            <AnimatedStat value={98} suffix="%" label="Успешных результатов" />
          </div>
        </div>
      </div>
    </section>
  );
};
