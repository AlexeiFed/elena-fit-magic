import { Clock } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface DurationCardProps {
  title: string;
  duration: string;
  description: string;
  features: string[];
  variant: "light" | "dark";
  index: number;
}

export const DurationCard = ({ title, duration, description, features, variant, index }: DurationCardProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`
        transition-all duration-700
        ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"}
      `}
      style={{ animationDelay: `${index * 200}ms` }}
    >
      <div className={`
        group relative rounded-3xl overflow-hidden p-8 md:p-10 
        transition-all duration-500 hover:scale-[1.02]
        ${variant === "light" 
          ? "bg-card border-2 border-primary/30 hover:border-primary/50" 
          : "bg-gradient-to-br from-primary/10 to-accent/10 border-2 border-primary/50 hover:border-primary"
        }
      `}>
        {/* Animated glow effect */}
        <div className={`
          absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500
          ${variant === "dark" && "bg-gradient-to-br from-primary/20 via-transparent to-accent/20 blur-xl"}
        `} />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className={`
              p-3 rounded-xl
              ${variant === "light" ? "bg-primary/10" : "bg-primary/20"}
            `}>
              <Clock className="w-6 h-6 text-primary" />
            </div>
            <span className={`
              text-sm font-semibold uppercase tracking-wider
              ${variant === "dark" ? "text-primary" : "text-primary/80"}
            `}>
              {duration}
            </span>
          </div>

          <h3 className={`
            text-3xl md:text-4xl font-bold mb-4
            ${variant === "dark" && "gradient-text"}
          `}>
            {title}
          </h3>

          <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
            {description}
          </p>

          <div className="space-y-3">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 text-sm text-foreground/80"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <div className="mt-1 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Decorative corner element */}
        <div className={`
          absolute top-0 right-0 w-32 h-32 opacity-30
          ${variant === "dark" && "bg-gradient-to-br from-primary/20 to-transparent blur-2xl"}
        `} />
      </div>
    </div>
  );
};
