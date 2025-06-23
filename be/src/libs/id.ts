import { ulid } from "ulid";

export function generatedId() {
  return ulid().toString();
}
