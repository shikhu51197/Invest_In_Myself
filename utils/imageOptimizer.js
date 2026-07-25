/**
 * Automagically compresses and resizes oversized images in the browser
 * before uploading, preventing HTTP 413 payload errors on cloud serverless deployments.
 */
export async function compressImageIfNeeded(file) {
  // Only compress standard images that are larger than 1.0 MB
  if (!file || !file.type.startsWith('image/') || file.size <= 1.0 * 1024 * 1024) {
    return file;
  }

  // Do not compress animated gifs or scalable vector graphics via Canvas
  if (file.type === 'image/gif' || file.type === 'image/svg+xml') {
    return file;
  }

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Cap resolution to 2560px max dimension (high-definition 2K visual fidelity)
        const maxDim = 2560;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        
        // Ensure transparent backgrounds in PNGs convert cleanly to solid white in JPEG
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to optimized JPEG at 85% quality
        canvas.toBlob((blob) => {
          if (!blob) {
            resolve(file);
            return;
          }
          // Only use optimized version if it genuinely reduced file size
          if (blob.size < file.size) {
            const cleanName = file.name.replace(/\.[^/.]+$/, "") + "_optimized.jpg";
            const optimizedFile = new File([blob], cleanName, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });
            console.log(`✨ Optimized "${file.name}" from ${(file.size / (1024 * 1024)).toFixed(2)}MB down to ${(optimizedFile.size / (1024 * 1024)).toFixed(2)}MB`);
            resolve(optimizedFile);
          } else {
            resolve(file);
          }
        }, 'image/jpeg', 0.85);
      };
      
      img.onerror = () => resolve(file);
    };
    
    reader.onerror = () => resolve(file);
  });
}
