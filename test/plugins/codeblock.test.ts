/** @see https://spec.commonmark.org/0.31.2/#atx-headings */

import { describe, expect, it } from 'vitest';
import { EzalMarkdown } from '../../src';
import { codeblock } from '../../src/plugins/codeblock';
import { escapeHTML } from '../../src/utils';
import { ASTLikeNode, initAstMatcher } from '../ast';

initAstMatcher();

describe('Plugin: codeblock', () => {
	it('highlighter', async () => {
		const md =
			'    indented codeblock\n\n```ts\nconsole.log(`fenced codeblock`);\n```';
		const ast: ASTLikeNode = [
			'document',
			[['indented-codeblock', {}]],
			[['fenced-codeblock', {}]],
		];
		const html = `<pre><code>indented codeblock
</code></pre><pre><code class="lang-ts">console.log(\`fenced codeblock\`);
</code></pre>`;
		const renderer = new EzalMarkdown();
		renderer.set(
			codeblock((code, lang) => [
				escapeHTML(code),
				lang ? `lang-${lang}` : undefined,
			]),
		);
		const result = await renderer.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await renderer.renderHTML(result.document, result.options);
		expect(rendered.html).toBe(html);
	});
});
