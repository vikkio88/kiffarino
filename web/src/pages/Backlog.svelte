<script lang="ts">
  import { ticketStatuses, type TicketStatus } from "@kiffarino/shared";
  import { filter } from "../api/tickets";
  import FPC from "../components/layout/FullPageCentre.svelte";
  import Spinner from "../components/shared/Spinner.svelte";
  import ListItem from "../components/tickets/ListItem.svelte";
  import { emojiMap, statusLabelMap } from "../components/tickets/status";
  let statuses: TicketStatus[] | undefined = $state(["backlog"]);
  const backLogPromise = $derived(filter({ statuses }));

  const isActive = (statuses: TicketStatus[], status: TicketStatus) =>
    statuses.includes(status);

  const toggleStatus = async (status: TicketStatus) => {
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
</script>

<div class="f1 f c w100">
  <h1 class="ta-c">Backlog</h1>
  <div class="statusFilter f rc g w100">
    <button
      class:active={!statuses || statuses?.length === 0}
      onclick={() => (statuses = undefined)}>All</button
    >
    {#each ticketStatuses as status}
      <button
        class="f rc g"
        class:active={isActive(statuses || [], status)}
        onclick={() => toggleStatus(status)}
      >
        <input type="checkbox" checked={isActive(statuses || [], status)} />
        {`${statusLabelMap[status]} ${emojiMap[status]}`}
      </button>
    {/each}
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
  .statusFilter {
    overflow: auto;
    padding: 0 2rem;
  }
  .statusFilter > button {
    flex: 1;
    font-size: 0.8rem;
  }
  .active {
    background-color: var(--accent-faint-color);
    color: var(--main-bg-color);
  }

  .active:hover {
    color: var(--main-font-color);
  }

  ul {
    padding: 1rem 2rem;
  }

  h2 {
    color: var(--gray-color);
  }
</style>
