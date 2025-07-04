<script lang="ts">
  import {
    Link,
    linkTypes,
    TitledLink,
    type LinkType,
    type TicketRecord,
  } from "@kiffarino/shared";
  import { typeEmojiMap, typeLabelMap } from "./linkType";
  import TitleSearch from "./TitleSearch.svelte";
  import { createLink, filter, removeLink } from "../../api/tickets";
  import ConfirmBtn from "../shared/ConfirmBtn.svelte";

  type Props = { links: TitledLink[]; ticketId: string };

  type Stage = "display" | "selecting" | "linking";

  const { links, ticketId }: Props = $props();

  let localLinks = $state(links);
  let hasNoLinks = $derived(localLinks.length < 1);

  let stage: Stage = $state("display");

  let selectedTicketToAdd: TicketRecord | undefined = $state();
  let selectedType: LinkType = $state("linked");
  let canAdd = $derived(Boolean(selectedTicketToAdd) && Boolean(selectedType));
  let results: undefined | TicketRecord[] = $state();

  const onDelete = async (linkedId: string) => {
    const result = await removeLink(ticketId, linkedId);
    if (result) {
      localLinks = localLinks.filter((l) => l.linkedId !== linkedId);
      return;
    }

    //TODO: handle error in case the removing operation failed
  };

  const onReset = () => {
    selectedTicketToAdd = undefined;
    results = undefined;
  };

  const onCancel = () => {
    onReset();
    stage = "display";
  };

  const onSearch = async (title: string) => {
    const res = await filter({ title });
    if (!res) {
      results = [];
    }

    results = (res?.result ?? []).filter(
      (t) =>
        t.id !== ticketId && !localLinks.map((l) => l.linkedId).includes(t.id)
    );
  };

  const add = async () => {
    if (!selectedTicketToAdd) {
      return;
    }

    const newLink = new Link(selectedTicketToAdd.id, selectedType);

    const result = await createLink(ticketId, newLink);
    if (result) {
      localLinks.push(new TitledLink(newLink, selectedTicketToAdd.title));
      onCancel();
      return;
    }

    // TODO: handle error
    onCancel();
  };

  const select = (ticket: TicketRecord) => {
    results = undefined;
    selectedTicketToAdd = ticket;
    stage = "linking";
  };
</script>

<div class="wrapper">
  {#if stage === "selecting" || stage === "linking"}
    <div class="f r g spb">
      {#if stage === "linking"}
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
      {#if stage === "selecting"}
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
  {/if}
  {#if stage === "display"}
    <ul>
      {#each localLinks as link}
        <li class="f g">
          <ConfirmBtn
            tooltip="Remove Link"
            onConfirm={() => onDelete(link.linkedId)}>🗑️</ConfirmBtn
          >
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
      class="n-btn add"
      class:hasNoLinks
      onclick={() => (stage = "selecting")}>➕ Link</button
    >
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

  .add.n-btn {
    color: var(--main-font-color);
  }
  .add.n-btn:hover {
    background-color: var(--black-1-color);
    color: var(--main-font-color);
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .link {
    cursor: pointer;
    background-color: var(--main-bg-color);
    border: 1px solid var(--accent-faint-color);
    border-radius: var(--border-radius);
    padding: 0.5rem 1rem;
    display: flex;
    align-items: center;
    max-width: 280px;
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
    font-weight: bold;
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
