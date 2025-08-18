/** @see https://spec.commonmark.org/0.31.2/#inlines */

import { describe, expect, it } from 'vitest';
import { EzalMarkdown } from '../../src';
import { ASTLikeNode, initAstMatcher } from '../ast';

initAstMatcher();

describe('CommonMark: Inlines', () => {
	it('Example 327', async () => {
		const md = '`hi`lo`';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', [['#code', { code: 'hi' }]], 'lo`'],
		];
		const html = '<p><code>hi</code>lo`</p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});
});
