<script lang="ts">
  import { tick } from "svelte";

  const INSERT_PATTERN = "%SELECTION%";
  const CURSOR_POSITION = "%URL%";

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
  let textarea: HTMLTextAreaElement;
  let value = $state(initialValue ?? "");

  async function insertAtSelection(
    pattern: string,
    fallback: string | undefined = undefined
  ) {
    let selected = value.slice(textarea.selectionStart, textarea.selectionEnd);
    if (selected === "" && !fallback) {
      return;
    }

    if (selected === "" && fallback) {
      selected = fallback;
    }

    const newValue = `${value.slice(0, textarea.selectionStart)}${pattern.replace(INSERT_PATTERN, selected).replace(CURSOR_POSITION, "URL")}${value.slice(textarea.selectionEnd)}`;

    value = newValue;
    await tick();
    const cursorPos = newValue.indexOf("URL");

    textarea.focus();
    textarea.setSelectionRange(cursorPos, cursorPos + 3);
  }

  const addImage = () => {
    insertAtSelection(`\n![${INSERT_PATTERN}](${CURSOR_POSITION})\n`, "Image Alt");
  };

  const addLink = () => {
    insertAtSelection(`[${INSERT_PATTERN}](${CURSOR_POSITION})`);
  };
</script>

<div class="commands">
  <button class="n-btn" onclick={addImage}>🖼️</button>
  <button class="n-btn" onclick={addLink}>🔗</button>
</div>
<textarea
  bind:this={textarea}
  onchange={() => onChange(value)}
  bind:value
  {placeholder}
></textarea>

<style>
  .commands {
    width: 100%;
    background-color: var(--gray-1-color);
    display: flex;
    flex-direction: row;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
  }
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
