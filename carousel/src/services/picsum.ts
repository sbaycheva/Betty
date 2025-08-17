import type { CarouselImage } from '../types/carousel';

interface PicsumListItem {
  id: string;
  author: string;
  width: number;
  height: number;
  url: string;
  download_url: string;
}

const PICSUM_BASE_URL = 'https://picsum.photos';

function buildPicsumImageUrlById(id: string | number, width: number, height: number): string {
  return `${PICSUM_BASE_URL}/id/${id}/${width}/${height}`;
}

export async function fetchPicsumImages(limit: number, width = 600, height = 400): Promise<CarouselImage[]> {
  const response = await fetch(`${PICSUM_BASE_URL}/v2/list?limit=${encodeURIComponent(limit)}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch images from Picsum: ${response.status} ${response.statusText}`);
  }

  const data = (await response.json()) as unknown as PicsumListItem[];

  const images: CarouselImage[] = data.map((item, idx) => ({
    id: Number.isNaN(Number(item.id)) ? idx + 1 : Number(item.id),
    src: buildPicsumImageUrlById(item.id, width, height),
    alt: item.author || `Picsum Image ${item.id}`,
    title: item.author || undefined
  }));

  return images;
}


