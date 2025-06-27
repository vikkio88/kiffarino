<script lang="ts">
  import type { TicketType } from "@kiffarino/shared";
  import { typeEmojiMap, typeLabelMap } from "./type";

  type Props = { type: TicketType; extended?: boolean };

  const { type, extended = false }: Props = $props();
</script>

<span
  data-tooltip={!extended ? typeLabelMap[type] : null}
  data-tooltip-position={!extended ? "right" : null}
  class:help={!extended}
>
  {typeEmojiMap[type] ?? "❓"}{extended ? ` ${typeLabelMap[type]}` : ""}
</span>

<style>
  span.help {
    cursor: help;
  }
</style>
