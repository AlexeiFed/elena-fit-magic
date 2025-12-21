import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

const Privacy = () => {
  const navigate = useNavigate();

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
            Вернуться на главную
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12 md:py-16">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Политика конфиденциальности
          </h1>
          <p className="text-muted-foreground text-lg">
            Последнее обновление: {new Date().toLocaleDateString('ru-RU')}
          </p>
        </div>

        <div className="space-y-8 prose prose-invert max-w-none">
          {/* Section 1 */}
          <section>
            <h2 className="text-2xl font-bold mb-4">1. Общие положения</h2>
            <p className="text-foreground/90 leading-relaxed mb-4">
              Компания «Елена Пильщакова» (далее — «Компания», «мы», «нас») уважает конфиденциальность своих клиентов и посетителей веб-сайта. Настоящая политика конфиденциальности описывает, как мы собираем, используем, обрабатываем и защищаем ваши личные данные.
            </p>
            <p className="text-foreground/90 leading-relaxed">
              Используя наш веб-сайт и услуги, вы соглашаетесь с условиями настоящей политики конфиденциальности. Если вы не согласны с какой-либо частью этой политики, пожалуйста, не используйте наши услуги.
            </p>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-2xl font-bold mb-4">2. Какие данные мы собираем</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">2.1 Информация, которую вы предоставляете добровольно:</h3>
                <ul className="list-disc list-inside space-y-2 text-foreground/90">
                  <li>Фамилия, имя и отчество</li>
                  <li>Адрес электронной почты</li>
                  <li>Номер телефона</li>
                  <li>Информация о целях тренировок и здоровье</li>
                  <li>Информация о пищевых привычках и ограничениях</li>
                  <li>Фотографии и видеоматериалы (если вы их предоставляете)</li>
                  <li>Результаты анализов и медицинские документы</li>
                  <li>Любая другая информация, которую вы решите поделиться с нами</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">2.2 Информация, собираемая автоматически:</h3>
                <ul className="list-disc list-inside space-y-2 text-foreground/90">
                  <li>IP-адрес и информация об устройстве</li>
                  <li>Тип браузера и операционная система</li>
                  <li>Страницы, которые вы посещаете</li>
                  <li>Время пребывания на нашем сайте</li>
                  <li>Данные о поведении на сайте (через cookies и аналогичные технологии)</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-2xl font-bold mb-4">3. Как мы используем ваши данные</h2>
            <p className="text-foreground/90 leading-relaxed mb-4">
              Компания использует собираемые данные в следующих целях:
            </p>
            <ul className="list-disc list-inside space-y-2 text-foreground/90 mb-4">
              <li><strong>Предоставление услуг:</strong> Создание персональных тренировочных программ, планов питания и рекомендаций</li>
              <li><strong>Связь:</strong> Ответы на ваши запросы, отправка уведомлений о программах и услугах</li>
              <li><strong>Улучшение услуг:</strong> Анализ отзывов и данных о результатах для улучшения качества обслуживания</li>
              <li><strong>Маркетинг:</strong> Отправка информационных материалов и предложений (только с вашего согласия)</li>
              <li><strong>Соответствие законодательству:</strong> Выполнение юридических обязательств и защита прав компании</li>
              <li><strong>Безопасность:</strong> Предотвращение мошенничества и обеспечение безопасности платежей</li>
              <li><strong>Аналитика:</strong> Понимание поведения пользователей и оптимизация нашего веб-сайта</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-2xl font-bold mb-4">4. Основы для обработки данных</h2>
            <p className="text-foreground/90 leading-relaxed mb-4">
              Мы обрабатываем ваши персональные данные на следующих основаниях:
            </p>
            <ul className="list-disc list-inside space-y-2 text-foreground/90">
              <li><strong>Исполнение договора:</strong> Обработка данных необходима для предоставления вам услуг</li>
              <li><strong>Ваше согласие:</strong> Вы дали нам явное согласие на обработку определенных категорий данных</li>
              <li><strong>Законные интересы:</strong> Обработка необходима для наших законных интересов (например, улучшение услуг)</li>
              <li><strong>Соответствие закону:</strong> Обработка требуется для соответствия применимому законодательству</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="text-2xl font-bold mb-4">5. Совместное использование данных</h2>
            <p className="text-foreground/90 leading-relaxed mb-4">
              Мы не продаем и не передаем ваши персональные данные третьим лицам в коммерческих целях. Однако, мы можем поделиться информацией в следующих случаях:
            </p>
            <ul className="list-disc list-inside space-y-2 text-foreground/90">
              <li><strong>С партнерами услуг:</strong> Поставщики платежей, хостинг-провайдеры, которые подписали соглашения о конфиденциальности</li>
              <li><strong>По требованию закона:</strong> Если нам требуется раскрыть данные по решению суда или запросу государственных органов</li>
              <li><strong>С вашего согласия:</strong> Если вы явно согласились на передачу данных определенным лицам</li>
              <li><strong>Для защиты прав:</strong> Если это необходимо для защиты прав, безопасности и имущества компании</li>
            </ul>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="text-2xl font-bold mb-4">6. Безопасность данных</h2>
            <p className="text-foreground/90 leading-relaxed mb-4">
              Компания принимает разумные меры для защиты ваших персональных данных от несанкционированного доступа, изменения, раскрытия или уничтожения. Эти меры включают:
            </p>
            <ul className="list-disc list-inside space-y-2 text-foreground/90 mb-4">
              <li>Использование шифрования (SSL/TLS) при передаче данных</li>
              <li>Защита серверов с помощью брандмауэров и систем обнаружения вторжений</li>
              <li>Ограничение доступа к персональным данным только авторизованным сотрудникам</li>
              <li>Регулярное обновление программного обеспечения и систем безопасности</li>
            </ul>
            <p className="text-foreground/90 leading-relaxed">
              <strong>Важно:</strong> Несмотря на наши усилия, ни одна система безопасности не является абсолютно безопасной. Вы используете наши услуги на свой риск.
            </p>
          </section>

          {/* Section 7 */}
          <section>
            <h2 className="text-2xl font-bold mb-4">7. Cookies и сходные технологии</h2>
            <p className="text-foreground/90 leading-relaxed mb-4">
              Наш веб-сайт использует cookies и сходные технологии для:
            </p>
            <ul className="list-disc list-inside space-y-2 text-foreground/90 mb-4">
              <li>Сохранения предпочтений пользователя</li>
              <li>Отслеживания посещений и поведения на сайте</li>
              <li>Улучшения функциональности веб-сайта</li>
              <li>Аналитики и маркетинга</li>
            </ul>
            <p className="text-foreground/90 leading-relaxed">
              Вы можете управлять настройками cookies в своем браузере. Однако отключение некоторых cookies может повлиять на функциональность нашего сайта.
            </p>
          </section>

          {/* Section 8 */}
          <section>
            <h2 className="text-2xl font-bold mb-4">8. Сроки хранения данных</h2>
            <p className="text-foreground/90 leading-relaxed mb-4">
              Мы храним ваши персональные данные в течение времени, необходимого для предоставления услуг и выполнения наших обязательств, а также в соответствии с применимым законодательством. В частности:
            </p>
            <ul className="list-disc list-inside space-y-2 text-foreground/90">
              <li>Данные клиентов активных программ хранятся в течение всего периода обслуживания</li>
              <li>После завершения программы данные могут сохраняться до 3 лет для рекомендаций и аналитики</li>
              <li>Данные о платежах хранятся в соответствии с требованиями налогового законодательства (7 лет)</li>
              <li>При вашем запросе данные будут удалены, за исключением случаев, когда требуется их сохранение по закону</li>
            </ul>
          </section>

          {/* Section 9 */}
          <section>
            <h2 className="text-2xl font-bold mb-4">9. Ваши права</h2>
            <p className="text-foreground/90 leading-relaxed mb-4">
              В зависимости от вашего местоположения, вы можете иметь следующие права в отношении ваших персональных данных:
            </p>
            <ul className="list-disc list-inside space-y-2 text-foreground/90">
              <li><strong>Право на доступ:</strong> Запрашивать информацию о том, какие данные мы собираем о вас</li>
              <li><strong>Право на исправление:</strong> Исправлять неточные или неполные данные</li>
              <li><strong>Право на удаление:</strong> Запрашивать удаление ваших данных (при определенных условиях)</li>
              <li><strong>Право на ограничение обработки:</strong> Ограничивать способы использования ваших данных</li>
              <li><strong>Право на передачу данных:</strong> Получить ваши данные в структурированном виде</li>
              <li><strong>Право возражения:</strong> Возражать против определенных видов обработки данных</li>
              <li><strong>Право отозвать согласие:</strong> Отозвать ранее данное согласие на обработку данных</li>
            </ul>
            <p className="text-foreground/90 leading-relaxed mt-4">
              Для реализации этих прав свяжитесь с нами по адресу электронной почты или телефону, указанным ниже.
            </p>
          </section>

          {/* Section 10 */}
          <section>
            <h2 className="text-2xl font-bold mb-4">10. Обработка данных третьих лиц</h2>
            <p className="text-foreground/90 leading-relaxed mb-4">
              Если вы предоставляете информацию о других людях (например, чтобы поделиться программой тренировок с другом), вы гарантируете, что получили их согласие и несете ответственность за надлежащую обработку этой информации.
            </p>
          </section>

          {/* Section 11 */}
          <section>
            <h2 className="text-2xl font-bold mb-4">11. Обновления политики конфиденциальности</h2>
            <p className="text-foreground/90 leading-relaxed">
              Мы может обновлять эту политику конфиденциальности время от времени. Об изменениях вы будете уведомлены через размещение новой политики на нашем веб-сайте. Дата последнего обновления указана в начале этого документа.
            </p>
          </section>

          {/* Section 12 */}
          <section>
            <h2 className="text-2xl font-bold mb-4">12. Связь с нами</h2>
            <p className="text-foreground/90 leading-relaxed mb-4">
              Если у вас есть вопросы о настоящей политике конфиденциальности или о том, как мы обрабатываем ваши персональные данные, пожалуйста, свяжитесь с нами:
            </p>
            <div className="bg-card border border-border rounded-lg p-6 space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Телеграм</p>
                <a 
                  href="https://t.me/Elena_fittrainer" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline font-medium"
                >
                  @Elena_fittrainer
                </a>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Имя</p>
                <p className="font-medium">Елена Пильщакова</p>
              </div>
            </div>
          </section>

          {/* Footer */}
          <section className="pt-8 border-t border-border">
            <p className="text-center text-sm text-muted-foreground">
              © {new Date().getFullYear()} Елена Пильщакова. Все права защищены.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
