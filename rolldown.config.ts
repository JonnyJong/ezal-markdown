import { defineConfig } from 'rolldown';
import { dts } from 'rolldown-plugin-dts';

export default defineConfig([
	{
		input: 'src/index.ts',
		output: [
			{
				file: 'dist/index.esm.js',
				format: 'esm',
				sourcemap: true,
			},
			{
				file: 'dist/index.js',
				format: 'commonjs',
				sourcemap: true,
			},
		],
		external: (id) => id.startsWith('node:'),
	},
	{
		input: ['src/index.ts'],
		plugins: [dts()],
		external: (id) => id.startsWith('node:'),
	},
]);
