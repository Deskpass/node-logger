import esbuild from "esbuild";
import { clean } from "esbuild-plugin-clean";
import { nodeExternalsPlugin } from "esbuild-node-externals";

esbuild
  .build({
    entryPoints: ["./src/logger.ts"],
    outfile: "./dist/logger.js",
    bundle: true,
    minify: false,
    platform: "node",
    format: "cjs",
    target: "node18",
    plugins: [
      // CLean the lib directory before building
      clean({ patterns: "./dist" }),
      // Exclude node_modules from the bundle
      nodeExternalsPlugin(),
    ],
  })
  .catch(() => process.exit(1));
