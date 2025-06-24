<script lang="ts">
  import { one } from "../api/tickets";
  import FCP from "../components/layout/FullPageCentre.svelte";
  import Renderer from "../components/md/Renderer.svelte";
  import Spinner from "../components/shared/Spinner.svelte";

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
</script>

{#await getOnePromise}
  <FCP>
    <Spinner />
  </FCP>
{:then resp}
  <div class="f1 pd">
    {#if resp?.result}
      <h1 class="ta-c">{resp.result.title}</h1>
      <div class="body pd">
        <Renderer text={resp.result.body} />
      </div>
    {:else}
      <FCP>
        <h2>Error Loading</h2>
      </FCP>
    {/if}
  </div>
{/await}

<style>
  .body {
    font-size: 1.2rem;
  }
</style>
