/**
 * About — секция «Обо мне»
 * Bento grid layout: фото слева (sticky), справа — описание,
 * numbered steps (вместо hover-тултипов), badge регалии.
 * Анимации через Reveal (framer-motion whileInView).
 */
import { Heart, Sparkles, Target, Zap, Award, Apple, Shield, Trophy, Star, Users, type LucideIcon } from "@/components/icons";
import elenaAboutWebp from "@/assets/elena-about.webp";
import elenaAboutJpg from "@/assets/elena-about.jpg";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import { useResolvedSiteContent } from "@/hooks/useResolvedSiteContent";
import { motion } from "@/lib/motion";
import { Reveal } from "./animations/Reveal";
import { DESIGN_TOKENS } from "@/lib/design-tokens";

const ABOUT_ICONS: Record<string, LucideIcon> = {
  Heart,
  Zap,
  Apple,
  Target,
  Shield,
  Trophy,
  Star,
  Users,
  Sparkles,
};

export const About = () => {
  const { about: aboutCms } = useResolvedSiteContent();

  const features = aboutCms.features.map((f) => ({
    icon: ABOUT_ICONS[f.icon] ?? Heart,
    text: f.title,
    description: f.description,
  }));

  const regalia = aboutCms.regalia;

  return (
    <section id="about" className={`${DESIGN_TOKENS.section.alt} relative overflow-hidden`}>
      <div className={DESIGN_TOKENS.container}>
        {/* Заголовок секции */}
        <div className="text-center mb-16 md:mb-20">
          <Reveal>
            <h2 className={`${DESIGN_TOKENS.heading.h2}`}>
              {aboutCms.title}{" "}
              <span className="gradient-text">{aboutCms.titleHighlight}</span>
            </h2>
          </Reveal>
          <Reveal delay={0.15}>
            <p className={`${DESIGN_TOKENS.text.large} max-w-2xl mx-auto`}>
              {aboutCms.subtitle}
            </p>
          </Reveal>
        </div>

        {/* Bento grid: фото + контент */}
        <div className="grid lg:grid-cols-[0.85fr_1fr] gap-10 lg:gap-16 items-start">
          {/* === Фото колонка (sticky на десктопе) === */}
          <Reveal delay={0.2}>
            <div className="lg:sticky lg:top-28">
              <div className="relative group rounded-[2.5rem] overflow-hidden border border-border/10 transform-gpu will-change-transform isolate card-drop-shadow-about">
                <div className="relative aspect-[3/4] lg:aspect-[3/4] overflow-hidden rounded-[2.5rem] [border-radius:inherit]">
                  <OptimizedImage
                    webpSrc={elenaAboutWebp}
                    fallbackSrc={elenaAboutJpg}
                    alt={aboutCms.titleHighlight}
                    width={720}
                    height={1280}
                    loading="lazy"
                    className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105 rounded-[2.5rem] [border-radius:inherit]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/30 via-transparent to-transparent" />
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary/20 rounded-full blur-3xl -z-10" />
              <div className="absolute -top-6 -left-6 w-32 h-32 bg-accent/20 rounded-full blur-3xl -z-10" />
            </div>
          </Reveal>

          {/* === Контент колонка === */}
          <div className="space-y-10">
            {/* Описание — три абзаца */}
            <div className="space-y-5">
              {aboutCms.descriptions.map((desc, i) => (
                <Reveal key={i} delay={0.2 + i * 0.1}>
                  <p className={DESIGN_TOKENS.text.muted}>{desc}</p>
                </Reveal>
              ))}
            </div>

            {/* Numbered steps — bento cards (вместо hover-тултипов) */}
            <div className="grid sm:grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <Reveal key={feature.text} delay={0.3 + index * 0.08}>
                  <motion.div
                    whileHover={{ y: -4 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="group p-5 rounded-2xl bg-card/60 backdrop-blur-sm border border-border/30 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 overflow-hidden transform-gpu"
                  >
                    {/* Номер шага + иконка */}
                    <div className="flex items-center gap-3 mb-3">
                      <div className="relative w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <feature.icon className="w-5 h-5 text-primary" />
                        {/* Numbered badge */}
                        <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-primary text-[10px] font-bold text-primary-foreground flex items-center justify-center">
                          {index + 1}
                        </span>
                      </div>
                      <h3 className="text-base font-semibold group-hover:text-primary transition-colors">
                        {feature.text}
                      </h3>
                    </div>
                    {/* Описание — всегда видимо */}
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </motion.div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>

        {/* Регалии — на всю ширину под основным контентом */}
        <div className="mt-16 md:mt-20">
          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            {regalia.map((item, i) => (
              <Reveal key={i} delay={0.4 + i * 0.1}>
                <div className="relative group rounded-3xl bg-white dark:bg-card border border-primary/10 transition-all duration-300 h-full overflow-hidden transform-gpu isolate card-drop-shadow-about">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative p-7 flex items-start gap-5 text-left">
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <Award className="w-7 h-7 text-primary" />
                    </div>
                    <p className="text-base md:text-lg font-medium text-foreground/90 leading-relaxed pt-1">{item}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
