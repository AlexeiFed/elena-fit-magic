import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";
import elenaHero from "@/assets/elena-hero.jpg";

export const Hero = () => {
  const scrollToServices = () => {
    document.getElementById("services")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4">
      {/* Background image with overlay */}
      <div className="absolute inset-0">
        <img 
          src={elenaHero} 
          alt="Елена Пильщакова - персональный фитнес тренер" 
          className="w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/50" />
      </div>

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-float" />
        <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-[120px] animate-float" style={{ animationDelay: "2s" }} />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto text-center">
        <div className="animate-fade-in">
          <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-8xl font-bold mb-6 tracking-tight leading-tight md:leading-snug">
            Персональный фитнес <br />
            <span className="gradient-text">с Еленой Пильщаковой</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
            Комплексное сопровождение для трансформации тела, здоровья и мышления
          </p>
          <Button
            onClick={scrollToServices}
            size="lg"
            className="group relative overflow-hidden bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg rounded-full transition-all duration-300 hover:scale-105 animate-glow"
          >
            Выбрать программу
            <ArrowDown className="ml-2 group-hover:translate-y-1 transition-transform" />
          </Button>
        </div>

      </div>
    </section>
  );
};
