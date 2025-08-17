import { memo, useEffect, useRef, useState } from 'react';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  root?: Element | null;
  rootMargin?: string;
  threshold?: number | number[];
}

function LazyImageComponent({
  src,
  alt,
  className,
  root,
  rootMargin = '0px 250px 0px 250px',
  threshold = 0.01
}: LazyImageProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!containerRef.current) return;
    if (shouldLoad) return;

    const element = containerRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShouldLoad(true);
          }
        });
      },
      { root: root ?? null, rootMargin, threshold }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
      observer.disconnect();
    };
  }, [root, rootMargin, threshold, shouldLoad]);

  return (
    <div ref={containerRef} className={`lazy-image-wrapper ${isLoaded ? 'loaded' : 'loading'}`.trim()}>
      {!isLoaded && (
        <div className="carousel-skeleton" aria-hidden="true" />
      )}
      {shouldLoad && (
        <img
          src={src}
          alt={alt}
          className={`${className ?? ''} ${isLoaded ? 'is-loaded' : 'is-loading'}`.trim()}
          loading="lazy"
          decoding="async"
          onLoad={() => setIsLoaded(true)}
          aria-busy={!isLoaded}
        />
      )}
    </div>
  );
}

export const LazyImage = memo(LazyImageComponent);


