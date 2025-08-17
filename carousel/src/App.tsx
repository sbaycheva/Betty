import { useEffect, useMemo, useState } from 'react';
import { InfiniteCarousel } from './components/InfiniteCarousel';
import type { CarouselImage } from './types/carousel';
import { fetchPicsumImages } from './services/picsum';
import './App.scss';
import { Header } from './components/Header/Header';
import { Footer } from './components/Footer/Footer';

function App() {
  const imagesCount = 10;
  const [targetWidth, targetHeight] = useMemo(() => [600, 400], []);

  const [images, setImages] = useState<CarouselImage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isCancelled = false;

    async function load() {
      setIsLoading(true);
      setError(null);
      try {
        const fetched = await fetchPicsumImages(imagesCount, targetWidth, targetHeight);
        if (!isCancelled) setImages(fetched);
      } catch (err) {
        if (!isCancelled) setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        if (!isCancelled) setIsLoading(false);
      }
    }

    void load();
    return () => {
      isCancelled = true;
    };
  }, [imagesCount, targetWidth, targetHeight]);

  return (
    <div className="app">
      <Header />
      
      <main className="app-main">
        {isLoading && <p>Зареждане...</p>}
        {error && <p role="alert">Грешка: {error}</p>}
        {!isLoading && !error && (
          <InfiniteCarousel 
            images={images}
            autoScroll={false}
          />
        )}
      </main>
      
      <Footer imageCount={imagesCount}/>
    </div>
  );
}

export default App;
