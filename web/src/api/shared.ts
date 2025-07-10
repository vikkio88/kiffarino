import { SERVER_PORT } from "@kiffarino/shared";

export const API_URL = import.meta.env.PROD
  ? "/api"
  : `http://localhost:${SERVER_PORT}/api`;

export const TICKETS_API = "tickets";
export const ASSETS_API = "assets";
