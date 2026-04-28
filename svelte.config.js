import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	compilerOptions: {
		runes: ({ filename }) => (filename.split(/[/\\]/).includes('node_modules') ? undefined : true)
	},
	kit: {
		adapter: adapter(),
		alias: {
			$components: 'src/lib/components',
			$utils: 'src/lib/utils',
			$types: 'src/lib/types',
			$stores: 'src/lib/stores',
			$server: 'src/lib/server'
		}
	}
};

export default config;
