<script lang="ts">
  import { type TicketStatus, ticketStatuses } from "@kiffarino/shared";
  import { emojiMap, statusLabelMap } from "./status";

  type Props = { status: TicketStatus; extended?: boolean };

  const { status, extended = false }: Props = $props();
</script>

<span>
  {emojiMap[status] ?? "❓"}{extended ? ` ${statusLabelMap[status]}` : ""}
</span>
