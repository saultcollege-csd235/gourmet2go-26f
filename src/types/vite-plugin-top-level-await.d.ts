declare module "vite-plugin-top-level-await" {
  import type { Plugin } from "vite";

  interface TopLevelAwaitOptions {
    promiseExportName?: string;
    promiseImportName?: (index: number) => string;
  }

  export default function topLevelAwait(
    options?: TopLevelAwaitOptions
  ): Plugin;
}
