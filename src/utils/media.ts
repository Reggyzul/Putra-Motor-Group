/**
 * Helper utilities for media detection and video URLs
 */

export function isYouTubeUrl(url: string): boolean {
  if (!url) return false;
  return /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)/.test(url);
}

export function getYouTubeEmbedUrl(url: string): string {
  if (!url) return '';
  const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  const videoId = match ? match[1] : '';
  if (!videoId) return url;
  return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&enablejsapi=1`;
}

export function isVideoMedia(mediaType?: 'image' | 'video', url?: string): boolean {
  if (mediaType === 'video') return true;
  if (!url) return false;
  return (
    url.startsWith('data:video/') ||
    /\.(mp4|webm|ogg|mov|m4v)(\?.*)?$/i.test(url) ||
    isYouTubeUrl(url)
  );
}
