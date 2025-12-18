import { useEffect, useRef, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  Target,
  Calendar,
  Zap,
  BookOpen,
  Shield,
  Heart,
  Brain,
  TrendingUp,
  CheckCircle2,
  Sparkles,
  Clock,
  Activity,
  Award,
  Lightbulb,
  BarChart3,
  Handshake,
  Microscope,
  RefreshCw,
  UserCheck
} from "lucide-react";

interface PackageInfo {
  id: string;
  title: string;
  whyChoose: {
    title: string;
    description: string;
    icon: React.ReactNode;
  }[];
  whyWorks: {
    title: string;
    description: string;
    icon: React.ReactNode;
  }[];
}

const packages: PackageInfo[] = [
  {
    id: "premium",
    title: "Премиум",
    whyChoose: [
      {
        title: "Максимальная персонализация и глубина",
        description: "Для тех, кто хочет не просто изменить тело, а комплексно улучшить здоровье, разобравшись во всех нюансах: от гормонов и сна до психологии.",
        icon: <Sparkles className="w-5 h-5" />
      },
      {
        title: "Индивидуальный подход как стандарт",
        description: "Твой план питания полностью уникален и пересобирается каждый месяц. Контроль восстановления и консультации профильных специалистов входят в пакет.",
        icon: <Target className="w-5 h-5" />
      },
      {
        title: "Комфорт и гибкость",
        description: "Возможность «заморозки» программы на случай болезни снимает стресс и показывает, что мы заботимся о твоём результате в любых обстоятельствах.",
        icon: <Shield className="w-5 h-5" />
      }
    ],
    whyWorks: [
      {
        title: "Глубинная диагностика",
        description: "Мы работаем не со следствиями, а с причинами. Онлайн-диагностика, разбор анализов и консультации психолога/гастроэнтеролога позволяют выстроить стратегию, которая решает корневые проблемы.",
        icon: <Microscope className="w-5 h-5" />
      },
      {
        title: "Динамическая адаптация",
        description: "Ежемесячная полная корректировка плана (а не точечные правки) учитывает все изменения в вашем организме и жизни, обеспечивая непрерывный прогресс без плато.",
        icon: <RefreshCw className="w-5 h-5" />
      },
      {
        title: "Командный консилиум",
        description: "Над вашим результатом работает связка «тренер + врач + профильный специалист». Решения принимаются коллегиально, что повышает их точность и эффективность в разы.",
        icon: <Users className="w-5 h-5" />
      },
      {
        title: "Гарантия как партнерство",
        description: "Гарантия результата при соблюдении плана — это твоё серьезное обязательство, которое делает тебя не клиентом, а партнером в общем проекте под названием «Ваше здоровье».",
        icon: <Handshake className="w-5 h-5" />
      }
    ]
  },
  {
    id: "basic",
    title: "Базовый",
    whyChoose: [
      {
        title: "Оптимальный старт",
        description: "Это самый популярный формат для тех, кто хочет серьезных изменений под руководством эксперта.",
        icon: <TrendingUp className="w-5 h-5" />
      },
      {
        title: "Полный контроль",
        description: "Ты получаешь персональные тренировки, структуру питания и ежедневную связь с наставником — всё, что нужно для уверенного движения к цели.",
        icon: <CheckCircle2 className="w-5 h-5" />
      },
      {
        title: "Выгода на дистанции",
        description: "Долгосрочные пакеты дают максимальную экономию, мотивируя идти до результата, а не бросать через месяц.",
        icon: <Sparkles className="w-5 h-5" />
      }
    ],
    whyWorks: [
      {
        title: "Персонализация + поддержка",
        description: "Индивидуальный план тренировок и питания, созданный под твой запрос, корректируется еженедельно. Ты не останешься наедине с программой.",
        icon: <UserCheck className="w-5 h-5" />
      },
      {
        title: "Фундамент здоровья",
        description: "Даже в базовом пакете раз в 3 месяца ваши анализы смотрит врач, что гарантирует безопасность и эффективность рекомендаций по БАДам и нагрузкам.",
        icon: <Heart className="w-5 h-5" />
      },
      {
        title: "Принцип постоянства",
        description: "Ежедневная обратная связь и еженедельные корректировки не дают «застрять» на плато и формируют устойчивые привычки.",
        icon: <Clock className="w-5 h-5" />
      },
      {
        title: "Гарантия как обязательство",
        description: "Наличие гарантии результата — это наша уверенность в методике и твоя дополнительная мотивация следовать плану.",
        icon: <Award className="w-5 h-5" />
      }
    ]
  },
  {
    id: "mini-group",
    title: "Мини-группа",
    whyChoose: [
      {
        title: "Идеальный баланс цены и внимания",
        description: "Ты получаешь экспертный контроль и поддержку по стоимости ниже индивидуальных программ, но в группе, где тренер успевает уделить время каждому.",
        icon: <Target className="w-5 h-5" />
      },
      {
        title: "Мотивация окружения",
        description: "Поддержка единомышленников не дают свернуть с пути. Ты не один!",
        icon: <Users className="w-5 h-5" />
      },
      {
        title: "Структура и дисциплина",
        description: "Четкий график онлайн-встреч, еженедельная отчетность и контроль питания создают необходимый ритм для результата.",
        icon: <Calendar className="w-5 h-5" />
      }
    ],
    whyWorks: [
      {
        title: "Эффект синергии",
        description: "Групповая динамика увеличивает личную ответственность и вовлеченность каждого участника.",
        icon: <Zap className="w-5 h-5" />
      },
      {
        title: "Системный подход",
        description: "Обучение принципам питания дает тебе инструменты на всю жизнь, а не просто готовое меню.",
        icon: <BookOpen className="w-5 h-5" />
      },
      {
        title: "Фокус на контроле",
        description: "Проверка каждого приема пищи и техники упражнений исключает главные ошибки новичков, обеспечивая быстрый и безопасный прогресс.",
        icon: <Shield className="w-5 h-5" />
      },
      {
        title: "Командная экспертиза",
        description: "Ты получаешь доступ не только к тренеру, но и к групповой сессии с психологом, что позволяет проработать глубинные причины сложных привычек.",
        icon: <Brain className="w-5 h-5" />
      }
    ]
  },
  {
    id: "curator",
    title: "Сопровождение с куратором",
    whyChoose: [
      {
        title: "Персональный контроль",
        description: "Ежедневная связь с куратором обеспечивает постоянную поддержку и быстрые корректировки плана.",
        icon: <UserCheck className="w-5 h-5" />
      },
      {
        title: "Комплексный подход",
        description: "Индивидуальный план тренировок и питания с регулярной проверкой и корректировкой.",
        icon: <Target className="w-5 h-5" />
      },
      {
        title: "Контроль восстановления",
        description: "Мониторинг сна и восстановления для максимальной эффективности тренировок.",
        icon: <Clock className="w-5 h-5" />
      }
    ],
    whyWorks: [
      {
        title: "Ежедневная обратная связь",
        description: "Постоянный контакт с куратором не дает сбиться с пути и обеспечивает быструю реакцию на изменения.",
        icon: <Activity className="w-5 h-5" />
      },
      {
        title: "Еженедельный контроль",
        description: "Проверка питания и отчеты еженедельно помогают отслеживать прогресс и вносить коррективы.",
        icon: <BarChart3 className="w-5 h-5" />
      },
      {
        title: "Регулярные консультации",
        description: "Консультации раз в 2 недели позволяют глубоко разобрать все вопросы и адаптировать программу.",
        icon: <Users className="w-5 h-5" />
      },
      {
        title: "Системность подхода",
        description: "Комплексный контроль всех аспектов — от тренировок до сна — обеспечивает устойчивый результат.",
        icon: <CheckCircle2 className="w-5 h-5" />
      }
    ]
  },
  {
    id: "nutrition",
    title: "Нутрициология",
    whyChoose: [
      {
        title: "Наука вместо диет",
        description: "Для тех, кто устал от ограничений и хочет понять, как именно твоё тело работает с пищей. Ты получаешь не просто список продуктов, а знания и индивидуальный протокол, основанный на анализах.",
        icon: <Lightbulb className="w-5 h-5" />
      },
      {
        title: "Фокус на здоровье изнутри",
        description: "Основная цель — не только коррекция веса, но и повышение энергии, улучшение качества сна, кожи, работы ЖКТ и общего самочувствия.",
        icon: <Heart className="w-5 h-5" />
      },
      {
        title: "Работа с пищевым поведением",
        description: "В пакете «Трансформация» включена работа с психологом, что помогает убрать «срывы», эмоциональное переедание и выстроить здоровые отношения с едой навсегда.",
        icon: <Brain className="w-5 h-5" />
      }
    ],
    whyWorks: [
      {
        title: "Данные превыше всего",
        description: "Все рекомендации по питанию, БАДам и образу жизни строятся на объективных данных ваших лабораторных анализов, а не на общих советах.",
        icon: <BarChart3 className="w-5 h-5" />
      },
      {
        title: "Мультидисциплинарный подход",
        description: "Команда «нутрициолог + врач + психолог» воздействует на проблему с трех сторон: биохимия, ежедневные привычки и психология.",
        icon: <Users className="w-5 h-5" />
      },
      {
        title: "Образовательный компонент",
        description: "Ты не просто выполняете предписания, а учитесь понимать сигналы своего тела, самостоятельно составлять рацион и принимать осознанные решения о питании.",
        icon: <BookOpen className="w-5 h-5" />
      },
      {
        title: "Поэтапное погружение",
        description: "Пакет «Старт» дает быстрый результат и понимание процесса, а «Трансформация» закрепляет его на уровне устойчивых нейронных связей и привычек, что является ключом к долгосрочному успеху.",
        icon: <Activity className="w-5 h-5" />
      }
    ]
  }
];

export const WhyChoose = () => {
  const [activeTab, setActiveTab] = useState("premium");
  const headingRefs = useRef<Record<string, HTMLHeadingElement | null>>({});
  const userChangedTabRef = useRef(false);

  const handleTabChange = (value: string) => {
    userChangedTabRef.current = true;
    setActiveTab(value);

    // Scroll to heading with delay to ensure DOM is updated
    setTimeout(() => {
      const heading = headingRefs.current[value];
      if (heading) {
        const isMobile = window.innerWidth < 768;
        const offset = isMobile ? 220 : 140; // Larger offset for mobile
        const elementPosition = heading.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({
          top: elementPosition - offset,
          behavior: "smooth"
        });
      }
    }, 50);
  };

  useEffect(() => {
    if (!userChangedTabRef.current) return;
    userChangedTabRef.current = false;
  }, [activeTab]);

  return (
    <section className="py-20 md:py-28 px-4 relative">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight md:leading-snug">
            Что делает наши <span className="gradient-text">программы эффективными</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Узнайте подробнее о каждом формате сопровождения
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          {/* Sticky tabs */}
          <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-sm py-4 -mx-4 px-4">
            <TabsList className="w-full flex flex-wrap justify-center gap-2 h-auto bg-transparent">
              {packages.map((pkg) => (
                <TabsTrigger
                  key={pkg.id}
                  value={pkg.id}
                  className="px-4 py-3 text-sm md:text-base font-medium rounded-full border border-border/50 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary transition-all duration-300 hover:border-primary/50"
                >
                  {pkg.title}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <div className="mt-8">
            {packages.map((pkg) => (
              <TabsContent
                key={pkg.id}
                value={pkg.id}
                className="animate-fade-in transition-all duration-500 ease-out data-[state=active]:opacity-100 data-[state=active]:translate-y-0 data-[state=inactive]:opacity-0 data-[state=inactive]:translate-y-4"
              >
                <div className="space-y-8">
                  {/* Why Choose Section */}
                  <div>
                    <h3
                      ref={(el) => {
                        headingRefs.current[pkg.id] = el;
                      }}
                      className="text-xl md:text-2xl font-bold mb-6 flex items-center gap-3 scroll-mt-40"
                    >
                      <span className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-primary" />
                      </span>
                      Почему выбирают «{pkg.title}»?
                    </h3>
                    <div className="grid md:grid-cols-3 gap-4">
                      {pkg.whyChoose.map((item, index) => (
                        <div
                          key={index}
                          className="group p-6 rounded-2xl bg-card/50 border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5"
                        >
                          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                            <span className="text-primary">{item.icon}</span>
                          </div>
                          <h4 className="font-semibold text-lg mb-2">{item.title}</h4>
                          <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Why It Works Section */}
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold mb-6 flex items-center gap-3">
                      <span className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                        <Zap className="w-5 h-5 text-accent" />
                      </span>
                      Почему это работает?
                    </h3>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {pkg.whyWorks.map((item, index) => (
                        <div
                          key={index}
                          className="group p-5 rounded-2xl bg-gradient-to-br from-card/80 to-card/40 border border-border/50 hover:border-accent/30 transition-all duration-300 hover:shadow-lg hover:shadow-accent/5"
                        >
                          <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center mb-3 group-hover:bg-accent/20 transition-colors">
                            <span className="text-accent">{item.icon}</span>
                          </div>
                          <h4 className="font-semibold mb-2">{item.title}</h4>
                          <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>
            ))}
          </div>
        </Tabs>
      </div>
    </section>
  );
};
