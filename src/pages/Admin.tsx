/**
 * Admin — страница админ-панели.
 * Lazy-loaded через React.lazy в App.tsx.
 * Проверяет авторизацию при загрузке, показывает AdminLogin или AdminLayout.
 */
import { useState, useEffect } from "react";
import { Loader2 } from "@/components/icons";
import { checkAuth } from "@/lib/api";
import { AdminLogin } from "@/components/admin/AdminLogin";
import { AdminLayout } from "@/components/admin/AdminLayout";

const Admin = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);

  /** Проверка сессии при загрузке страницы */
  useEffect(() => {
    checkAuth()
      .then((isAuth) => setAuthenticated(isAuth))
      .catch(() => setAuthenticated(false))
      .finally(() => setChecking(false));
  }, []);

  /* Спиннер пока проверяем сессию */
  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  /* Не авторизован — показываем форму входа */
  if (!authenticated) {
    return <AdminLogin onLogin={() => setAuthenticated(true)} />;
  }

  /* Авторизован — показываем админку */
  return <AdminLayout onLogout={() => setAuthenticated(false)} />;
};

export default Admin;
