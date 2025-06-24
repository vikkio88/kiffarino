import { SERVER_PORT } from "@kiffarino/shared";

export const API_URL = import.meta.env.DEV
  ? `http://localhost:${SERVER_PORT}/api`
  : "/api";

export const TICKETS_API = "tickets";
