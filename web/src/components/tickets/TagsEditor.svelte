<script lang="ts">
  import { toTag } from "@kiffarino/shared";
  import { update } from "../../api/tickets";
  import ConfirmBtn from "../shared/ConfirmBtn.svelte";

  type Props = {
    ticketId: string;
    tags: string[];
  };

  const { ticketId, tags }: Props = $props();

  let localTags = $state(tags);

  let adding = $state(false);
  let input = $state("");

  const onSubmit = async (e: SubmitEvent) => {
    e.preventDefault();
    if (input.length < 2) {
      return;
    }

    const newTag = toTag(input.trim());

    if (localTags.includes(newTag)) {
      input = "";
      adding = false;
      return;
    }

    const resp = await update(ticketId, { tags: [...localTags, newTag] });
    if (resp) {
      localTags.push(newTag);
      input = "";
      adding = false;
      return;
    }
    //TODO: handle error
    adding = false;
  };

  const removeTag = async (tag: string) => {
    tag = toTag(tag);
    const newTags = [...localTags].filter((t) => t !== tag);
    const resp = await update(ticketId, { tags: newTags });
    if (resp) {
      localTags = newTags;
      return;
    }

    //TODO: handle error
  };
</script>

<div class="f rc tag-list">
  {#each localTags as tag}
    <!-- TODO: this should give you a choice, search bu tag or remove -->
    <ConfirmBtn onConfirm={() => removeTag(tag)} confirmLabel={"🗑️"}>
      <span class="tag">{tag}</span>
    </ConfirmBtn>
  {/each}

  {#if adding}
    <div class="f rc g choice">
      <form onsubmit={onSubmit}>
        <input bind:value={input} placeholder="Add tag..." class="tag-input" />
      </form>
      <button class="n-btn cancel" onclick={() => (adding = false)}>❌</button>
    </div>
  {:else}
    <button class="n-btn add" onclick={() => (adding = true)}>➕ Tag</button>
  {/if}
</div>

<style>
  .tag-list {
    flex-wrap: wrap;
    gap: 0.4rem;
  }

  .tag {
    background: var(--black-1-color);
    color: var(--primary-v1-color);
    padding: 0.5rem 1rem;
    border-radius: var(--border-radius);
    font-size: 1rem;
  }

  input {
    font-size: 0.85rem;
    padding: 0.2rem 0.5rem;
    border: 1px solid var(--gray-4-color);
    outline: none;
    flex: 4;
  }

  .cancel {
    flex: 1;
  }

  .n-btn {
    font-size: 0.85rem;
    padding: 0.2rem 0.5rem;
    margin: 0 0.5rem;
  }

  .add.n-btn:hover {
    background-color: var(--black-1-color);
  }

  .choice {
    background-color: var(--gray-1-color);
    padding: 0.1rem 0.5rem;
    border-radius: var(--border-radius);
  }
</style>
