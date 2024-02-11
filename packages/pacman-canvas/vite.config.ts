// vite.config.ts
import { defineConfig } from "vite";

import typescript from "@rollup/plugin-typescript";
import path from "path";
import { typescriptPaths } from "rollup-plugin-typescript-paths";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react({ include: ["**/*.tsx", "**/*.ts"] })],
  resolve: {
    alias: [
      {
        find: "../../assets/fonts",
        replacement: path.resolve(__dirname, "./lib/assets/fonts"),
      },
      {
        find: "~",
        replacement: path.resolve(__dirname, "./src"),
      },
      {
        find: "~",
        replacement: path.resolve(__dirname, "./lib"),
      },
    ],
  },
  build: {
    manifest: true,
    minify: true,
    reportCompressedSize: true,
    copyPublicDir: false,

    // See https://vitejs.dev/guide/build.html#library-mode
    lib: {
      entry: path.resolve(__dirname, "lib/main.ts"),
      fileName: "main",
      formats: ["es", "cjs"],
    },
    rollupOptions: {
      external: ["react", "react-dom"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
      },
      plugins: [
        typescriptPaths({
          preserveExtensions: true,
        }) as any,
        (typescript as any)({
          sourceMap: false,
          declaration: true,
          outDir: "dist",
        }),
      ],
    },
  },
});
