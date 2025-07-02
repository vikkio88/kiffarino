<script lang="ts">
  type Props = { onSearch: (title: string) => void; onReset: () => void };

  const { onSearch, onReset }: Props = $props();

  let title: undefined | string = $state(undefined);

  const onSubmit = (e: SubmitEvent) => {
    e.preventDefault();
    if (!title || title.length < 2) {
      return;
    }

    onSearch(title);
  };
</script>

<form onsubmit={onSubmit}>
  <input
    type="text"
    bind:value={title}
    class="w100"
    placeholder="Search title..."
  />
  <div>
    <button
      class="n-btn"
      type="button"
      disabled={!title}
      onclick={() => {
        title = undefined;
        onReset();
      }}
    >
      ❌
    </button>
  </div>
</form>

<style>
  form {
    display: flex;
    border: var(--form-borders);
    border-radius: var(--border-radius);
  }

  div {
    padding: 1rem;
  }
</style>
