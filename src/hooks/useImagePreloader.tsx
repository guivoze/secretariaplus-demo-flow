import { useState, useEffect } from 'react';

export const useImagePreloader = (imageUrls: string[]) => {
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [allImagesLoaded, setAllImagesLoaded] = useState(false);

  useEffect(() => {
    if (imageUrls.length === 0) {
      setAllImagesLoaded(true);
      return;
    }

    const preloadImage = (url: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          setLoadedImages(prev => new Set([...prev, url]));
          resolve();
        };
        img.onerror = () => {
          console.warn(`Failed to preload image: ${url}`);
          resolve(); // Still resolve to not block other images
        };
        img.src = url;
      });
    };

    const preloadAllImages = async () => {
      console.log('Preloading images:', imageUrls);
      await Promise.all(imageUrls.map(url => preloadImage(url)));
      console.log('All images preloaded, setting allImagesLoaded to true');
      setAllImagesLoaded(true);
    };

    preloadAllImages();
  }, [imageUrls]);

  return { loadedImages, allImagesLoaded };
};