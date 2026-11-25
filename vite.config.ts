import { defineConfig } from "vite";
import { resolve } from "node:path";
import { footer, header } from "./src/shell";

function htmlShell() {
  return {
    name: "gta-html-shell",
    transformIndexHtml: {
      order: "pre" as const,
      handler(html: string) {
        const page = /<body[^>]*data-page="([^"]+)"/.exec(html)?.[1] ?? "home";
        return html
          .replace("<!-- @header -->", header(page))
          .replace("<!-- @footer -->", footer());
      },
    },
  };
}

const pages = [
  "index",
  "database",
  "vehicles",
  "characters",
  "map",
  "news",
  "resources",
  "guides",
];

export default defineConfig({
  base: "./",
  plugins: [htmlShell()],
  build: {
    target: "es2020",
    cssTarget: "safari15",
    rollupOptions: {
      input: Object.fromEntries(
        pages.map((page) => [page, resolve(import.meta.dirname, `${page}.html`)]),
      ),
    },
  },
});
