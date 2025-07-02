<script lang="ts">
  import type { TicketStatus, TicketType } from "@kiffarino/shared";
  import Status from "./Status.svelte";
  import Type from "./Type.svelte";
  import { update } from "../../api/tickets";
  import StatusSelector from "./StatusSelector.svelte";
  import TypeSelector from "./TypeSelector.svelte";

  export type TicketInfo = {
    status?: TicketStatus;
    type?: TicketType;
  };

  type Props = {
    id?: string;
    status: TicketStatus;
    type: TicketType;
    onSuccess?: () => void;
    onChange?: (info: TicketInfo) => void;
  };

  const { id, status, type, onSuccess, onChange }: Props = $props();

  let isEditing = $state(id === undefined);
  let updatedStatus: TicketStatus | undefined = undefined;
  let updatedType: TicketType | undefined = undefined;
  const onStatusChange = (status: TicketStatus) => {
    updatedStatus = status;
    onChange?.({ status });
  };
  const onTypeChange = (type: TicketType) => {
    updatedType = type;
    onChange?.({ type });
  };

  const saveInfo = async () => {
    if (!updatedStatus && !updatedType) {
      isEditing = false;
      return;
    }

    // This means is updating
    if (!id || !onSuccess) {
      console.error("Trying to Update but no id nor onSuccess specified");
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
    return;
  };
</script>

{#if isEditing}
  <TypeSelector {type} onChange={onTypeChange} />
  <StatusSelector {status} onChange={onStatusChange} />

  {#if id}
    <div class="f r g">
      <button class="n-btn" onclick={saveInfo}>💾</button>
      <button class="n-btn" onclick={() => (isEditing = false)}> ❌ </button>
    </div>
  {/if}
{:else}
  <Type {type} extended />
  <Status {status} extended />
  <button class="n-btn" onclick={() => (isEditing = true)}> ⚙️ </button>
{/if}
