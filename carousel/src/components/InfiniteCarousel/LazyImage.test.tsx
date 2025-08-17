import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LazyImage } from './LazyImage';

describe('LazyImage', () => {
  it('does not set src until intersecting', () => {
    render(<LazyImage src="/img.jpg" alt="test" />);
    expect(screen.queryByAltText('test')).toBeNull();
  });
});


