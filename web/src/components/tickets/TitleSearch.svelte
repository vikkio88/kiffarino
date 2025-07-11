<script lang="ts">
  type Props = {
    initialValue?: string;
    placeholder?: string;
    clearIcon?: string;
    onSearch: (title: string) => void;
    onReset: () => void;
  };

  const {
    initialValue,
    placeholder = "Search title...",
    onSearch,
    onReset,
    clearIcon = "❌",
  }: Props = $props();

  let title: undefined | string = $state(initialValue);

  const onSubmit = (e: SubmitEvent) => {
    e.preventDefault();
    if (!title || title.length < 2) {
      return;
    }

    onSearch(title);
  };
</script>

<form onsubmit={onSubmit}>
  <input type="text" bind:value={title} class="w100" {placeholder} />
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
      {clearIcon}
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
