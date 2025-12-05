import { Button } from "@/components/ui/button";
import { Instagram, Send } from "lucide-react";

export const CTA = () => {
  return (
    <section className="py-24 px-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/20 rounded-full blur-[150px] animate-glow" />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center space-y-8">
          <div className="inline-block animate-float">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent mx-auto mb-6 flex items-center justify-center">
              <Send className="w-10 h-10 text-background" />
            </div>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold">
            Готовы изменить <br />
            <span className="gradient-text">свою жизнь?</span>
          </h2>

          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Напишите мне, чтобы узнать детали и начать путь к себе обновленной
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            <Button
              size="lg"
              className="group relative overflow-hidden bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg rounded-full transition-all duration-300 hover:scale-105 min-w-[240px]"
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
              className="group border-2 border-primary/50 hover:border-primary hover:bg-primary/10 px-8 py-6 text-lg rounded-full transition-all duration-300 hover:scale-105 min-w-[240px]"
              asChild
            >
              <a href="https://instagram.com/yourusername" target="_blank" rel="noopener noreferrer">
                <Instagram className="mr-2 group-hover:rotate-12 transition-transform" />
                Написать в Instagram
              </a>
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="grid grid-cols-3 gap-8 pt-16 max-w-2xl mx-auto">
            {[
              { value: "500+", label: "Довольных клиентов" },
              { value: "5 лет", label: "Опыта в фитнесе" },
              { value: "98%", label: "Успешных результатов" },
            ].map((stat, index) => (
              <div
                key={stat.label}
                className="text-center"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="text-3xl md:text-4xl font-bold gradient-text mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
