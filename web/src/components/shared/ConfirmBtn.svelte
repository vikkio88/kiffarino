<script lang="ts">
  import type { Snippet } from "svelte";

  type Props = {
    tooltip?: string;
    position?: "top" | "right" | "left" | "bottom";
    children: Snippet;
    onConfirm: () => void;
  };

  const { tooltip, position = "top", onConfirm, children }: Props = $props();
  let clicked = $state(false);
</script>

{#if !clicked}
  <button
    class="n-btn"
    data-tooltip={tooltip}
    data-tooltip-position={tooltip ? position : undefined}
    onclick={() => (clicked = true)}
  >
    {@render children()}
  </button>
{:else}
  <div class="f rc g choice">
    <button class="n-btn" onclick={() => (clicked = false)}>❌</button>
    <button
      class="n-btn"
      onclick={() => {
        onConfirm();
        clicked = false;
      }}
    >
      ✅
    </button>
  </div>
{/if}

<style>
  .choice {
    background-color: var(--gray-1-color);
    padding: 0.1rem 0.5rem;
    border-radius: var(--border-radius);
  }
</style>
