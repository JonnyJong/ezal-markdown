/** @see https://spec.commonmark.org/0.31.2/#atx-headings */

import { describe, expect, it } from 'vitest';
import { EzalMarkdown } from '../../src';
import { ASTLikeNode, initAstMatcher } from '../ast';

initAstMatcher();

describe('Plugin: line-break', () => {
	it('targetResolver', async () => {
		const md = 'foo\nbar';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', 'foo', ['#softbreak'], 'bar'],
		];
		const html1 = '<p>foo\nbar</p>';
		const html2 = '<p>foo<br>bar</p>';
		const renderer = new EzalMarkdown();
		const result1 = await renderer.parse(md, { lineBreak: 'common-mark' });
		expect(result1.document).toLikeAst(ast);
		const rendered1 = await renderer.renderHTML(
			result1.document,
			result1.options,
		);
		expect(rendered1.html).toBe(html1);
		const result2 = await renderer.parse(md, { lineBreak: 'soft' });
		expect(result2.document).toLikeAst(ast);
		const rendered2 = await renderer.renderHTML(
			result2.document,
			result2.options,
		);
		expect(rendered2.html).toBe(html2);
	});
});
