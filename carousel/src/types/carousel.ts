export interface CarouselImage {
  id: number;
  src: string;
  alt: string;
  title?: string;
}

export interface InfiniteCarouselProps {
  images: CarouselImage[];
  autoScroll?: boolean;
  scrollSpeed?: number;
}
