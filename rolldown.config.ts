import { spawn } from 'node:child_process';
import path, { isAbsolute } from 'node:path';
import { defineConfig } from 'rolldown';

const TSC_ROOT = path.join(
	import.meta.dirname,
	'node_modules/typescript/lib/tsc.js',
);

export default defineConfig({
	input: 'src/index.ts',
	output: [
		{
			dir: 'dist',
			entryFileNames: 'index.esm.js',
			format: 'esm',
			sourcemap: true,
			cleanDir: true,
		},
		{
			dir: 'dist',
			entryFileNames: 'index.js',
			format: 'cjs',
			sourcemap: true,
		},
	],
	external: (id) => !isAbsolute(id) && id[0] !== '.',
	plugins: [
		{
			name: 'tsc-after',
			writeBundle() {
				return new Promise((resolve, reject) => {
					const args = [TSC_ROOT, '-p', './tsconfig.json'];
					const ps = spawn('node', args, { stdio: 'inherit', shell: false });
					ps.on('close', (code) => {
						if (code === 0) resolve();
						else reject(new Error(`tsc exited with code ${code}`));
					});
					ps.on('error', reject);
				});
			},
		},
	],
});
