<script lang="ts">
  import type { LinkType, TicketRecord, TitledLink } from "@kiffarino/shared";
  import { typeEmojiMap, typeLabelMap } from "./linkType";
  import TitleSearch from "./TitleSearch.svelte";

  type Props = { links: TitledLink[]; onSuccess: () => void };

  const { links, onSuccess }: Props = $props();

  const hasNoLinks = links.length < 1;

  let selectedTicketToAdd: TicketRecord | undefined = $state();
  let selectedType: LinkType = $state("linked");
  let isAddingLink = $state(false);
  let canAdd = $derived(Boolean(selectedTicketToAdd) && Boolean(selectedType));

  const onReset = () => {
    selectedTicketToAdd = undefined;
  };

  const onCancel = () => {
    onReset();
    isAddingLink = false;
  };
  const add = () => {
    console.log("adding link");
    isAddingLink = false;
    onSuccess();
  };
</script>

<div class="wrapper">
  {#if isAddingLink}
    <div class="f r g spb">
      <TitleSearch
        clearIcon="🧹"
        onSearch={(title) => console.log({ title })}
        {onReset}
      />
      <div class="f r g">
        <button class="n-btn" class:hasNoLinks disabled={!canAdd} onclick={add}>
          ✅
        </button>
        <button class="n-btn" class:hasNoLinks onclick={onCancel}>❌</button>
      </div>
    </div>
  {:else}
    <ul>
      {#each links as link}
        <li>
          <div
            class="link"
            data-tooltip={typeLabelMap[link.type]}
            data-tooltip-position="right"
          >
            <a href={`/tickets/${link.linkedId}`}>
              {link.title}
            </a>
            {typeEmojiMap[link.type]}
          </div>
        </li>
      {/each}
    </ul>
    <button
      class="n-btn"
      class:hasNoLinks
      onclick={() => (isAddingLink = true)}
    >
      Add Link
    </button>
  {/if}
</div>

<style>
  .wrapper {
    padding: var(--pad);
    border: var(--borders);
    border-radius: var(--border-radius);
    background-color: var(--black-2-color);
    width: 350px;
  }

  button.n-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: bold;
    font-size: 1.1rem;
    color: var(--primary-color);
    margin-top: 1rem;
  }
  button.n-btn:hover {
    color: var(--primary-v1-color);
  }

  .hasNoLinks {
    margin-bottom: 1rem;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  li {
    display: flex;
  }

  .link {
    cursor: pointer;
    background-color: var(--main-bg-color);
    border: 1px solid var(--accent-faint-color);
    border-radius: var(--border-radius);
    padding: 0.5rem 1rem;
    display: flex;
    align-items: center;
    gap: 0.7rem;
    flex: 1;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    transition:
      background-color 0.3s,
      border-color 0.3s;
  }

  .link a {
    flex: 1;
    color: var(--main-font-color);
    text-decoration: none;
    font-weight: 600;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .link a:hover,
  .link a:focus {
    color: var(--primary-color);
    text-decoration: underline;
  }
</style>
