<script lang="ts">
  import { ticketTypes, type TicketType } from "@kiffarino/shared";
  import { typeEmojiMap, typeLabelMap } from "./type";

  type Props = {
    type: TicketType;
    onChange?: (type: TicketType) => void;
  };

  const { type, onChange = console.log }: Props = $props();
  let selectedType = $state(type);

  const handleChange = (e: Event) => {
    const newType = (e.target as HTMLSelectElement).value as TicketType;
    selectedType = newType;
    onChange(newType);
  };
</script>

<div class="f r g aic">
  <span>{typeEmojiMap[selectedType]}</span>
  <select onchange={handleChange} bind:value={selectedType}>
    {#each ticketTypes as t}
      <option value={t}>
        {typeLabelMap[t]}
      </option>
    {/each}
  </select>
</div>

<style>
  select {
    padding: 0.5rem 1rem;
  }
</style>
