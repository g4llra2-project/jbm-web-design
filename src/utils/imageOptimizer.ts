/**
 * Dynamically optimizes image urls (especially Unsplash) by inserting appropriate
 * query configurations for width and compression quality.
 */
export const optimizeImageUrl = (url: string, width: number = 800, quality: number = 75): string => {
  if (!url) return '';
  
  // Handles Unsplash URL query parameter optimizations
  if (url.includes('images.unsplash.com')) {
    try {
      const parsedUrl = new URL(url);
      parsedUrl.searchParams.set('w', width.toString());
      parsedUrl.searchParams.set('q', quality.toString());
      parsedUrl.searchParams.set('auto', 'format');
      parsedUrl.searchParams.set('fit', 'crop');
      return parsedUrl.toString();
    } catch (e) {
      // Fallback manual replace if URL constructor fails
      let cleanedUrl = url.split('?')[0];
      return `${cleanedUrl}?auto=format&fit=crop&w=${width}&q=${quality}`;
    }
  }

  return url;
};
