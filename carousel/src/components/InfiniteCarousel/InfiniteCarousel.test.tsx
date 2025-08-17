import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { InfiniteCarousel } from '.';
import { triggerAllIntersections } from '../../test/setup';

const images = Array.from({ length: 3 }).map((_, i) => ({
  id: i + 1,
  src: `https://picsum.photos/id/${i + 1}/600/400`,
  alt: `img-${i + 1}`,
  title: `Title ${i + 1}`,
}));

describe('InfiniteCarousel', () => {
  it('renders items and titles (images not in DOM before intersection)', () => {
    render(<InfiniteCarousel images={images} />);
    images.forEach((img) => {
      expect(screen.queryByAltText(img.alt)).toBeNull();
      if (img.title) {
        expect(screen.getByText(img.title)).toBeInTheDocument();
      }
    });
  });

  it('loads image src when items intersect', async () => {
    render(<InfiniteCarousel images={images} />);

    images.forEach((img) => {
      expect(screen.queryByAltText(img.alt)).toBeNull();
    });

    triggerAllIntersections(true);

    for (const img of images) {
      await waitFor(() => {
        const imageEl = screen.getByAltText(img.alt);
        expect(imageEl).toHaveAttribute('src', img.src);
      });
    }
  });
});
