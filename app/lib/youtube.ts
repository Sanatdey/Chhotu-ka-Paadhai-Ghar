/**
 * Utility function to convert YouTube URLs to embed format
 * Handles various YouTube URL formats:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - VIDEO_ID
 */
export function getYouTubeEmbedUrl(url: string): string {
  if (!url) return "";

  // If it's just a video ID
  if (!url.includes("/") && !url.includes("?")) {
    return `https://www.youtube.com/embed/${url}`;
  }

  // Extract video ID from various YouTube URL formats
  let videoId = "";

  if (url.includes("youtube.com/watch")) {
    const urlObj = new URL(url);
    videoId = urlObj.searchParams.get("v") || "";
  } else if (url.includes("youtu.be")) {
    videoId = url.split("youtu.be/")[1]?.split("?")[0] || "";
  }

  if (videoId) {
    return `https://www.youtube.com/embed/${videoId}`;
  }

  // If already an embed URL, return as is
  if (url.includes("/embed/")) {
    return url;
  }

  console.log(`[getYouTubeEmbedUrl] Unrecognized URL format: ${url}`);
  return url;
}

/**
 * Extract video ID from YouTube URL
 */
export function getYouTubeVideoId(url: string): string {
  if (!url) return "";

  // If it's just a video ID
  if (!url.includes("/") && !url.includes("?")) {
    return url;
  }

  let videoId = "";

  if (url.includes("youtube.com/watch")) {
    const urlObj = new URL(url);
    videoId = urlObj.searchParams.get("v") || "";
  } else if (url.includes("youtu.be")) {
    videoId = url.split("youtu.be/")[1]?.split("?")[0] || "";
  } else if (url.includes("/embed/")) {
    videoId = url.split("/embed/")[1]?.split("?")[0] || "";
  }

  return videoId;
}

/**
 * Get YouTube watch URL from video ID or various YouTube URL formats
 */
export function getYouTubeWatchUrl(url: string): string {
  const videoId = getYouTubeVideoId(url);
  return videoId ? `https://www.youtube.com/watch?v=${videoId}` : url;
}
