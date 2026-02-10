import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { I18nProvider } from "@/contexts/I18nContext";
import { PageSkeleton } from "@/components/ui/LoadingFallback";
import Index from "./pages/Index";

// PERF: страницы загружаются лениво — не нужны при первой загрузке главной
const Privacy = lazy(() => import("./pages/Privacy"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Maintenance = lazy(() => import("./pages/Maintenance"));
const Admin = lazy(() => import("./pages/Admin"));

/** Режим техработ: true — показывается только страница «Ведутся технические работы». Чтобы сайт загружался как обычно — поставь false. */
const MAINTENANCE_MODE = false;

const queryClient = new QueryClient();

const App = () => {
  if (MAINTENANCE_MODE) {
    return (
      <Suspense fallback={<PageSkeleton />}>
        <Maintenance />
      </Suspense>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <I18nProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter basename={import.meta.env.BASE_URL}>
            <Suspense fallback={<PageSkeleton />}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/admin" element={<Admin />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </I18nProvider>
    </QueryClientProvider>
  );
};

export default App;
