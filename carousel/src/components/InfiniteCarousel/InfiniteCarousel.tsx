import type { InfiniteCarouselProps } from '../../types/carousel';
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll';
import './InfiniteCarousel.scss';
import { LazyImage } from './LazyImage';

export const InfiniteCarousel = ({
  images
}: InfiniteCarouselProps) => {
  const { scrollContainerRef } = useInfiniteScroll();

  const carouselImages = images;

  return (
    <div className="infinite-carousel-container">
      <div
        ref={scrollContainerRef}
        className="infinite-carousel"

      >
        {carouselImages.map((image) => (
          <div
            key={image.id}
            className="carousel-item"

          >
            <LazyImage
              src={image.src}
              alt={image.alt}
              className="carousel-image"
              root={scrollContainerRef.current}
            />
            {image.title && (
              <div className="image-title">
                {image.title}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
