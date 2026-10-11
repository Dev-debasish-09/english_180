// Builds a YouTube search URL from a channel name and a topic, at
// runtime. We never store or hardcode an actual video URL — search
// results don't go stale the way a specific video link can.
export function buildYouTubeSearchUrl(channel: string, topic: string): string {
  const query = `${channel} ${topic}`.trim().replace(/\s+/g, "+");
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(query).replace(/%2B/g, "+")}`;
}
