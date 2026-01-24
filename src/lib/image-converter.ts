/**
 * Converts an image file to WebP format before upload
 * @param file - The original image file
 * @param quality - WebP quality (0-1), default 0.9
 * @param maxWidth - Maximum width to resize to (optional)
 * @param maxHeight - Maximum height to resize to (optional)
 * @returns Promise with the converted WebP file
 */
export async function convertImageToWebP(
  file: File,
  quality: number = 0.9,
  maxWidth?: number,
  maxHeight?: number
): Promise<File> {
  // Skip if already WebP
  if (file.type === "image/webp") {
    return file;
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      reject(new Error("Could not get canvas context"));
      return;
    }

    img.onload = () => {
      let { width, height } = img;

      // Calculate resize dimensions if max dimensions specified
      if (maxWidth && width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }
      if (maxHeight && height > maxHeight) {
        width = (width * maxHeight) / height;
        height = maxHeight;
      }

      canvas.width = width;
      canvas.height = height;

      // Draw image to canvas
      ctx.drawImage(img, 0, 0, width, height);

      // Convert to WebP
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("Failed to convert image"));
            return;
          }

          // Create new File from Blob
          const webpFile = new File(
            [blob],
            file.name.replace(/\.[^.]+$/, ".webp"),
            {
              type: "image/webp",
              lastModified: Date.now(),
            }
          );

          resolve(webpFile);
        },
        "image/webp",
        quality
      );
    };

    img.onerror = () => {
      reject(new Error("Failed to load image"));
    };

    // Load the image
    img.src = URL.createObjectURL(file);
  });
}

/**
 * Converts multiple images to WebP format
 */
export async function convertImagesToWebP(
  files: File[],
  quality: number = 0.9,
  maxWidth?: number,
  maxHeight?: number
): Promise<File[]> {
  return Promise.all(
    files.map((file) => convertImageToWebP(file, quality, maxWidth, maxHeight))
  );
}
