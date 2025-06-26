<script lang="ts">
  import { one } from "../api/tickets";
  import FCP from "../components/layout/FullPageCentre.svelte";
  import Renderer from "../components/md/Renderer.svelte";
  import Spinner from "../components/shared/Spinner.svelte";
  import Status from "../components/tickets/Status.svelte";
  import { cd } from "../libs/dates";

  type Props = {
    route: {
      result: {
        path: {
          params: {
            id: string;
          };
        };
      };
    };
  };

  const { route }: Props = $props();
  const id = route.result.path.params.id;

  const getOnePromise = one(id);
  let isEditable = $state(false);
</script>

{#await getOnePromise}
  <FCP>
    <Spinner />
  </FCP>
{:then resp}
  {#if resp?.result}
    <div class="f1 pd">
      <div class="head">
        {#if isEditable}
          <span>Edit</span>
          <div class="f r g">
            <button class="n-btn">💾</button>
            <button class="n-btn" onclick={() => (isEditable = false)}>❌</button>
          </div>
        {:else}
          <Status status={resp.result.status} extended />
          <button class="n-btn" onclick={() => (isEditable = true)}>
            ⚙️
          </button>
        {/if}
      </div>
      <h1 class="ta-c">{resp.result.title}</h1>

      <div class="body pd">
        <Renderer text={resp.result.body} />
      </div>
    </div>
    <div class="bottom">
      <div class="f c g_5">
        <span>
          Created: {cd(resp.result.createdAt)}
        </span>
        <span>Updated: {cd(resp.result.updatedAt)} </span>
      </div>

      <div>Links/Tags</div>

      <div class="f cc">Edit Delete</div>
    </div>
  {:else}
    <FCP>
      <h2>Error Loading</h2>
    </FCP>
  {/if}
{/await}

<style>
  .body {
    font-size: 1.2rem;
    min-height: 80%;
    overflow: auto;
  }

  .bottom {
    position: absolute;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 1rem;
    bottom: 0;
    width: 100%;
    background-color: var(--black-2-color);
  }

  .head {
    padding: 1rem;
    background-color: var(--black-2-color);
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }

  button:hover {
    opacity: 0.9;
  }
</style>
