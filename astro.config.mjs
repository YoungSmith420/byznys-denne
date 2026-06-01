import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import vercel from '@astrojs/vercel';

export default defineConfig({
  integrations: [
    tailwind({ applyBaseStyles: false }),
    mdx(),
  ],
  output: 'static',
  adapter: vercel(),
  site: 'https://byznysdenne.cz',
  vite: {
    server: {
      watch: {
        // Ignoruj dočasné soubory editorů a Claude Code — zamezí ENOENT chybám
        ignored: ['**/*.tmp', '**/*.bak', '**/*~', '**/.#*'],
      },
    },
  },
});
