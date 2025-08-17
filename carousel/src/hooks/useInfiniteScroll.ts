import { useEffect, useRef, useCallback } from 'react';

export const useInfiniteScroll = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isAdjustingRef = useRef(false);
  const lastScrollLeft = useRef(0);

  const getContainerGapPx = (container: HTMLElement): number => {
    const styles = getComputedStyle(container);
    const gapStr = styles.columnGap || styles.gap || '15px';
    const parsed = parseFloat(gapStr);
    return Number.isFinite(parsed) ? parsed : 15;
  };

  const handleScroll = useCallback(() => {
    if (!scrollContainerRef.current) return;
    lastScrollLeft.current = scrollContainerRef.current.scrollLeft;
  }, []);
  
  const handleWheel = useCallback((event: WheelEvent) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    let deltaX = Math.abs(event.deltaX) >= Math.abs(event.deltaY) ? event.deltaX : event.deltaY;

    if (event.deltaMode === 1) {
      deltaX *= 16;
    } else if (event.deltaMode === 2) {
      deltaX *= container.clientWidth;
    }

    if (deltaX !== 0) {
      const items = Array.from(container.children) as HTMLDivElement[];
      if (items.length === 0) return;

      const itemWidth = items[0].getBoundingClientRect().width;
      const gap = getContainerGapPx(container);
      const totalItemWidth = itemWidth + gap;

      const maxLeft = Math.max(0, container.scrollWidth - container.clientWidth);
      let baseLeft = container.scrollLeft;
      const targetLeft = baseLeft + deltaX;
      const edgeThreshold = totalItemWidth * 0.25;

      if (deltaX > 0 && (baseLeft >= maxLeft - edgeThreshold || targetLeft > maxLeft)) {
        const first = items[0];
        isAdjustingRef.current = true;
        container.appendChild(first);
        baseLeft -= totalItemWidth;
        isAdjustingRef.current = false;
      } else if (deltaX < 0 && (baseLeft <= edgeThreshold || targetLeft < 0)) {
        const last = items[items.length - 1];
        isAdjustingRef.current = true;
        container.insertBefore(last, container.firstChild);
        baseLeft += totalItemWidth;
        isAdjustingRef.current = false;
      }

      container.scrollLeft = baseLeft + deltaX;
      event.preventDefault();
      lastScrollLeft.current = container.scrollLeft;
    }
  }, []);

  


  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const timer = setTimeout(() => {
      const items = Array.from(container.children) as HTMLDivElement[];
      if (items.length > 0) {
        const itemWidth = items[0].getBoundingClientRect().width;
        const gap = getContainerGapPx(container);
        const totalItemWidth = itemWidth + gap;
        const middleIndex = Math.floor(items.length / 2);
        container.scrollLeft = middleIndex * totalItemWidth;
        lastScrollLeft.current = container.scrollLeft;
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    container.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    container.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, [handleWheel]);

  return { scrollContainerRef };
};
