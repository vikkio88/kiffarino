<script lang="ts">
  import type { TicketStatus, TicketType } from "@kiffarino/shared";
  import Status from "./Status.svelte";
  import Type from "./Type.svelte";
  import { update } from "../../api/tickets";
  import StatusSelector from "./StatusSelector.svelte";
  import TypeSelector from "./TypeSelector.svelte";

  type Props = {
    id: string;
    status: TicketStatus;
    type: TicketType;
    onSuccess: () => void;
  };

  const { id, status, type, onSuccess }: Props = $props();

  let isEditing = $state(false);
  let updatedStatus: TicketStatus | undefined = undefined;
  let updatedType: TicketType | undefined = undefined;
  const onStatusChange = (status: TicketStatus) => {
    updatedStatus = status;
  };
  const onTypeChange = (type: TicketType) => {
    updatedType = type;
  };

  const saveInfo = async () => {
    if (!updatedStatus && !updatedType) {
      isEditing = false;
      return;
    }

    const result = await update(id, {
      status: updatedStatus,
      type: updatedType,
    });
    if (result) {
      onSuccess();
    }
    isEditing = false;
  };
</script>

{#if isEditing}
  <StatusSelector {status} onChange={onStatusChange} />
  <TypeSelector {type} onChange={onTypeChange} />
  <div class="f r g">
    <button class="n-btn" onclick={saveInfo}>💾</button>
    <button class="n-btn" onclick={() => (isEditing = false)}> ❌ </button>
  </div>
{:else}
  <Status {status} extended />
  <Type {type} extended />
  <button class="n-btn" onclick={() => (isEditing = true)}> ⚙️ </button>
{/if}
