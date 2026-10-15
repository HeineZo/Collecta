const ratios = new Map<string, Promise<number>>();

// Cached per URL so React's `use` gets the same promise on every render.
export function loadImageRatio(imageUrl: string) {
  let ratio = ratios.get(imageUrl);
  if (!ratio) {
    ratio = new Promise((resolve) => {
      const image = new Image();
      image.onload = () => resolve(image.naturalWidth / image.naturalHeight);
      image.onerror = () => resolve(1);
      image.src = imageUrl;
    });
    ratios.set(imageUrl, ratio);
  }
  return ratio;
}
