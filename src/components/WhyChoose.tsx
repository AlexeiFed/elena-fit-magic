import { useState, useRef, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useI18n } from "@/hooks/useI18n";
import { motion, AnimatePresence } from "framer-motion";
import { TextReveal, Reveal } from "./animations/Reveal";
import { DESIGN_TOKENS } from "@/lib/design-tokens";
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

export const WhyChoose = () => {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState("premium");
  const headingRefs = useRef<Record<string, HTMLHeadingElement | null>>({});

  const getPackageTranslations = (packageId: string, type: 'whyChoose' | 'whyWorks', index: number) => {
    const key = `whyChoose.packages.${packageId}.${type}.${index}`;
    return {
      title: t(`${key}.title`),
      description: t(`${key}.description`)
    };
  };

  const packages: PackageInfo[] = [
    {
      id: "premium",
      title: t("whyChoose.packages.premium.title"),
      whyChoose: [
        {
          title: getPackageTranslations("premium", "whyChoose", 0).title,
          description: getPackageTranslations("premium", "whyChoose", 0).description,
          icon: <Sparkles className="w-5 h-5" />
        },
        {
          title: getPackageTranslations("premium", "whyChoose", 1).title,
          description: getPackageTranslations("premium", "whyChoose", 1).description,
          icon: <Target className="w-5 h-5" />
        },
        {
          title: getPackageTranslations("premium", "whyChoose", 2).title,
          description: getPackageTranslations("premium", "whyChoose", 2).description,
          icon: <Shield className="w-5 h-5" />
        }
      ],
      whyWorks: [
        {
          title: getPackageTranslations("premium", "whyWorks", 0).title,
          description: getPackageTranslations("premium", "whyWorks", 0).description,
          icon: <Microscope className="w-5 h-5" />
        },
        {
          title: getPackageTranslations("premium", "whyWorks", 1).title,
          description: getPackageTranslations("premium", "whyWorks", 1).description,
          icon: <RefreshCw className="w-5 h-5" />
        },
        {
          title: getPackageTranslations("premium", "whyWorks", 2).title,
          description: getPackageTranslations("premium", "whyWorks", 2).description,
          icon: <Users className="w-5 h-5" />
        },
        {
          title: getPackageTranslations("premium", "whyWorks", 3).title,
          description: getPackageTranslations("premium", "whyWorks", 3).description,
          icon: <Handshake className="w-5 h-5" />
        }
      ]
    },
    {
      id: "basic",
      title: t("whyChoose.packages.basic.title"),
      whyChoose: [
        {
          title: getPackageTranslations("basic", "whyChoose", 0).title,
          description: getPackageTranslations("basic", "whyChoose", 0).description,
          icon: <TrendingUp className="w-5 h-5" />
        },
        {
          title: getPackageTranslations("basic", "whyChoose", 1).title,
          description: getPackageTranslations("basic", "whyChoose", 1).description,
          icon: <CheckCircle2 className="w-5 h-5" />
        },
        {
          title: getPackageTranslations("basic", "whyChoose", 2).title,
          description: getPackageTranslations("basic", "whyChoose", 2).description,
          icon: <Sparkles className="w-5 h-5" />
        }
      ],
      whyWorks: [
        {
          title: getPackageTranslations("basic", "whyWorks", 0).title,
          description: getPackageTranslations("basic", "whyWorks", 0).description,
          icon: <UserCheck className="w-5 h-5" />
        },
        {
          title: getPackageTranslations("basic", "whyWorks", 1).title,
          description: getPackageTranslations("basic", "whyWorks", 1).description,
          icon: <Heart className="w-5 h-5" />
        },
        {
          title: getPackageTranslations("basic", "whyWorks", 2).title,
          description: getPackageTranslations("basic", "whyWorks", 2).description,
          icon: <Clock className="w-5 h-5" />
        },
        {
          title: getPackageTranslations("basic", "whyWorks", 3).title,
          description: getPackageTranslations("basic", "whyWorks", 3).description,
          icon: <Award className="w-5 h-5" />
        }
      ]
    },
    {
      id: "mini-group",
      title: t("whyChoose.packages.mini-group.title"),
      whyChoose: [
        {
          title: getPackageTranslations("mini-group", "whyChoose", 0).title,
          description: getPackageTranslations("mini-group", "whyChoose", 0).description,
          icon: <Target className="w-5 h-5" />
        },
        {
          title: getPackageTranslations("mini-group", "whyChoose", 1).title,
          description: getPackageTranslations("mini-group", "whyChoose", 1).description,
          icon: <Users className="w-5 h-5" />
        },
        {
          title: getPackageTranslations("mini-group", "whyChoose", 2).title,
          description: getPackageTranslations("mini-group", "whyChoose", 2).description,
          icon: <Calendar className="w-5 h-5" />
        }
      ],
      whyWorks: [
        {
          title: getPackageTranslations("mini-group", "whyWorks", 0).title,
          description: getPackageTranslations("mini-group", "whyWorks", 0).description,
          icon: <Zap className="w-5 h-5" />
        },
        {
          title: getPackageTranslations("mini-group", "whyWorks", 1).title,
          description: getPackageTranslations("mini-group", "whyWorks", 1).description,
          icon: <BookOpen className="w-5 h-5" />
        },
        {
          title: getPackageTranslations("mini-group", "whyWorks", 2).title,
          description: getPackageTranslations("mini-group", "whyWorks", 2).description,
          icon: <Shield className="w-5 h-5" />
        },
        {
          title: getPackageTranslations("mini-group", "whyWorks", 3).title,
          description: getPackageTranslations("mini-group", "whyWorks", 3).description,
          icon: <Brain className="w-5 h-5" />
        }
      ]
    },
    {
      id: "curator",
      title: t("whyChoose.packages.curator.title"),
      whyChoose: [
        {
          title: getPackageTranslations("curator", "whyChoose", 0).title,
          description: getPackageTranslations("curator", "whyChoose", 0).description,
          icon: <UserCheck className="w-5 h-5" />
        },
        {
          title: getPackageTranslations("curator", "whyChoose", 1).title,
          description: getPackageTranslations("curator", "whyChoose", 1).description,
          icon: <Target className="w-5 h-5" />
        },
        {
          title: getPackageTranslations("curator", "whyChoose", 2).title,
          description: getPackageTranslations("curator", "whyChoose", 2).description,
          icon: <Clock className="w-5 h-5" />
        }
      ],
      whyWorks: [
        {
          title: getPackageTranslations("curator", "whyWorks", 0).title,
          description: getPackageTranslations("curator", "whyWorks", 0).description,
          icon: <Activity className="w-5 h-5" />
        },
        {
          title: getPackageTranslations("curator", "whyWorks", 1).title,
          description: getPackageTranslations("curator", "whyWorks", 1).description,
          icon: <BarChart3 className="w-5 h-5" />
        },
        {
          title: getPackageTranslations("curator", "whyWorks", 2).title,
          description: getPackageTranslations("curator", "whyWorks", 2).description,
          icon: <Users className="w-5 h-5" />
        },
        {
          title: getPackageTranslations("curator", "whyWorks", 3).title,
          description: getPackageTranslations("curator", "whyWorks", 3).description,
          icon: <CheckCircle2 className="w-5 h-5" />
        }
      ]
    },
    {
      id: "nutrition",
      title: t("whyChoose.packages.nutrition.title"),
      whyChoose: [
        {
          title: getPackageTranslations("nutrition", "whyChoose", 0).title,
          description: getPackageTranslations("nutrition", "whyChoose", 0).description,
          icon: <Lightbulb className="w-5 h-5" />
        },
        {
          title: getPackageTranslations("nutrition", "whyChoose", 1).title,
          description: getPackageTranslations("nutrition", "whyChoose", 1).description,
          icon: <Heart className="w-5 h-5" />
        },
        {
          title: getPackageTranslations("nutrition", "whyChoose", 2).title,
          description: getPackageTranslations("nutrition", "whyChoose", 2).description,
          icon: <Brain className="w-5 h-5" />
        }
      ],
      whyWorks: [
        {
          title: getPackageTranslations("nutrition", "whyWorks", 0).title,
          description: getPackageTranslations("nutrition", "whyWorks", 0).description,
          icon: <BarChart3 className="w-5 h-5" />
        },
        {
          title: getPackageTranslations("nutrition", "whyWorks", 1).title,
          description: getPackageTranslations("nutrition", "whyWorks", 1).description,
          icon: <Users className="w-5 h-5" />
        },
        {
          title: getPackageTranslations("nutrition", "whyWorks", 2).title,
          description: getPackageTranslations("nutrition", "whyWorks", 2).description,
          icon: <BookOpen className="w-5 h-5" />
        },
        {
          title: getPackageTranslations("nutrition", "whyWorks", 3).title,
          description: getPackageTranslations("nutrition", "whyWorks", 3).description,
          icon: <Activity className="w-5 h-5" />
        }
      ]
    }
  ];

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    
    setTimeout(() => {
      const heading = headingRefs.current[value];
      if (heading) {
        const offset = window.innerWidth < 768 ? 320 : 200; // navbar(64) + sticky tabs(~90) + запас
        const elementPosition = heading.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({
          top: elementPosition - offset,
          behavior: "smooth"
        });
      }
    }, 50);
  };

  return (
    <section className={`${DESIGN_TOKENS.sectionPadding} relative`}>
      <div className={DESIGN_TOKENS.container}>
        <div className="text-center mb-16">
          <div className={`${DESIGN_TOKENS.heading.h2} flex flex-wrap justify-center items-center gap-x-2 mb-6`}>
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              {t("whyChoose.title")}
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="gradient-text"
            >
              {t("whyChoose.titleHighlight")}
            </motion.span>
          </div>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`${DESIGN_TOKENS.text.muted} max-w-2xl mx-auto`}
          >
            {t("whyChoose.subtitle")}
          </motion.p>
        </div>

        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <div className="sticky top-16 z-30 bg-background/95 backdrop-blur-xl py-3 sm:py-6 -mx-4 px-4 mb-12 sm:mb-16 shadow-sm">
            <TabsList className="w-full flex flex-wrap justify-center gap-2 sm:gap-3 h-auto bg-transparent">
              {packages.map((pkg) => {
                const titleKey = `whyChoose.packages.${pkg.id}.title`;
                const translatedTitle = t(titleKey) !== titleKey ? t(titleKey) : pkg.title;
                return (
                  <TabsTrigger
                    key={pkg.id}
                    value={pkg.id}
                    className="px-4 sm:px-6 py-2 sm:py-3 text-sm md:text-base font-semibold rounded-full border border-white/10 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg data-[state=active]:shadow-primary/20 transition-all duration-300 hover:bg-white/5"
                  >
                    {translatedTitle}
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              {packages.map((pkg) => (
                <TabsContent key={pkg.id} value={pkg.id} className="mt-0 outline-none">
                  <div className="space-y-16">
                    {/* Why Choose Section */}
                    <div className="space-y-8">
                      <h3
                        ref={(el) => (headingRefs.current[pkg.id] = el)}
                        className={`${DESIGN_TOKENS.heading.h3} flex items-center gap-4 scroll-mt-[200px]`}
                      >
                        <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary">
                          <Sparkles className="w-6 h-6" />
                        </div>
                        {t("whyChoose.whyChoose", { package: pkg.title })}
                      </h3>
                      
                      <div className="grid md:grid-cols-3 gap-6">
                        {pkg.whyChoose.map((item, index) => (
                          <div
                            key={index}
                            className={`p-8 ${DESIGN_TOKENS.card} ${DESIGN_TOKENS.shadow.sm} hover:border-primary/30 hover:-translate-y-1 transition-all duration-300 group flex flex-col h-full`}
                          >
                            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors flex-shrink-0">
                              <span className="text-primary">{item.icon}</span>
                            </div>
                            <h4 className="text-lg font-bold mb-3">{item.title}</h4>
                            <p className={`${DESIGN_TOKENS.text.muted} flex-grow`}>{item.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Why It Works Section */}
                    <div className="space-y-8">
                      <h3 className={`${DESIGN_TOKENS.heading.h3} flex items-center gap-4`}>
                        <div className="w-12 h-12 rounded-2xl bg-accent/20 flex items-center justify-center text-accent">
                          <Zap className="w-6 h-6" />
                        </div>
                        {t("whyChoose.whyWorks")}
                      </h3>
                      
                      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {pkg.whyWorks.map((item, index) => (
                          <div
                            key={index}
                            className={`p-6 ${DESIGN_TOKENS.card} bg-gradient-to-br from-card/50 to-transparent hover:border-accent/30 hover:-translate-y-1 transition-all duration-300 group`}
                          >
                            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center mb-5 group-hover:bg-accent/20 transition-colors">
                              <span className="text-accent">{item.icon}</span>
                            </div>
                            <h4 className="text-lg font-bold mb-2">{item.title}</h4>
                            <p className={`${DESIGN_TOKENS.text.muted}`}>{item.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>
              ))}
            </motion.div>
          </AnimatePresence>
        </Tabs>
      </div>
    </section>
  );
};
