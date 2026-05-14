import { defineConfig, Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import fs from "fs";
import { componentTagger } from "lovable-tagger";

/**
 * Vite-плагин для автогенерации sitemap.xml с актуальной датой lastmod при каждом билде.
 * Решает BUG-013: устаревшая дата lastmod в sitemap.xml.
 */
function sitemapPlugin(): Plugin {
  return {
    name: "vite-plugin-sitemap",
    closeBundle() {
      const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
      const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://elenafitmagic.ru/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://elenafitmagic.ru/privacy</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
</urlset>
`;
      const distPath = path.resolve(__dirname, "dist", "sitemap.xml");
      if (fs.existsSync(path.resolve(__dirname, "dist"))) {
        fs.writeFileSync(distPath, sitemap, "utf-8");
        console.log(`✅ sitemap.xml generated with lastmod: ${today}`);
      }
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: "/",
  // "::" на части macOS/Safari даёт ощущение «висит» на 127.0.0.1 — слушаем все интерфейсы явно через Vite.
  server: {
    host: true,
    port: 8080,
    strictPort: true,
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    sitemapPlugin(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Иначе Rollup гоняет gzip по всем чанкам в конце — на большом графе выглядит как «зависло»
    reportCompressedSize: false,
    rollupOptions: {
      output: {
        /**
         * Раньше был объект manualChunks по спискам пакетов — при множестве Radix + общих deps
         * Rollup долго крутит разбиение (у пользователя «transforming…» минутами).
         * Делим только крупные изолированные вендоры по id — дешевле и стабильнее.
         */
        manualChunks(id) {
          if (!id.includes("node_modules")) return;
          if (id.includes("framer-motion")) return "vendor-motion";
          if (id.includes("react-router")) return "vendor-router";
          if (id.includes("@radix-ui")) return "vendor-radix";
          if (id.includes("/react-dom/") || id.includes("react-dom")) return "vendor-react";
          if (id.includes("/react/") && id.includes("node_modules/react")) return "vendor-react";
        },
      },
    },
  },
}));
