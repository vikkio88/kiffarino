import { NAME } from "@kiffarino/shared";
import { C } from "../../libs/colours";
import { getVersion } from "./version";

export function header() {
  return `
${C.b(NAME)} ${C.cG(`v${getVersion()}`)}
${C.i("your local project management tool")}
`;
}
