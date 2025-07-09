import { test, expect } from "bun:test";
import { extractYoutubeVideos } from "./youtube";

test("extracts plain YouTube URLs", () => {
  const input = `
https://youtu.be/dQw4w9WgXcQ
https://www.youtube.com/watch?v=abcdef12345
`;

  const videos = extractYoutubeVideos(input);
  expect(videos.length).toBe(2);
  expect(videos[0]).toEqual({
    original: "https://youtu.be/dQw4w9WgXcQ",
    embed: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  });
  expect(videos[1]).toEqual({
    original: "https://www.youtube.com/watch?v=abcdef12345",
    embed: "https://www.youtube.com/embed/abcdef12345",
  });
});

test("extracts markdown [youtube](URL) links", () => {
  const input = `
[youtube](https://youtu.be/dQw4w9WgXcQ)
[youtube](https://www.youtube.com/watch?v=abcdef12345)
`;

  const videos = extractYoutubeVideos(input);
  expect(videos.length).toBe(2);
  expect(videos[0]).toEqual({
    original: "[youtube](https://youtu.be/dQw4w9WgXcQ)",
    embed: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  });
  expect(videos[1]).toEqual({
    original: "[youtube](https://www.youtube.com/watch?v=abcdef12345)",
    embed: "https://www.youtube.com/embed/abcdef12345",
  });
});

test("ignores lines without YouTube links", () => {
  const input = `
Hello world
[youtube](not a url)
https://example.com/
`;

  const videos = extractYoutubeVideos(input);
  expect(videos.length).toBe(0);
});
