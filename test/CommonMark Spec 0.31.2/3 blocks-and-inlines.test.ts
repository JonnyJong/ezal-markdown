/** @see https://spec.commonmark.org/0.31.2/#blocks-and-inlines */

import { describe, expect, it } from 'vitest';
import { EzalMarkdown } from '../../src';
import { ASTLikeNode, initAstMatcher } from '../ast';

initAstMatcher();

describe('CommonMark: Blocks and inlines', () => {
	it('Example 42', async () => {
		const md = '- `one\n- two`';
		const ast: ASTLikeNode = [
			'document',
			['list', ['item', '`one'], ['item', 'two`']],
		];
		const html = '<ul><li>`one</li><li>two`</li></ul>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});
});
