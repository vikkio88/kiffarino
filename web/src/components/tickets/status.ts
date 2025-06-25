import type { TicketStatus } from "@kiffarino/shared";

export const emojiMap: Record<TicketStatus, string> = {
  idea: "💡",
  backlog: "📋",
  todo: "📝",
  inProgress: "💻",
  done: "✅",
};

export const statusLabelMap: Record<TicketStatus, string> = {
  idea: "Idea",
  backlog: "Backlog",
  todo: "To Do",
  inProgress: "In Progress",
  done: "Done",
};
