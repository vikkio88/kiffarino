<script lang="ts">
  import { tick } from "svelte";
  import {
    appendToText,
    CURSOR_POSITION,
    PLACEHOLDER,
    insertAtSelection,
    moveCursor,
    csFromTextArea,
    substringSelection,
    csFromTextAreaOrUndefined,
    wrapSelection,
    PLUGIN_PATTERN,
    LINK_PATTERN,
    IMAGE_PATTERN,
  } from "./editor/libs";
  import Renderer from "../md/Renderer.svelte";

  type Props = {
    initialValue?: string;
    placeholder?: string;
    onChange: (value: string) => void;
  };

  const {
    initialValue,
    placeholder = "Add some markdown text...",
    onChange,
  }: Props = $props();

  let textarea: HTMLTextAreaElement | undefined = $state();

  let value = $state(initialValue ?? "");

  const addImage = async () => {
    const selection = csFromTextAreaOrUndefined(textarea!);
    if (!selection) {
      value = appendToText(value, IMAGE_PATTERN, "Image");
    } else {
      value = wrapSelection(selection, value, IMAGE_PATTERN, "Image");
    }
    value = value.replace(CURSOR_POSITION, "URL").replace(PLACEHOLDER, "");
    await tick();

    const cursorPos = substringSelection(value, "URL");
    if (!cursorPos) return;

    moveCursor(textarea!, cursorPos);
  };

  const addLink = async () => {
    const selection = csFromTextArea(textarea!);
    if (selection.start === selection.end) {
      return;
    }

    // maybe move to use wrap selection?
    const newValue = insertAtSelection(selection, value, LINK_PATTERN);
    value = newValue ?? "";
    await tick();
    const cursorPos = substringSelection(value, "URL");
    if (!cursorPos) return;

    moveCursor(textarea!, cursorPos);
  };

  const addPluginBlock = async () => {
    const selection = csFromTextAreaOrUndefined(textarea!);
    if (!selection) {
      value = appendToText(value, PLUGIN_PATTERN, "Plugin body");
    } else {
      value = wrapSelection(selection, value, PLUGIN_PATTERN);
    }

    value = value.replace(CURSOR_POSITION, "PLUGIN_NAME");
    await tick();

    const cursorPos = substringSelection(value, "PLUGIN_NAME");
    if (!cursorPos) return;

    moveCursor(textarea!, cursorPos);
  };

  let showPreview = $state(false);
</script>

<div class="commands">
  <div class="editorCommands">
    <button class="n-btn" disabled={showPreview} onclick={addImage}>🖼️</button>
    <button class="n-btn" disabled={showPreview} onclick={addLink}>🔗</button>
    <button class="n-btn" disabled={showPreview} onclick={addPluginBlock}>
      🔌
    </button>
  </div>

  <button class="n-btn" onclick={() => (showPreview = !showPreview)}>
    {#if showPreview}
      📝
    {:else}
      👁️
    {/if}
  </button>
</div>

{#if showPreview}
  <Renderer text={value} />
{:else}
  <textarea
    bind:this={textarea}
    bind:value
    {placeholder}
    oninput={() => onChange(value)}
  ></textarea>
{/if}

<style>
  .commands {
    width: 100%;
    background-color: var(--gray-1-color);
    display: flex;
    flex-direction: row;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
  }

  .editorCommands {
    flex: 5;
    display: flex;
    flex-direction: row;
    gap: 0.5rem;
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
