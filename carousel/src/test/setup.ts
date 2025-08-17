import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

afterEach(() => {
  cleanup();
});

class MockIntersectionObserver {
  static instances: Set<MockIntersectionObserver> = new Set();
  root: Element | Document | null;
  rootMargin: string;
  thresholds: ReadonlyArray<number>;
  callback: IntersectionObserverCallback;
  observed: Set<Element> = new Set();

  constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
    this.callback = callback;
    this.root = options?.root ?? null;
    this.rootMargin = options?.rootMargin ?? '0px';
    const threshold = options?.threshold ?? 0;
    this.thresholds = Array.isArray(threshold) ? threshold : [threshold];
    MockIntersectionObserver.instances.add(this);
  }

  observe = (element: Element) => {
    this.observed.add(element);
  };

  unobserve = (element: Element) => {
    this.observed.delete(element);
  };

  disconnect = () => {
    this.observed.clear();
    MockIntersectionObserver.instances.delete(this);
  };

  __triggerIntersect = (isIntersecting: boolean) => {
    const entries: IntersectionObserverEntry[] = Array.from(this.observed).map((element) => ({
      isIntersecting,
      target: element,
      intersectionRatio: isIntersecting ? 1 : 0,
      time: 0,
      boundingClientRect: element.getBoundingClientRect(),
      intersectionRect: isIntersecting ? element.getBoundingClientRect() : new DOMRect(0, 0, 0, 0),
      rootBounds: null,
    } as unknown as IntersectionObserverEntry));
    this.callback(entries, this as unknown as IntersectionObserver);
  };
}

globalThis.IntersectionObserver = MockIntersectionObserver as unknown as typeof IntersectionObserver;

export function triggerAllIntersections(isIntersecting = true) {
  MockIntersectionObserver.instances.forEach((instance) => {
    instance.__triggerIntersect(isIntersecting);
  });
}


