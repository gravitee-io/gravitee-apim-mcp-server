import { copyFileSync, mkdirSync } from "node:fs";
import { spawnSync } from "node:child_process";

mkdirSync(".speakeasy/temp", { recursive: true });
copyFileSync(
  ".speakeasy/openapi-environments.yaml",
  ".speakeasy/temp/openapi-environments.yaml",
);

const result = spawnSync("speakeasy", ["run", ...process.argv.slice(2)], {
  stdio: "inherit",
});

process.exit(result.status ?? 1);
