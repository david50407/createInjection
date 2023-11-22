import { createRequire } from 'node:module'
import { readFileSync } from 'node:fs'

import type { Plugin, RollupOptions } from 'rollup'
import esbuild from 'rollup-plugin-esbuild'
import dts from 'rollup-plugin-dts'
import { PluginPure as pure } from 'rollup-plugin-pure'

const require = createRequire(import.meta.url)

//#region iife-related
const VUE_DEMI_IIFE = readFileSync(require.resolve('vue-demi/lib/index.iife.js'), 'utf-8')

const iifeName = 'createInjection'

const iifeGlobals = {
	'vue-demi': 'VueDemi',
}

const injectVueDemi: Plugin = {
  name: 'inject-vue-demi',
  renderChunk: (code) => {
    return `${VUE_DEMI_IIFE};\n;${code}`
  },
}
//#endregion iife-related

const minifier: Plugin = {
	name: 'minifier',
	renderChunk: esbuild({ minify: true }).renderChunk,
}

const configs: RollupOptions[] = [{
	input: 'packages/create-injection/src/index.ts',
	output: [{
		file: 'packages/create-injection/dist/index.mjs',
		format: 'es',
	}, {
		file: 'packages/create-injection/dist/index.cjs',
		format: 'cjs',
	}, {
		file: 'packages/create-injection/dist/index.iife.js',
		format: 'iife',
		name: iifeName,
		extend: true,
		globals: iifeGlobals,
		plugins: [
			injectVueDemi,
		],
	}, {
		file: 'packages/create-injection/dist/index.iife.min.js',
		format: 'iife',
		name: iifeName,
		extend: true,
		globals: iifeGlobals,
		plugins: [
			injectVueDemi,
			minifier,
		],
	}],
	plugins: [
		esbuild(),
		pure({
			functions: ['defineComponent'],
		}),
	],
	external: [
		'vue-demi',
	],
}, {
	input: 'packages/create-injection/src/index.ts',
	output: [
		{ file: `packages/create-injection/dist/index.d.cts` },
		{ file: `packages/create-injection/dist/index.d.mts` },
		{ file: `packages/create-injection/dist/index.d.ts` }, // for node10 compatibility
	],
	plugins: [
		dts(),
	],
	external: [
		'vue-demi',
	],
}]

export default configs
