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
    priority?: number;
  };

  type Props = {
    id?: string;
    canEdit?: boolean;
    status: TicketStatus;
    type: TicketType;
    priority?: number;
    onSuccess?: () => void;
    onChange?: (info: TicketInfo) => void;
  };

  const {
    id,
    status,
    type,
    priority,
    onSuccess,
    onChange,
    canEdit = true,
  }: Props = $props();

  let isEditing = $state(id === undefined);
  let updatedStatus: TicketStatus | undefined = undefined;
  let updatedType: TicketType | undefined = undefined;
  let updatedPriority: number | undefined = undefined;

  const onStatusChange = (status: TicketStatus) => {
    updatedStatus = status;
    onChange?.({ status });
  };
  const onTypeChange = (type: TicketType) => {
    updatedType = type;
    onChange?.({ type });
  };
  const onPriorityChange = (priority: number) => {
    updatedPriority = priority;
    onChange?.({ priority });
  };

  const saveInfo = async () => {
    if (!updatedStatus && !updatedType && !updatedPriority) {
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
      priority: updatedPriority,
    });
    if (result) {
      onSuccess();
    }
    isEditing = false;
    return;
  };
</script>

{#if isEditing && canEdit}
  <div class="f rc g">
    <div data-tooltip="Priority">
      🚨
      <input
        type="number"
        min="0"
        max="100"
        step="1"
        value={priority}
        onchange={(e) => {
          const value = Number((e.target as HTMLInputElement).value) || 0;
          onPriorityChange(value);
        }}
      />
    </div>
    <TypeSelector {type} onChange={onTypeChange} />
    <StatusSelector {status} onChange={onStatusChange} />
  </div>

  {#if id}
    <div class="f r g">
      <button class="n-btn" onclick={saveInfo}>💾</button>
      <button class="n-btn" onclick={() => (isEditing = false)}> ❌ </button>
    </div>
  {/if}
{:else}
  <div class="f r c g">
    {#if (priority ?? 0) > 0}
      <div class="priority" data-tooltip={`Priority ${priority}`} data-tooltip-position="bottom">🚨</div>
    {/if}
    <Type {type} extended />
    <Status {status} extended />
  </div>

  <button class="n-btn" disabled={!canEdit} onclick={() => (isEditing = true)}>
    ⚙️
  </button>
{/if}

<style>
  input[type="number"] {
    padding: 0.5rem 1rem;
    width: 90px;
  }
</style>
