import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, ArrowRight } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="text-center max-w-lg">
        {/* 404 Number */}
        <div className="mb-8">
          <h1 className="text-9xl md:text-[150px] font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-pulse">
            404
          </h1>
        </div>

        {/* Message */}
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Страница не найдена
          </h2>
          <p className="text-lg text-muted-foreground mb-2">
            К сожалению, страница, которую вы ищете, не существует или была перемещена.
          </p>
          <p className="text-sm text-muted-foreground">
            Путь: <code className="text-xs bg-card px-2 py-1 rounded">{location.pathname}</code>
          </p>
        </div>

        {/* Illustration */}
        <div className="mb-12 text-6xl opacity-20">
          🏋️
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            size="lg" 
            className="gap-2"
            onClick={() => navigate("/")}
          >
            <Home className="w-5 h-5" />
            На главную
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            className="gap-2"
            onClick={() => window.history.back()}
          >
            <ArrowRight className="w-5 h-5 rotate-180" />
            Вернуться назад
          </Button>
        </div>

        {/* Helpful links */}
        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground mb-4">
            Может быть полезно:
          </p>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="/#services" className="text-primary hover:underline">
                Форматы сопровождения
              </a>
            </li>
            <li>
              <a href="/#about" className="text-primary hover:underline">
                О программе
              </a>
            </li>
            <li>
              <a href="https://t.me/Elena_fittrainer" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                Связаться со мной
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
