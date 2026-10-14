/**
 * Resolve media URLs for display.
 * Relative /uploads paths are used as-is (Vite proxies them in dev).
 */
export function mediaUrl(url) {
  if (!url) return '';
  if (typeof url !== 'string') return '';
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
    return url;
  }
  if (url.startsWith('/uploads')) {
    return url;
  }
  if (url.startsWith('uploads/')) {
    return `/${url}`;
  }
  return url;
}
