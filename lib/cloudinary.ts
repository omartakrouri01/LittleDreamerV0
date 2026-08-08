/**
 * Injects a Cloudinary delivery transformation right after `/upload/` so
 * every product photo is served resized, auto-quality, auto-format.
 * Non-Cloudinary URLs are returned unchanged (defensive: an owner could
 * paste a stray non-Cloudinary link).
 */
export function cldUrl(url: string, width: 600 | 1000): string {
  const marker = "/upload/";
  const idx = url.indexOf(marker);
  if (idx === -1) return url;
  const insertAt = idx + marker.length;
  return `${url.slice(0, insertAt)}w_${width},q_auto,f_auto/${url.slice(insertAt)}`;
}
