import { resolve } from "node:path";
import { validateContentRoot } from "../application/contentValidator.js";

const baseDir = process.env.INIT_CWD ?? process.cwd();
const contentRoot = resolve(baseDir, process.env.CONTENT_ROOT ?? "content/stories");
const result = await validateContentRoot(contentRoot);

if (!result.ok) {
  for (const error of result.errors) {
    console.error(error);
  }
  process.exit(1);
}

console.log(`Content validation passed: ${contentRoot}`);
