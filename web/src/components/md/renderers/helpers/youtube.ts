export type YTVideo = {
  original: string;
  embed: string;
};

export function extractYoutubeVideos(body: string): YTVideo[] {
  const embedBaseUrl = "https://www.youtube.com/embed/";
  const ytVideos: YTVideo[] = [];

  const lines = body.split("\n");

  for (const line of lines) {
    const trimmed = line.trim();

    // Match [youtube](url) syntax
    const markdownMatch = trimmed.match(/^\[youtube\]\((.*?)\)$/i);
    const url = markdownMatch ? markdownMatch[1] : trimmed;

    const match = url.match(
      /(?:https?:\/\/)?(?:www\.)?youtu(?:\.be\/|be\.com\/(?:watch\?.*?v=|.*\/|embed\/|v\/))([^&?/#]+)/
    );

    const videoId = match ? match[1] : null;
    if (!videoId) continue;

    ytVideos.push({
      original: line,
      embed: embedBaseUrl + videoId,
    });
  }

  return ytVideos;
}
