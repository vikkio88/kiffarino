<script lang="ts">
  import { tick, type Snippet } from "svelte";

  type Props = {
    children: Snippet;
    placeholder?: string;
    onSend: (text: string) => void;
  };

  const {
    children,
    placeholder = "Type here...",
    onSend = console.log,
  }: Props = $props();

  let expanded = $state(false);
  let text = $state("");

  const submit = async (e: SubmitEvent) => {
    e.preventDefault();
    if (text.length < 3) {
      return;
    }

    onSend(text);
    text = "";
    expanded = false;
  };

  const cancel = () => {
    expanded = false;
    text = "";
  };
</script>

{#if !expanded}
  <button class="n-btn" onclick={() => (expanded = true)}>
    {@render children()}
  </button>
{:else}
  <div class="f r g wrapper">
    <form class="f1" onsubmit={submit}>
      <input class="w100" {placeholder} bind:value={text} />
    </form>
    <button class="n-btn" onclick={cancel}>❌</button>
  </div>
{/if}

<style>
  .wrapper {
    background-color: var(--gray-1-color);
    padding: 0.5rem 1rem;
    border-radius: var(--border-radius);
  }

  form > input {
    font-size: 1.1rem;
  }
</style>
