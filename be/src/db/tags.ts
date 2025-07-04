import { toTag } from "@kiffarino/shared";

export function upsertTag(
  newTag: string,
  existingTags: string[]
): [dbTags: string[], newTag: string] {
  const tags = new Set(existingTags);

  newTag = toTag(newTag);

  tags.add(newTag);

  return [Array.from(tags), newTag];
}

export function upsertMultiTags(
  inputs: string[],
  existingTags: string[]
): [dbTags: string[], newTags: string[]] {
  const tags = new Set(existingTags);

  const newTags: string[] = [];

  for (const rawTag of inputs) {
    const tag = toTag(rawTag);
    if (!tags.has(tag)) {
      newTags.push(tag);
      tags.add(tag);
    }
  }

  return [Array.from(tags), newTags];
}
