export function toLowerCamelCase(str: string) {
  const words = str
    .trim()
    .replace(/[^a-zA-Z0-9 ]+/g, "")
    .split(/\s+/)
    .filter(Boolean);

  const firstWord = words[0]!.toLowerCase();
  const restWords = words
    .slice(1)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join("");

  const combined = firstWord + restWords;

  // Force first letter lowercase just in case
  return combined.charAt(0).toLowerCase() + combined.slice(1);
}
