import { Send } from "lucide-react";
import maxLogo from "@/assets/max-logo.png";

export const Footer = () => {
  return (
    <footer className="py-12 px-4 border-t border-border/50">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-bold gradient-text mb-2">
              Елена Пильщакова
            </h3>
            <p className="text-sm text-muted-foreground">
              Персональный фитнес-тренер
            </p>
          </div>

          <div className="flex gap-4">
            <a
              href="https://t.me/yourusername"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-full bg-card border border-border/50 hover:border-primary/50 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:bg-primary/10"
            >
              <Send className="w-5 h-5 text-primary" />
            </a>
            <a
              href="https://max.me/yourusername"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-full bg-card border border-border/50 hover:border-primary/50 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:bg-primary/10"
            >
              <img src={maxLogo} alt="Max" className="w-6 h-6" />
            </a>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border/30 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Елена Пильщакова. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
};
