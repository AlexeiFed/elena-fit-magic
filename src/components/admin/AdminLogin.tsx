/**
 * AdminLogin — форма входа в админ-панель.
 * Простая форма с полем пароля и кнопкой входа.
 * При успешном входе вызывает onLogin callback.
 */
import { useState } from "react";
import { Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { adminLogin } from "@/lib/api";
import { DESIGN_TOKENS } from "@/lib/design-tokens";

interface AdminLoginProps {
  onLogin: () => void;
}

export const AdminLogin = ({ onLogin }: AdminLoginProps) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  /** Обработка отправки формы */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!password.trim()) {
      setError("Введите пароль");
      return;
    }

    setLoading(true);
    try {
      const success = await adminLogin(password);
      if (success) {
        onLogin();
      } else {
        setError("Неверный пароль");
      }
    } catch (err) {
      if (err instanceof Error && err.message.includes("Too many")) {
        setError("Слишком много попыток. Подождите 15 минут.");
      } else {
        setError("Ошибка подключения к серверу");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        {/* Логотип / заголовок */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className={`${DESIGN_TOKENS.heading.h3} !mb-2`}>Админ-панель</h1>
          <p className="text-sm text-muted-foreground">elenafitmagic.ru</p>
        </div>

        {/* Форма входа */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Пароль"
              className="w-full px-4 py-3 pr-12 rounded-xl border border-border/50 bg-card/50 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
              autoFocus
              disabled={loading}
            />
            {/* Кнопка показать/скрыть пароль */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-muted-foreground transition-colors"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          {/* Ошибка */}
          {error && (
            <p className="text-sm text-destructive text-center">{error}</p>
          )}

          {/* Кнопка входа */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-primary to-accent text-white font-medium hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Вход...
              </>
            ) : (
              "Войти"
            )}
          </button>
        </form>

        {/* Ссылка на сайт */}
        <div className="text-center mt-6">
          <a
            href="/"
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            ← Вернуться на сайт
          </a>
        </div>
      </div>
    </div>
  );
};
