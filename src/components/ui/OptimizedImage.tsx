/**
 * OptimizedImage — компонент для оптимизированного отображения изображений
 * Поддерживает WebP с fallback на JPG/PNG, lazy loading, width/height для CLS prevention
 */
import { ImgHTMLAttributes } from "react";

interface OptimizedImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  /** Путь к WebP версии изображения */
  webpSrc: string;
  /** Путь к fallback версии (JPG/PNG) */
  fallbackSrc: string;
  /** Ширина изображения (для предотвращения CLS) */
  width: number;
  /** Высота изображения (для предотвращения CLS) */
  height: number;
  /** Загрузка: eager для above-fold, lazy для below-fold */
  loading?: "lazy" | "eager";
  /** fetchpriority для критичных изображений */
  fetchPriority?: "high" | "low" | "auto";
}

export const OptimizedImage = ({
  webpSrc,
  fallbackSrc,
  width,
  height,
  loading = "lazy",
  fetchPriority = "auto",
  alt = "",
  className,
  ...rest
}: OptimizedImageProps) => {
  return (
    <picture>
      <source srcSet={webpSrc} type="image/webp" />
      <img
        src={fallbackSrc}
        alt={alt}
        width={width}
        height={height}
        loading={loading}
        // @ts-expect-error — fetchpriority поддерживается браузерами, но не в типах React 18
        fetchpriority={fetchPriority}
        decoding={loading === "eager" ? "sync" : "async"}
        className={className}
        {...rest}
      />
    </picture>
  );
};
