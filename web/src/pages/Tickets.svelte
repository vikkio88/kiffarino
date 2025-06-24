<script lang="ts">
  import { one } from "../api/tickets";
  import FCP from "../components/layout/FullPageCentre.svelte";
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
  <h1>{resp?.result.title}</h1>
{/await}
