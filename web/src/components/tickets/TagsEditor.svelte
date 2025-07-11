<script lang="ts">
  import { toTag } from "@kiffarino/shared";
  import { tagsFilter, update } from "../../api/tickets";
  import ConfirmBtn from "../shared/ConfirmBtn.svelte";
  import { goto } from "@mateothegreat/svelte5-router";
  import { p } from "../../api/libs";

  type Props = {
    ticketId: string;
    tags: string[];
  };

  const { ticketId, tags }: Props = $props();
  let debounceTimer: ReturnType<typeof setTimeout>;

  let localTags = $state(tags);

  let adding = $state(false);
  let input = $state("");

  let results: string[] | undefined = $state(undefined);

  const onSubmit = async (e: SubmitEvent) => {
    e.preventDefault();
    if (input.length < 2) {
      return;
    }

    select(input);
  };

  const removeTag = async (tag: string) => {
    tag = toTag(tag);
    const newTags = [...localTags].filter((t) => t !== tag);
    const resp = await update(ticketId, { tags: newTags });
    if (resp) {
      localTags = newTags;
      return;
    }

    console.error(`Could  not  remove tag`);

    //TODO: handle error
  };

  const onChange = () => {
    if (input.length < 3) {
      return;
    }

    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(async () => {
      console.log("will trigger search", { input });
      const remoteTags = await tagsFilter(input);
      if (!remoteTags) {
        results = undefined;
        return;
      }

      results = remoteTags.result;
    }, 750);
  };

  const select = async (tag: string) => {
    results = undefined;
    const newTag = toTag(tag.trim());

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

  const reset = () => {
    input = "";
    results = undefined;
    adding = false;
  };
</script>

<div class="f rc tag-list">
  {#each localTags as tag}
    <ConfirmBtn
      onConfirm={() => removeTag(tag)}
      confirmLabel={"🗑️"}
      cancelLabel={"↩️"}
      secondaryAction={{
        label: "🔎",
        onClick: () => {
          goto(`/backlog${p({ tag })}`);
        },
      }}
    >
      <span class="tag">{tag}</span>
    </ConfirmBtn>
  {/each}

  {#if adding}
    <div class="f rc g choice">
      <div class="searchResult" class:hasResults={Boolean(results)}>
        {#if results}
          {#each results as tag}
            <button class="n-btn" onclick={() => select(tag)}>
              {tag}
            </button>
          {:else}
            <span>No Tags {`"${input}" yet.`}</span>
            <span>[Enter] to create</span>
          {/each}
        {/if}
      </div>
      <form onsubmit={onSubmit}>
        <input
          bind:value={input}
          oninput={onChange}
          placeholder="Add tag..."
          class="tag-input"
        />
      </form>
      <button class="n-btn cancel" onclick={reset}>❌</button>
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
    position: relative;
    background-color: var(--gray-1-color);
    padding: 0.1rem 0.5rem;
    border-radius: var(--border-radius);
  }

  .searchResult {
    position: absolute;
    top: -100px;
    left: 0;
    width: 100%;
    z-index: 10;
    margin-top: 1rem;
    padding: 0.5em;
    border: 1px solid var(--gray-color);
    background-color: var(--black-2-color);
    border-radius: 6px;
    flex-direction: column;
    gap: 0.25em;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    max-height: 200px;
    overflow-y: auto;
    transition:
      opacity 0.2s ease,
      transform 0.2s ease;
    display: none;
    transform: scale(0.98);
    pointer-events: none;
  }

  .searchResult > span {
    text-align: center;
    color: var(--gray-2-color);
    font-size: smaller;
  }

  .hasResults {
    display: flex;
    transform: scale(1);
    pointer-events: auto;
  }
</style>
