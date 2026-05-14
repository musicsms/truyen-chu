import { createHash } from "node:crypto";

export function weakEtag(input: unknown): string {
  const hash = createHash("sha256").update(JSON.stringify(input)).digest("hex");
  return `W/"${hash}"`;
}
