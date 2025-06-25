<script lang="ts">
  import { board } from "../api/tickets";
  import Board from "../components/board/Board.svelte";
  import FPC from "../components/layout/FullPageCentre.svelte";
  import Spinner from "../components/shared/Spinner.svelte";

  const boardPromise = board();
</script>

{#await boardPromise}
  <FPC>
    <Spinner />
  </FPC>
{:then resp}
  {#if resp}
    <Board board={resp.result} />
  {:else}
    <h1>Error whilst Loading the Board</h1>
  {/if}
{/await}
