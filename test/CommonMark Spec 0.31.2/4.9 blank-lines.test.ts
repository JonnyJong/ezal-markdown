/** @see https://spec.commonmark.org/0.31.2/#blank-lines */

import { describe, expect, it } from 'vitest';
import { EzalMarkdown } from '../../src';
import { ASTLikeNode, initAstMatcher } from '../ast';

initAstMatcher();

describe('CommonMark: Blank lines', () => {
	it('Example 227', async () => {
		const md = '  \n\naaa\n  \n\n# aaa\n\n  ';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', 'aaa'],
			['atx-heading', ['#item', 'aaa']],
		];
		const html = '<p>aaa</p><h1 id="aaa">aaa</h1>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});
});
