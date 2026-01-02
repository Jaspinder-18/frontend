
// Helper to get image URL for both development and production (Render)
export const getImageUrl = (imagePath) => {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) return imagePath; // Already absolute

    // In development, use relative path (proxied)
    if (import.meta.env.DEV) {
        return imagePath;
    }

    // In production, prepend backend URL
    // Assumes VITE_API_URL is like 'https://backend.com/api' or 'https://backend.com'
    const apiBase = import.meta.env.VITE_API_URL || '';
    const domain = apiBase.replace(/\/api\/?$/, ''); // Remove trailing /api or /api/
    return `${domain}${imagePath}`;
};
