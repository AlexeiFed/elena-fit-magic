import { Check, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ServiceDetailModal } from "./ServiceDetailModal";
import { serviceDetails } from "./serviceDetails";

interface ServiceCardProps {
  title: string;
  subtitle: string;
  features: string[];
  index: number;
  totalCards: number;
}

export const ServiceCard = ({ title, subtitle, features, index, totalCards }: ServiceCardProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const ref = useRef<HTMLDivElement>(null);
  
  const detailData = serviceDetails[title] || null;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const rotateX = (e.clientY - centerY) / 20;
    const rotateY = (centerX - e.clientX) / 20;
    setRotation({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 });
  };

  // Calculate staggered delay based on card position
  const row = Math.floor(index / 3);
  const col = index % 3;
  const delay = (row * 100) + (col * 100);
  
  return (
    <div
      ref={ref}
      className="relative"
      style={{
        perspective: "1000px",
        animation: isVisible 
          ? `fadeInUp 0.6s ease-out ${delay}ms both`
          : 'none',
      }}
    >
      <div 
        className="group relative rounded-3xl overflow-hidden transition-all duration-500 hover:scale-[1.02]"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) translateZ(0)`,
          transformStyle: "preserve-3d",
          transition: rotation.x === 0 && rotation.y === 0 
            ? "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)" 
            : "transform 0.1s ease-out",
          willChange: 'transform',
          backfaceVisibility: 'hidden',
        }}
      >
        {/* Glow effect on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
        
        <div className="relative bg-card border border-border/50 group-hover:border-primary/50 rounded-3xl p-6 sm:p-8 backdrop-blur-sm transition-all duration-300 h-full min-h-[420px] flex flex-col">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 group-hover:text-primary transition-colors duration-300 pr-12">
            {title}
          </h3>
          <p className="text-muted-foreground text-sm md:text-base mb-4">{subtitle}</p>
          
          <ul className="space-y-2 flex-grow">
            {features.map((feature, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2 group/item"
              >
                <div className="mt-0.5 flex-shrink-0">
                  <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center group-hover/item:bg-primary/20 transition-colors duration-300">
                    <Check className="w-3 h-3 text-primary" />
                  </div>
                </div>
                <span className="text-sm text-foreground/90 leading-relaxed">{feature}</span>
              </li>
            ))}
          </ul>

          {/* Details button */}
          <div className="mt-4 pt-4 border-t border-border/30">
            <Button
              variant="ghost"
              className="w-full justify-between text-primary hover:text-primary hover:bg-primary/10 group/btn"
              onClick={() => setIsModalOpen(true)}
            >
              <span>Подробнее</span>
              <ChevronRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
            </Button>
          </div>

          {/* Card number indicator */}
          <div className="absolute top-6 right-6 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm sm:text-base">
            {index + 1}
          </div>
        </div>
      </div>
      
      <ServiceDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        data={detailData}
      />
    </div>
  );
};
