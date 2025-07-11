<script lang="ts">
  import FPC from "../components/layout/FullPageCentre.svelte";
  import Board from "../components/board/Board.svelte";
  import logo from "../assets/favicon.svg";
  import { board } from "../api/tickets";
  import Spinner from "../components/shared/Spinner.svelte";

  let boardPromise = $derived(board());

  const onUpdate = () => {
    boardPromise = board();
  };
</script>

{#await boardPromise}
  <FPC>
    <Spinner />
  </FPC>
{:then resp}
  {#if resp}
    <Board board={resp.result} {onUpdate} />
  {:else}
    <h1>Error whilst Loading the Board</h1>
  {/if}
{/await}

<div class="bottom">
  <span>
    <a href="https://github.com/vikkio88/kiffarino" target="_blank">
      <img class="logo" src={logo} alt="Kiffarino Logo" /> kiffarino
    </a>
  </span>
</div>

<style>
  .bottom {
    position: absolute;
    display: flex;
    flex-direction: row;
    justify-content: center;
    padding: 1rem;
    bottom: 0;
    width: 100%;
    font-size: small;
  }
  .bottom > span > a {
    color: var(--gray-1-color);
  }

  .bottom > span > a:hover {
    color: var(--primary-color);
  }

  .logo {
    width: 1rem;
  }
</style>
