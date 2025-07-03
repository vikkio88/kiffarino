<script lang="ts">
  import {
    linkTypes,
    type LinkType,
    type TicketRecord,
    type TitledLink,
  } from "@kiffarino/shared";
  import { typeEmojiMap, typeLabelMap } from "./linkType";
  import TitleSearch from "./TitleSearch.svelte";
  import { tick } from "svelte";
  import { filter } from "../../api/tickets";

  type Props = { links: TitledLink[]; onSuccess: () => void };

  const { links, onSuccess }: Props = $props();

  const hasNoLinks = links.length < 1;

  let selectedTicketToAdd: TicketRecord | undefined = $state();
  let selectedType: LinkType = $state("linked");
  let isAddingLink = $state(false);
  let isLinking = $state(false);
  let canAdd = $derived(Boolean(selectedTicketToAdd) && Boolean(selectedType));
  let results: undefined | TicketRecord[] = $state();

  const onReset = () => {
    selectedTicketToAdd = undefined;
    results = undefined;
  };

  const onCancel = () => {
    onReset();
    isLinking = false;
    isAddingLink = false;
  };

  const onSearch = async (title: string) => {
    const res = await filter({ title });
    if (!res) {
      results = [];
    }

    results = res?.result ?? [];
  };

  const add = () => {
    console.log("adding link", {
      ticket: selectedTicketToAdd,
      type: selectedType,
    });
    onCancel();
    onSuccess();
  };

  const select = (ticket: TicketRecord) => {
    results = undefined;
    selectedTicketToAdd = ticket;
    isLinking = true;
  };
</script>

<div class="wrapper">
  {#if isAddingLink}
    {#if isLinking}
      <div class="f rc g">
        <span>
          {selectedTicketToAdd?.title}
        </span>
        <div>
          <span>{typeEmojiMap[selectedType]}</span>
          <select bind:value={selectedType}>
            {#each linkTypes as t}
              <option value={t}>
                {typeLabelMap[t]}
              </option>
            {/each}
          </select>
        </div>
      </div>
    {/if}
    <div class="f r g spb">
      {#if !isLinking}
        <TitleSearch clearIcon="🧹" {onSearch} {onReset} />
      {/if}
      <div class="f r g">
        <button class="n-btn" class:hasNoLinks disabled={!canAdd} onclick={add}>
          ✅
        </button>
        <button class="n-btn" class:hasNoLinks onclick={onCancel}>❌</button>
      </div>
    </div>
    <div class="searchResult" class:hasResults={Boolean(results)}>
      {#if results}
        {#each results as ticket}
          <button class="n-btn" onclick={() => select(ticket)}>
            {ticket.title}
          </button>
        {:else}
          <span>No tickets...</span>
        {/each}
      {/if}
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
    position: relative;
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

  .searchResult {
    position: relative;
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

  .hasResults {
    display: flex;
    transform: scale(1);
    pointer-events: auto;
  }

  .searchResult button {
    all: unset;
    cursor: pointer;
    padding: 0.4em 0.6em;
    border-radius: 4px;
    transition: background-color 0.2s;
    color: var(--main-font-color);
  }
  .searchResult button:hover {
    background-color: var(--black-3-color);
  }

  select {
    padding: 0.5rem 1rem;
  }
</style>
