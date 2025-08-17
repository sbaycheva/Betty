import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchPicsumImages } from './picsum';

describe('fetchPicsumImages', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('fetches list and maps to CarouselImage[]', async () => {
    const sample = [
      { id: '10', author: 'Alice', width: 1000, height: 800, url: 'u', download_url: 'd' },
      { id: '20', author: 'Bob', width: 1000, height: 800, url: 'u', download_url: 'd' },
    ];
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(sample),
    } as unknown as Response);

    const result = await fetchPicsumImages(2, 600, 400);
    expect(result).toHaveLength(2);
    expect(result[0]).toMatchObject({ id: 10, alt: 'Alice', title: 'Alice' });
    expect(result[0].src).toContain('/id/10/600/400');
    expect(globalThis.fetch).toHaveBeenCalledWith('https://picsum.photos/v2/list?limit=2');
  });

  it('throws on non-ok response', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: 'Server Error',
    } as unknown as Response);

    await expect(fetchPicsumImages(1)).rejects.toThrow('Failed to fetch images from Picsum');
  });
});


