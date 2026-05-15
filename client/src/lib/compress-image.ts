// lib/compress-image.ts
// Compress + resize image via canvas before storing in IndexedDB

export type CompressOptions = {
  maxWidthPx?: number;
  maxHeightPx?: number;
  quality?: number;
  mimeType?: string;
};

export function compressImage(
  file: File,
  options: CompressOptions = {},
): Promise<Blob> {
  const {
    maxWidthPx = 1800,
    maxHeightPx = 1800,
    quality = 0.84,
    mimeType = "image/webp",
  } = options;

  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      let { width, height } = img;

      if (width > maxWidthPx || height > maxHeightPx) {
        const ratio = Math.min(maxWidthPx / width, maxHeightPx / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("Canvas context unavailable"));

      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (!blob) return reject(new Error("Compression failed"));
          resolve(blob);
        },
        mimeType,
        quality,
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Image load failed"));
    };

    img.src = objectUrl;
  });
}
