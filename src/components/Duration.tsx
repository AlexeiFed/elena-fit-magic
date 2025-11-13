import { DurationCard } from "./DurationCard";

export const Duration = () => {
  const programs = [
    {
      title: "1 МЕСЯЦ - ДЛЯ СТАРТА",
      duration: "1 месяц",
      description: "Идеально, чтобы попробовать и понять, с чего начать. Первые изменения, перестройка тела и привычек.",
      features: [
        "Разбор анализов",
        "План питания",
        "Назначение БАДов",
        "Контроль сна",
        "Ежедневные отчеты",
      ],
      variant: "light" as const,
    },
    {
      title: "3 МЕСЯЦА - БАЗА И МАКСИМАЛЬНЫЙ РЕЗУЛЬТАТ",
      duration: "3 месяца",
      description: "Основная программа для устойчивого снижения веса и восстановления тела.",
      features: [
        "Перестроение питания",
        "Восстановление энергии",
        "Улучшение сна и пищеварения",
        "Консультации с психологом",
        "Гарантия результата",
      ],
      variant: "dark" as const,
    },
  ];

  return (
    <section className="py-24 px-4 relative">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            Выберите <span className="gradient-text">продолжительность</span> пути
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Каждая программа — это шаг к новой версии себя
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {programs.map((program, index) => (
            <DurationCard key={program.title} {...program} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};
