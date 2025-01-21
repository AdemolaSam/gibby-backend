import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/server.ts"],
  outDir: "dist",
  format: ["cjs", "esm"],
  sourcemap: true,
  clean: true,
});
