<script lang="ts">
  import { ticketStatuses, type TicketStatus } from "@kiffarino/shared";
  import { filter } from "../api/tickets";
  import FPC from "../components/layout/FullPageCentre.svelte";
  import Spinner from "../components/shared/Spinner.svelte";
  import ListItem from "../components/tickets/ListItem.svelte";
  import { emojiMap, statusLabelMap } from "../components/tickets/status";

  let statusFilter: HTMLDetailsElement;
  let statuses: TicketStatus[] | undefined = $state(["backlog"]);
  let titleFilter: string | undefined = $state("");
  let title: string | undefined = $state(undefined);
  const backLogPromise = $derived(filter({ statuses, title }));

  const isActive = (statuses: TicketStatus[], status: TicketStatus) =>
    statuses.includes(status);

  const toggleStatus = async (status: TicketStatus) => {
    statusFilter.open = false;
    if (!statuses) {
      statuses = [status];
      return;
    }

    if (statuses?.includes(status)) {
      statuses = statuses.filter((s) => s != status);
      return;
    }

    statuses.push(status);
    if (statuses.length === ticketStatuses.length) {
      statuses = undefined;
    }
  };

  const clearStatusFilter = () => {
    statusFilter.open = false;
    statuses = undefined;
  };

  const search = (e: SubmitEvent) => {
    e.preventDefault();

    title = titleFilter;
  };
</script>

<div class="f1 f c w100">
  <h1 class="ta-c">Backlog</h1>
  <div class="f r spa g pd">
    <form class="search" onsubmit={search}>
      <input
        type="text"
        bind:value={titleFilter}
        class="w100"
        placeholder="Search title..."
      />
      <button
        class="n-btn"
        type="button"
        disabled={!title}
        onclick={() => {
          titleFilter = "";
          title = undefined;
        }}
      >
        ❌
      </button>
    </form>
    <details class="dropdownFilter f1" bind:this={statusFilter}>
      <summary
        >{statuses && statuses.length
          ? `Status: ${statuses.join(", ")}`
          : "Status: All"}</summary
      >
      <div class="dropdownFilter-content">
        <label class="n-btn">
          <input
            type="checkbox"
            checked={!statuses || statuses?.length === 0}
            onchange={clearStatusFilter}
          />
          All
        </label>

        {#each ticketStatuses as status}
          <label class="n-btn">
            <input
              type="checkbox"
              checked={isActive(statuses || [], status)}
              onchange={() => toggleStatus(status)}
            />
            {`${statusLabelMap[status]} ${emojiMap[status]}`}
          </label>
        {/each}
      </div>
    </details>
  </div>
  {#await backLogPromise}
    <FPC>
      <Spinner />
    </FPC>
  {:then resp}
    <ul class="f1 f c">
      {#each resp?.result ?? [] as ticket}
        <ListItem {ticket} showStatus />
      {:else}
        <FPC>
          <h1>🤷</h1>
          <h2>No tickets</h2>
        </FPC>
      {/each}
    </ul>
  {/await}
</div>

<style>
  .search {
    flex: 3;
    display: flex;
    border: 1px solid var(--gray-color);
    border-radius: var(--border-radius);
  }
  .dropdownFilter {
    position: relative;
  }
  
  summary {
    cursor: pointer;
    padding: 1rem;
    border: 1px solid var(--gray-color);
    border-radius: var(--border-radius);
  }

  summary::marker {
    color: var(--main-font-color);
  }

  .dropdownFilter[open] .dropdownFilter-content {
    display: flex;
  }

  .dropdownFilter-content {
    position: absolute;
    top: 100%;
    left: 0;
    z-index: 999;
    width: 100%;
    margin-top: 0.25em;
    padding: 0.5em;
    border: 1px solid var(--gray-color);
    background-color: var(--black-2-color);
    border-radius: 6px;
    display: none;
    flex-direction: column;
    gap: 0.25em;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  .n-btn {
    display: flex;
    align-items: center;
    gap: 0.5em;
    padding: 0.25em 0.5em;
    border: none;
    background: transparent;
    cursor: pointer;
  }

  input[type="checkbox"] {
    margin: 0;
  }
  ul {
    padding: 1rem 2rem;
  }

  h2 {
    color: var(--gray-color);
  }
</style>
