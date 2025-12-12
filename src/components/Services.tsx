import { ServiceCard } from "./ServiceCard";

export const Services = () => {
  const services = [
    {
      title: "БАЗОВЫЙ ФОРМАТ",
      subtitle: "Для самостоятельных",
      features: [
        "Программа тренировок под ваши цели",
        "Разбор анализов и рекомендации",
        "Ежемесячная консультация",
        "Проверка техники раз в неделю",
        "Поддержка в чате при необходимости",
      ],
    },
    {
      title: "СОПРОВОЖДЕНИЕ С КУРАТОРОМ",
      subtitle: "Постоянный контроль опытного тренера",
      features: [
        "Личный чат с куратором (ежедневно)",
        "Проверка питания и отчеты еженедельно",
        "Индивидуальный план тренировок и питания",
        "Консультации раз в 2 недели",
        "Контроль сна и восстановления",
      ],
    },
    {
      title: "ПРЕМИУМ",
      subtitle: "Личная работа со мной",
      features: [
        "Личное наставничество от Елены",
        "Совместный разбор анализов",
        "Подключение психолога/гастроэнтеролога (со 2-го месяца)",
        "Ежедневная обратная связь",
        "Гарантия результата",
      ],
    },
    {
      title: "МИНИ-ГРУППА",
      subtitle: "Сила команды и индивидуальный подход",
      features: [
        "Группа 5-8 человек",
        "Чат с куратором и лично с Еленой",
        "Обучение питанию и КБЖУ",
        "Индивидуальный план тренировок",
        "Групповые сессии с психологом",
      ],
    },
    {
      title: "СТАРТ",
      subtitle: "Нутрициология (1 месяц)",
      features: [
        "Индивидуальный разбор анализов от врача и нутрициолога",
        "Назначение БАДов на основе результатов",
        "Индивидуальный план питания и КБЖУ",
        "Личное наставничество нутрициолога",
        "Еженедельные отчеты для отслеживания динамики",
      ],
    },
    {
      title: "ТРАНСФОРМАЦИЯ",
      subtitle: "Нутрициология (3 месяца)",
      features: [
        "Всё из «Старта» +",
        "Ежемесячное обновление плана питания",
        "Консультация с психологом по пищевому поведению",
        "Онлайн-консультация с нутрициологом раз в месяц",
        "Гарантия результата при соблюдении всех планов",
      ],
    },
  ];

  return (
    <section id="services" className="py-20 md:py-28 px-4 relative">
      <div className="max-w-5xl mx-auto">
        {/* Sticky header */}
        <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-sm py-4 md:py-6 -mx-4 px-4">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-center leading-tight md:leading-snug">
            Форматы <span className="gradient-text">сопровождения</span>
          </h2>
        </div>
        
        {/* Non-sticky subtitle */}
        <div className="text-center mb-8 md:mb-16 mt-4">
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Выберите формат, который подходит именно вам
          </p>
        </div>
        
        {/* Spacer for sticky header on mobile */}
        <div className="h-4 md:h-0"></div>

        <div className="space-y-8 pb-32">
          {services.map((service, index) => (
            <ServiceCard
              key={service.title}
              {...service}
              index={index}
              totalCards={services.length}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
