import { PLUGIN_END_VAR, PLUGIN_NAME_VAR, PLUGIN_REGEXP } from "./const";

export const pluginNames = ["simple_md", "youtube", "code"] as const;
export type PluginName = (typeof pluginNames)[number];
export type Plugin = { name: PluginName };
export type Section = { source: string; plugin: Plugin };

const defaultPlugin: Plugin = { name: "simple_md" };

export function parsePlugins(text: string): Section[] {
  const sections: Section[] = [];

  let lastIndex = 0;
  let currentPlugin: Plugin | null = null;
  let match: RegExpExecArray | null;

  while ((match = PLUGIN_REGEXP.exec(text))) {
    const isStart = match[0].toLowerCase().includes("plugin:");
    const chunk = text.slice(lastIndex, match.index).trim();
    if (chunk) {
      sections.push({
        source: chunk,
        plugin: currentPlugin ?? defaultPlugin,
      });
    }

    if (isStart) {
      const name = match[1].toLowerCase();
      currentPlugin = pluginNames.includes(name as PluginName)
        ? {
            name: name as PluginName,
          }
        : defaultPlugin;
    } else {
      currentPlugin = null;
    }

    lastIndex = PLUGIN_REGEXP.lastIndex;
  }

  const tail = text.slice(lastIndex).trim();
  if (tail) {
    sections.push({
      source: tail,
      plugin: currentPlugin ?? defaultPlugin,
    });
  }

  return sections;
}

export function markdownFromSections(sections: Section[]): string {
  return sections
    .map((section) => {
      const { plugin, source } = section;

      if (plugin.name === "simple_md") {
        return source;
      }

      return `<!-- ${PLUGIN_NAME_VAR} ${plugin.name} -->\n${source}\n<!-- ${PLUGIN_END_VAR} -->`;
    })
    .join("\n\n");
}
