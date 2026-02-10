import { Wrench } from "lucide-react";

const Maintenance = () => (
  <div className="min-h-screen flex items-center justify-center bg-background px-4">
    <div className="text-center max-w-lg animate-fade-in">
      <div className="mb-8 flex justify-center">
        <div className="rounded-full bg-muted p-6">
          <Wrench className="w-16 h-16 text-muted-foreground animate-pulse" />
        </div>
      </div>
      <h1 className="text-3xl md:text-4xl font-bold mb-4">
        Ведутся технические работы
      </h1>
      <p className="text-lg text-muted-foreground mb-2">
        Сайт временно недоступен. Мы уже работаем над обновлениями.
      </p>
      <p className="text-sm text-muted-foreground">
        Скоро вернёмся. Спасибо за понимание.
      </p>
    </div>
  </div>
);

export default Maintenance;
