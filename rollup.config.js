import { defineConfig } from 'rollup';
import { dts } from 'rollup-plugin-dts';
import ts from '@rollup/plugin-typescript';

function external(id) {
	return id.startsWith('node:') || ['yaml', 'entities'].includes(id);
}

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
				format: 'cjs',
				sourcemap: true,
			},
		],
		plugins: [ts(), dts()],
		external,
	},
	{
		input: 'src/types.d.ts',
		output: {
			file: 'dist/types.d.ts',
		},
		plugins: [dts()],
		external,
	},
]);
