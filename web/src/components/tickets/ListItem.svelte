<script lang="ts">
  import {
    calculateStatus,
    type TicketRecord,
    type TicketStatus,
  } from "@kiffarino/shared";
  import Status from "./Status.svelte";
  import Type from "./Type.svelte";

  type Props = {
    ticket: TicketRecord;
    showStatus?: boolean;
    showMoveActions?: boolean;
    onMove?: (ticket: TicketRecord, status: TicketStatus) => void;
  };

  const {
    ticket,
    showStatus = false,
    showMoveActions = false,
    onMove = (t: TicketRecord, status: TicketStatus) =>
      console.log({ t, status }),
  }: Props = $props();
</script>

<li>
  <Type type={ticket.type} />
  {#if showStatus}
    <Status status={ticket.status} />
  {/if}
  <a href={`/tickets/${ticket.id}`}>{ticket.title}</a>
  {#if showMoveActions}
    <div class="move f r c g">
      <button
        disabled={ticket.status === "idea"}
        class="small n-btn"
        onclick={() => onMove(ticket, calculateStatus(ticket.status, -1))}
      >
        ⬆️
      </button>
      <button
        disabled={ticket.status === "done"}
        class="small n-btn"
        onclick={() => onMove(ticket, calculateStatus(ticket.status, 1))}
      >
        ⬇️
      </button>
    </div>
  {/if}
</li>

<style>
  li {
    padding: 2rem 1rem;
    gap: 1rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: var(--black-2-color);
  }

  li:hover {
    background-color: var(--black-1-color);
  }

  li:hover > .move {
    visibility: visible;
  }

  a {
    flex: 1;
    text-align: center;
    color: var(--main-font-color);
    font-weight: bold;
  }

  a:hover {
    text-decoration: underline;
  }

  .move {
    visibility: hidden;
  }
</style>
