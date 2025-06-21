<script lang="ts">
  import Counter from "./components/Counter.svelte";
  import { SERVER_PORT } from "@kiffarino/shared/config";

  const promise = fetch(`http://localhost:${SERVER_PORT}/health`).then((r) =>
    r.json()
  );
</script>

<main class="f1 ta-c">
  <h1>
    {SERVER_PORT}
  </h1>
  {#await promise}
    Loading...
  {:then resp}
<pre>
{JSON.stringify(resp, null, 2)}
</pre>
  {/await}

  <Counter />
</main>
