<script lang="ts">
  type Props = {
    initialValue?: string;
    placeholder?: string;
    onChange: (value: string) => void;
  };

  const {
    initialValue,
    placeholder = "Add a description...",
    onChange,
  }: Props = $props();
  let value = $state(initialValue ?? "");
</script>

<textarea onchange={() => onChange(value)} bind:value {placeholder}></textarea>

<style>
  textarea {
    width: 100%;
    height: 90%;
    resize: none;
    border: none;
    padding: 1rem;
    font-family: inherit;
    font-size: inherit;
    background-color: var(--black-2-color);
    color: var(--main-font-color);
  }
</style>
