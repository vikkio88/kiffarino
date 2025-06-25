<script lang="ts">
  import type { TicketStatus } from "@kiffarino/shared";

  type Props = { status: TicketStatus };

  const { status }: Props = $props();
  const emojiMap: Record<TicketStatus, string> = {
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
</script>

<span data-tooltip={statusLabelMap[status]} data-tooltip-position="left">
  {emojiMap[status] ?? "❓"}
</span>

<style>
  span {
    cursor: help;
  }
</style>
