import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import vercel from '@astrojs/vercel/serverless';

export default defineConfig({
  integrations: [
    tailwind({ applyBaseStyles: false }),
    mdx(),
  ],
  output: 'hybrid',
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
