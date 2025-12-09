import { Diamond, Lightbulb, Users, BookOpen, Layers } from "lucide-react";

export const NutritionInfoSection = () => {
  const whyChoose = [
    {
      icon: Lightbulb,
      title: "Наука вместо диет",
      description:
        "Для тех, кто устал от ограничений и хочет понять, как именно твоё тело работает с пищей. Ты получаешь не просто список продуктов, а знания и индивидуальный протокол, основанный на анализах.",
    },
    {
      icon: Diamond,
      title: "Фокус на здоровье изнутри",
      description:
        "Основная цель — не только коррекция веса, но и повышение энергии, улучшение качества сна, кожи, работы ЖКТ и общего самочувствия.",
    },
    {
      icon: Users,
      title: "Работа с пищевым поведением",
      description:
        'В пакете «Трансформация» включена работа с психологом, что помогает убрать «срывы», эмоциональное переедание и выстроить здоровые отношения с едой навсегда.',
    },
  ];

  const whyWorks = [
    {
      icon: Diamond,
      title: "Данные превыше всего",
      description:
        "Все рекомендации по питанию, БАДам и образу жизни строятся на объективных данных ваших лабораторных анализов, а не на общих советах.",
    },
    {
      icon: Users,
      title: "Мультидисциплинарный подход",
      description:
        'Команда «нутрициолог + врач + психолог» воздействует на проблему с трех сторон: биохимия, ежедневные привычки и психология.',
    },
    {
      icon: BookOpen,
      title: "Образовательный компонент",
      description:
        "Ты не просто выполняешь предписания, а учишься понимать сигналы своего тела, самостоятельно составлять рацион и принимать осознанные решения о питании.",
    },
    {
      icon: Layers,
      title: "Поэтапное погружение",
      description:
        'Пакет «Старт» дает быстрый результат и понимание процесса, а «Трансформация» закрепляет его на уровне устойчивых нейронных связей и привычек, что является ключом к долгосрочному успеху.',
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h4 className="text-lg font-semibold text-primary mb-4">
          Почему выбирают нутрициологическое сопровождение?
        </h4>
        <div className="space-y-4">
          {whyChoose.map((item, idx) => (
            <div key={idx} className="flex gap-3">
              <item.icon className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
              <div>
                <h5 className="font-medium text-foreground">{item.title}</h5>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-lg font-semibold text-primary mb-4">Почему это работает?</h4>
        <div className="space-y-4">
          {whyWorks.map((item, idx) => (
            <div key={idx} className="flex gap-3">
              <item.icon className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
              <div>
                <h5 className="font-medium text-foreground">{item.title}</h5>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
