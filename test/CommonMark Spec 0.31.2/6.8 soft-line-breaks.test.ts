/** @see https://spec.commonmark.org/0.31.2/#soft-line-breaks */

import { describe, expect, it } from 'vitest';
import { EzalMarkdown } from '../../src';
import { ASTLikeNode, initAstMatcher } from '../ast';

initAstMatcher();

describe('CommonMark: Soft line breaks', () => {
	it('Example 648', async () => {
		const md = 'foo\nbaz';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', 'foo', ['#softbreak'], 'baz'],
		];
		const html = `<p>foo
baz</p>`;
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 649', async () => {
		const md = 'foo \n baz';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', 'foo', ['#softbreak'], 'baz'],
		];
		const html = `<p>foo
baz</p>`;
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});
});
