<script lang="ts">
  import type { TicketStatus } from "@kiffarino/shared";
  import { emojiMap, statusLabelMap } from "./status";

  type Props = { status: TicketStatus };

  const { status }: Props = $props();
</script>

<span data-tooltip={statusLabelMap[status]} data-tooltip-position="right">
  {emojiMap[status] ?? "❓"}
</span>

<style>
  span {
    cursor: help;
  }
</style>
