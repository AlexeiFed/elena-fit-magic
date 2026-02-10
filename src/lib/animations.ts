// Легкие, современные анимации для производительности
// Используют CSS transitions вместо Framer Motion где возможно

export const microAnimations = {
  // Fade in при появлении (используется через Intersection Observer)
  fadeIn: "opacity-0 animate-fade-in",
  
  // Subtle scale on hover для кнопок и карточек
  scaleOnHover: "transition-transform duration-300 hover:scale-[1.02] active:scale-[0.98]",
  
  // Lift effect для карточек
  cardLift: "transition-all duration-300 hover:-translate-y-2 hover:shadow-xl",
  
  // Shimmer effect для загрузки
  shimmer: "animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent bg-[length:200%_100%]",
  
  // Bounce attention для CTA
  bounceAttention: "animate-bounce-subtle",
  
  // Slide in from bottom
  slideInBottom: "animate-slide-in-bottom",
  
  // Slide in from left
  slideInLeft: "animate-slide-in-left",
  
  // Slide in from right  
  slideInRight: "animate-slide-in-right",
};

// Анимации для tailwind.config.ts
export const tailwindAnimations = {
  keyframes: {
    "fade-in": {
      "0%": { opacity: "0", transform: "translateY(10px)" },
      "100%": { opacity: "1", transform: "translateY(0)" },
    },
    "shimmer": {
      "0%": { backgroundPosition: "-200% 0" },
      "100%": { backgroundPosition: "200% 0" },
    },
    "bounce-subtle": {
      "0%, 100%": { transform: "translateY(0)" },
      "50%": { transform: "translateY(-5px)" },
    },
    "slide-in-bottom": {
      "0%": { opacity: "0", transform: "translateY(30px)" },
      "100%": { opacity: "1", transform: "translateY(0)" },
    },
    "slide-in-left": {
      "0%": { opacity: "0", transform: "translateX(-30px)" },
      "100%": { opacity: "1", transform: "translateX(0)" },
    },
    "slide-in-right": {
      "0%": { opacity: "0", transform: "translateX(30px)" },
      "100%": { opacity: "1", transform: "translateX(0)" },
    },
  },
  animation: {
    "fade-in": "fade-in 0.6s ease-out forwards",
    "shimmer": "shimmer 2s infinite",
    "bounce-subtle": "bounce-subtle 2s ease-in-out infinite",
    "slide-in-bottom": "slide-in-bottom 0.5s ease-out forwards",
    "slide-in-left": "slide-in-left 0.5s ease-out forwards",
    "slide-in-right": "slide-in-right 0.5s ease-out forwards",
  },
};
