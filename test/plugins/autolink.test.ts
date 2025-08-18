/** @see https://spec.commonmark.org/0.31.2/#atx-headings */

import { describe, expect, it } from 'vitest';
import { EzalMarkdown } from '../../src';
import { autolink } from '../../src/plugins/autolink';
import { ASTLikeNode, initAstMatcher } from '../ast';

initAstMatcher();

describe('Plugin: autolink', () => {
	it('targetResolver', async () => {
		const md = '<https://example.com>\n<https://jonnys.top>';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', ['#autolink'], ['#softbreak'], ['#autolink']],
		];
		const html = `<p><a href="https://example.com" target="_blank">https://example.com</a>\n<a href="https://jonnys.top" target="_self">https://jonnys.top</a></p>`;
		const renderer = new EzalMarkdown();
		renderer.set(
			autolink((link) => (link === 'https://jonnys.top' ? 'self' : 'blank')),
		);
		const result = await renderer.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await renderer.renderHTML(result.document, result.options);
		expect(rendered.html).toBe(html);
	});
});
