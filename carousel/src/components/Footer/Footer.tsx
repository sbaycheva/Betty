import './Footer.scss';

interface FooterProps {
  imageCount: number;
}

export function Footer({ imageCount }: FooterProps) {
  const content = `Carousel with ${imageCount} images from Picsum`;
  return (
    <footer className="app-footer">
      <p>{content}</p>
    </footer>
  );
}


