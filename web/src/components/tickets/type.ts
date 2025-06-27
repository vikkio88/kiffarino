import type { TicketType } from "@kiffarino/shared"; // adjust import if needed

export const typeEmojiMap: Record<TicketType, string> = {
  spike: "🧪",
  bug: "🐞",
  task: "🛠️",
};

export const typeLabelMap: Record<TicketType, string> = {
  spike: "Spike",
  bug: "Bug",
  task: "Task",
};
