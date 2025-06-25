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
</script>

<span data-tooltip={status}>{emojiMap[status] ?? "❓"}</span>

<style>
  span {
    cursor: help;
  }
</style>
