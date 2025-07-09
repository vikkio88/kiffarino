export const PLUGIN_NAME_PH = "%PLUGIN_NAME%";
export const PLUGIN_BODY_PH = "%PLUGIN_BODY%";
export const PLUGIN_NAME_VAR = `plugin:`;
export const PLUGIN_END_VAR = `endplugin`;
export const PLUGIN_SECTION = `\n<!-- ${PLUGIN_NAME_VAR} ${PLUGIN_NAME_PH} -->\n${PLUGIN_BODY_PH}\n<!-- ${PLUGIN_END_VAR} -->`;
export const PLUGIN_REGEXP = new RegExp(
  `<!--\\s*${PLUGIN_NAME_VAR}\\s*(\\w+)\\s*-->|<!--\\s*${PLUGIN_END_VAR}\\s*-->`,
  "gi"
);
