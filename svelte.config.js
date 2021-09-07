import adapter from '@sveltejs/adapter-static'
import preprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: preprocess(
		{
			scss:'node-sass'
		}
	),
	
	kit: {
		// svelte adapter-static:
		adapter: adapter(
			{ pages:'docs'
			, assets:'docs'
			, fallback: null
		})
		, appDir: 'internal'
		// hydrate the <div id="svelte"> element in src/app.html
		, ssr: false
		, target: '#svelte'
	}
};

export default config;
