import { Check } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface ServiceCardProps {
  title: string;
  subtitle: string;
  features: string[];
  index: number;
  totalCards: number;
}

export const ServiceCard = ({ title, subtitle, features, index, totalCards }: ServiceCardProps) => {
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

  // Calculate stacking position based on index
  // Each subsequent card goes OVER the previous one
  const translateY = index * 20;
  const zIndex = index + 1;

  return (
    <div
      ref={ref}
      className={`
        sticky transition-all duration-700 
        ${isVisible ? "opacity-100" : "opacity-0 translate-y-20"}
      `}
      style={{
        top: `${100 + translateY}px`,
        zIndex: zIndex,
        transformOrigin: "top center",
        animationDelay: `${index * 150}ms`,
      }}
    >
      <div className="group relative rounded-3xl overflow-hidden transition-all duration-500 hover:scale-[1.02]">
        {/* Glow effect on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
        
        <div className="relative bg-card border border-border/50 group-hover:border-primary/50 rounded-3xl p-6 sm:p-8 md:p-10 backdrop-blur-sm transition-all duration-300 min-h-[380px] sm:min-h-[420px] md:min-h-[450px]">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-2 group-hover:text-primary transition-colors duration-300 pr-16">
            {title}
          </h3>
          <p className="text-muted-foreground text-sm sm:text-base md:text-lg mb-6 md:mb-8">{subtitle}</p>
          
          <ul className="space-y-3 md:space-y-4">
            {features.map((feature, idx) => (
              <li
                key={idx}
                className="flex items-start gap-3 group/item"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <div className="mt-0.5 flex-shrink-0">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-primary/10 flex items-center justify-center group-hover/item:bg-primary/20 transition-colors duration-300">
                    <Check className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
                  </div>
                </div>
                <span className="text-sm sm:text-base text-foreground/90 leading-relaxed">{feature}</span>
              </li>
            ))}
          </ul>

          {/* Card number indicator */}
          <div className="absolute top-6 right-6 sm:top-8 sm:right-8 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg sm:text-xl">
            {index + 1}
          </div>
        </div>
      </div>
    </div>
  );
};
