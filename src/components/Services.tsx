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
  ];

  return (
    <section id="services" className="py-24 px-4 relative">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            Форматы <span className="gradient-text">сопровождения</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Выберите формат, который подходит именно вам
          </p>
        </div>

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
