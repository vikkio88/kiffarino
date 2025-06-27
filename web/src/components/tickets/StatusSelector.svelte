<script lang="ts">
  import {
    calculateStatus,
    type TicketStatus,
  } from "@kiffarino/shared";
  import { emojiMap, statusLabelMap } from "./status";

  type Props = {
    status: TicketStatus;
    onChange?: (status: TicketStatus) => void;
  };

  const { status, onChange = console.log }: Props = $props();

  let newStatus = $state(status);

  const less = () => {
    const newOne = calculateStatus(newStatus, -1);
    newStatus = newOne;
    onChange(newOne);
  };
  const more = () => {
    const newOne = calculateStatus(newStatus, 1);
    newStatus = newOne;
    onChange(newOne);
  };
</script>

<div class="f r g">
  <button class="n-btn" onclick={less}>⬅️</button>
  <span>
    {`${emojiMap[newStatus]} ${statusLabelMap[newStatus]}`}
  </span>
  <button class="n-btn" onclick={more}>➡️</button>
</div>
