/**
 * LoadingFallback — skeleton/spinner для React.lazy() Suspense fallback
 * Используется при ленивой загрузке компонентов ниже первого экрана
 */

export const SectionSkeleton = () => {
  return (
    <div className="py-24 px-6 md:px-12 animate-pulse">
      <div className="max-w-7xl mx-auto">
        {/* Заголовок секции */}
        <div className="flex flex-col items-center gap-4 mb-16">
          <div className="h-10 w-64 bg-muted rounded-lg" />
          <div className="h-5 w-96 max-w-full bg-muted/60 rounded-lg" />
        </div>
        {/* Контент */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="h-64 bg-muted/40 rounded-2xl" />
          <div className="h-64 bg-muted/40 rounded-2xl" />
        </div>
      </div>
    </div>
  );
};

export const PageSkeleton = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary border-t-transparent" />
    </div>
  );
};
