<script lang="ts">
  import type { TicketStatus } from "@kiffarino/shared";
  import { emojiMap, statusLabelMap } from "./status";

  type Props = { status: TicketStatus; extended?: boolean };

  const { status, extended = false }: Props = $props();
</script>

<span
  data-tooltip={!extended ? statusLabelMap[status] : null}
  data-tooltip-position={!extended ? "right" : null}
  class:help={!extended}
>
  {emojiMap[status] ?? "❓"}{extended ? ` ${statusLabelMap[status]}` : ""}
</span>

<style>
  span.help {
    cursor: help;
  }
</style>
