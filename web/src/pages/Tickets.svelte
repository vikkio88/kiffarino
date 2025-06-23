<script lang="ts">
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
</script>

<h1>{id}</h1>
