/**
 * Страница «Политика конфиденциальности»
 * Локализована через систему useI18n() — поддерживает RU и EN
 */
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "@/components/icons";
import { useI18n } from "@/hooks/useI18n";

const Privacy = () => {
    const navigate = useNavigate();
    const { t, language } = useI18n();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-background">
            {/* Header with back button */}
            <div className="sticky top-0 z-50 border-b border-border/50 bg-background/95 backdrop-blur-sm">
                <div className="max-w-4xl mx-auto px-4 py-4">
                    <Button
                        variant="ghost"
                        className="gap-2"
                        onClick={() => navigate("/")}
                    >
                        <ChevronLeft className="w-4 h-4" />
                        {t("privacy.backButton")}
                    </Button>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 py-12 md:py-16">
                <div className="mb-8">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        {t("privacy.title")}
                    </h1>
                    <p className="text-muted-foreground text-lg">
                        {t("privacy.lastUpdated")} {language === "ru" ? "08.02.2026" : "02/08/2026"}
                    </p>
                </div>

                <div className="space-y-8 prose prose-invert max-w-none">
                    {/* Section 1 */}
                    <section>
                        <h2 className="text-2xl font-bold mb-4">{t("privacy.section1.title")}</h2>
                        <p className="text-foreground/90 leading-relaxed mb-4">
                            {t("privacy.section1.p1")}
                        </p>
                        <p className="text-foreground/90 leading-relaxed">
                            {t("privacy.section1.p2")}
                        </p>
                    </section>

                    {/* Section 2 */}
                    <section>
                        <h2 className="text-2xl font-bold mb-4">{t("privacy.section2.title")}</h2>
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-lg font-semibold mb-2">{t("privacy.section2.sub1.title")}</h3>
                                <ul className="list-disc list-inside space-y-2 text-foreground/90">
                                    <li>{t("privacy.section2.sub1.item1")}</li>
                                    <li>{t("privacy.section2.sub1.item2")}</li>
                                    <li>{t("privacy.section2.sub1.item3")}</li>
                                    <li>{t("privacy.section2.sub1.item4")}</li>
                                    <li>{t("privacy.section2.sub1.item5")}</li>
                                    <li>{t("privacy.section2.sub1.item6")}</li>
                                    <li>{t("privacy.section2.sub1.item7")}</li>
                                    <li>{t("privacy.section2.sub1.item8")}</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold mb-2">{t("privacy.section2.sub2.title")}</h3>
                                <ul className="list-disc list-inside space-y-2 text-foreground/90">
                                    <li>{t("privacy.section2.sub2.item1")}</li>
                                    <li>{t("privacy.section2.sub2.item2")}</li>
                                    <li>{t("privacy.section2.sub2.item3")}</li>
                                    <li>{t("privacy.section2.sub2.item4")}</li>
                                    <li>{t("privacy.section2.sub2.item5")}</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* Section 3 */}
                    <section>
                        <h2 className="text-2xl font-bold mb-4">{t("privacy.section3.title")}</h2>
                        <p className="text-foreground/90 leading-relaxed mb-4">
                            {t("privacy.section3.intro")}
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-foreground/90 mb-4">
                            <li><strong>{t("privacy.section3.item1")}</strong> {t("privacy.section3.item1.desc")}</li>
                            <li><strong>{t("privacy.section3.item2")}</strong> {t("privacy.section3.item2.desc")}</li>
                            <li><strong>{t("privacy.section3.item3")}</strong> {t("privacy.section3.item3.desc")}</li>
                            <li><strong>{t("privacy.section3.item4")}</strong> {t("privacy.section3.item4.desc")}</li>
                            <li><strong>{t("privacy.section3.item5")}</strong> {t("privacy.section3.item5.desc")}</li>
                            <li><strong>{t("privacy.section3.item6")}</strong> {t("privacy.section3.item6.desc")}</li>
                            <li><strong>{t("privacy.section3.item7")}</strong> {t("privacy.section3.item7.desc")}</li>
                        </ul>
                    </section>

                    {/* Section 4 */}
                    <section>
                        <h2 className="text-2xl font-bold mb-4">{t("privacy.section4.title")}</h2>
                        <p className="text-foreground/90 leading-relaxed mb-4">
                            {t("privacy.section4.intro")}
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-foreground/90">
                            <li><strong>{t("privacy.section4.item1")}</strong> {t("privacy.section4.item1.desc")}</li>
                            <li><strong>{t("privacy.section4.item2")}</strong> {t("privacy.section4.item2.desc")}</li>
                            <li><strong>{t("privacy.section4.item3")}</strong> {t("privacy.section4.item3.desc")}</li>
                            <li><strong>{t("privacy.section4.item4")}</strong> {t("privacy.section4.item4.desc")}</li>
                        </ul>
                    </section>

                    {/* Section 5 */}
                    <section>
                        <h2 className="text-2xl font-bold mb-4">{t("privacy.section5.title")}</h2>
                        <p className="text-foreground/90 leading-relaxed mb-4">
                            {t("privacy.section5.intro")}
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-foreground/90">
                            <li><strong>{t("privacy.section5.item1")}</strong> {t("privacy.section5.item1.desc")}</li>
                            <li><strong>{t("privacy.section5.item2")}</strong> {t("privacy.section5.item2.desc")}</li>
                            <li><strong>{t("privacy.section5.item3")}</strong> {t("privacy.section5.item3.desc")}</li>
                            <li><strong>{t("privacy.section5.item4")}</strong> {t("privacy.section5.item4.desc")}</li>
                        </ul>
                    </section>

                    {/* Section 6 */}
                    <section>
                        <h2 className="text-2xl font-bold mb-4">{t("privacy.section6.title")}</h2>
                        <p className="text-foreground/90 leading-relaxed mb-4">
                            {t("privacy.section6.intro")}
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-foreground/90 mb-4">
                            <li>{t("privacy.section6.item1")}</li>
                            <li>{t("privacy.section6.item2")}</li>
                            <li>{t("privacy.section6.item3")}</li>
                            <li>{t("privacy.section6.item4")}</li>
                        </ul>
                        <p className="text-foreground/90 leading-relaxed">
                            <strong>{t("privacy.section6.important")}</strong> {t("privacy.section6.importantText")}
                        </p>
                    </section>

                    {/* Section 7 */}
                    <section>
                        <h2 className="text-2xl font-bold mb-4">{t("privacy.section7.title")}</h2>
                        <p className="text-foreground/90 leading-relaxed mb-4">
                            {t("privacy.section7.intro")}
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-foreground/90 mb-4">
                            <li>{t("privacy.section7.item1")}</li>
                            <li>{t("privacy.section7.item2")}</li>
                            <li>{t("privacy.section7.item3")}</li>
                            <li>{t("privacy.section7.item4")}</li>
                        </ul>
                        <p className="text-foreground/90 leading-relaxed">
                            {t("privacy.section7.note")}
                        </p>
                    </section>

                    {/* Section 8 */}
                    <section>
                        <h2 className="text-2xl font-bold mb-4">{t("privacy.section8.title")}</h2>
                        <p className="text-foreground/90 leading-relaxed mb-4">
                            {t("privacy.section8.intro")}
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-foreground/90">
                            <li>{t("privacy.section8.item1")}</li>
                            <li>{t("privacy.section8.item2")}</li>
                            <li>{t("privacy.section8.item3")}</li>
                            <li>{t("privacy.section8.item4")}</li>
                        </ul>
                    </section>

                    {/* Section 9 */}
                    <section>
                        <h2 className="text-2xl font-bold mb-4">{t("privacy.section9.title")}</h2>
                        <p className="text-foreground/90 leading-relaxed mb-4">
                            {t("privacy.section9.intro")}
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-foreground/90">
                            <li><strong>{t("privacy.section9.item1")}</strong> {t("privacy.section9.item1.desc")}</li>
                            <li><strong>{t("privacy.section9.item2")}</strong> {t("privacy.section9.item2.desc")}</li>
                            <li><strong>{t("privacy.section9.item3")}</strong> {t("privacy.section9.item3.desc")}</li>
                            <li><strong>{t("privacy.section9.item4")}</strong> {t("privacy.section9.item4.desc")}</li>
                            <li><strong>{t("privacy.section9.item5")}</strong> {t("privacy.section9.item5.desc")}</li>
                            <li><strong>{t("privacy.section9.item6")}</strong> {t("privacy.section9.item6.desc")}</li>
                            <li><strong>{t("privacy.section9.item7")}</strong> {t("privacy.section9.item7.desc")}</li>
                        </ul>
                        <p className="text-foreground/90 leading-relaxed mt-4">
                            {t("privacy.section9.note")}
                        </p>
                    </section>

                    {/* Section 10 */}
                    <section>
                        <h2 className="text-2xl font-bold mb-4">{t("privacy.section10.title")}</h2>
                        <p className="text-foreground/90 leading-relaxed mb-4">
                            {t("privacy.section10.text")}
                        </p>
                    </section>

                    {/* Section 11 */}
                    <section>
                        <h2 className="text-2xl font-bold mb-4">{t("privacy.section11.title")}</h2>
                        <p className="text-foreground/90 leading-relaxed">
                            {t("privacy.section11.text")}
                        </p>
                    </section>

                    {/* Section 12 */}
                    <section>
                        <h2 className="text-2xl font-bold mb-4">{t("privacy.section12.title")}</h2>
                        <p className="text-foreground/90 leading-relaxed mb-4">
                            {t("privacy.section12.intro")}
                        </p>
                        <div className="bg-card border border-border rounded-lg p-6 space-y-3">
                            <div>
                                <p className="text-sm text-muted-foreground">{t("privacy.section12.telegramLabel")}</p>
                                <a
                                    href="https://t.me/Elena_fitmentor"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary hover:underline font-medium"
                                >
                                    @Elena_fitmentor
                                </a>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">{t("privacy.section12.nameLabel")}</p>
                                <p className="font-medium">{t("privacy.section12.name")}</p>
                            </div>
                        </div>
                    </section>

                    {/* Footer */}
                    <section className="pt-8 border-t border-border">
                        <p className="text-center text-sm text-muted-foreground">
                            {t("privacy.footer.copyright", { year: new Date().getFullYear().toString() })}
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default Privacy;
