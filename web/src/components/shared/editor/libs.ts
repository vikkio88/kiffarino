import {
  PLUGIN_BODY_PH,
  PLUGIN_NAME_PH,
  PLUGIN_SECTION,
} from "../../md/parser/const";

export const PLACEHOLDER = "%PLACEHOLDER%";
export const CURSOR_POSITION = "%CURSOR%";
export const PLUGIN_PATTERN = PLUGIN_SECTION.replace(
  PLUGIN_NAME_PH,
  CURSOR_POSITION
).replace(PLUGIN_BODY_PH, PLACEHOLDER);
export const LINK_PATTERN = `[${PLACEHOLDER}](${CURSOR_POSITION})`;
export const IMAGE_PATTERN = `\n![${PLACEHOLDER}](${CURSOR_POSITION})\n`;

export type CursorSelection = {
  start: number;
  end: number;
};

export function csFromTextArea(textarea: HTMLTextAreaElement): CursorSelection {
  return cs(textarea.selectionStart, textarea.selectionEnd);
}

export function csFromTextAreaOrUndefined(
  textarea: HTMLTextAreaElement
): CursorSelection | undefined {
  if (textarea.selectionStart === textarea.selectionEnd) return undefined;
  return csFromTextArea(textarea);
}

export function cs(start: number, end?: number): CursorSelection {
  if (!end || end < start) {
    end = start;
  }

  return { start, end };
}

export function moveCursor(
  textarea: HTMLTextAreaElement,
  position: CursorSelection
) {
  textarea.focus();
  textarea.setSelectionRange(position.start, position.end);
}

export function substringSelection(
  text: string,
  substring: string
): CursorSelection | null {
  const start = text.indexOf(substring);
  if (start === -1) return null;
  const end = start + substring.length;
  return cs(start, end);
}

export function wrapSelection(
  selection: CursorSelection,
  value: string,
  pattern: string,
  fallback?: string
) {
  let selected = value.slice(selection.start, selection.end);
  if (selected === "" && !fallback) {
    return value;
  }

  if (selected === "" && fallback) {
    selected = fallback;
  }

  return `${value.slice(0, selection.start)}${pattern.replace(
    PLACEHOLDER,
    selected
  )}${value.slice(selection.end)}`;
}

export function appendToText(
  value: string,
  pattern: string,
  fallback?: string
) {
  return `${value}${pattern.replace(PLACEHOLDER, fallback ?? "")}`;
}
