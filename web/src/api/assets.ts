import {
  type ApiResult,
  type StaticAssetFile,
  type TicketStatus,
} from "@kiffarino/shared";
import { postFile } from "./http";
import { parse } from "./libs";
import { ASSETS_API } from "./shared";

export type Filters = {
  statuses?: TicketStatus[];
  title?: string;
  tag?: string;
};

export async function upload(
  formData: FormData
): Promise<ApiResult<StaticAssetFile> | null> {
  const resp = await postFile(ASSETS_API, formData);

  if (resp.status !== 201) {
    return null;
  }

  return parse<ApiResult<StaticAssetFile>>(resp);
}
