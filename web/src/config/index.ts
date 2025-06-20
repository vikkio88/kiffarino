import { SERVER_PORT } from "@kiffarino/shared";

export const SERVER_URL = import.meta.env.DEV
  ? `http://localhost:${SERVER_PORT}`
  : ``;
