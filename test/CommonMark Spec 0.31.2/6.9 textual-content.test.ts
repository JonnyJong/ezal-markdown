/** @see https://spec.commonmark.org/0.31.2/#textual-content */

import { describe, expect, it } from 'vitest';
import { EzalMarkdown } from '../../src';
import { ASTLikeNode, initAstMatcher } from '../ast';

initAstMatcher();

describe('CommonMark: Textual content', () => {
	it('Example 650', async () => {
		const md = `hello $.;'there`;
		const ast: ASTLikeNode = ['document', ['paragraph', "hello $.;'there"]];
		const html = '<p>hello $.;&#39;there</p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 651', async () => {
		const md = 'Foo χρῆν';
		const ast: ASTLikeNode = ['document', ['paragraph', 'Foo χρῆν']];
		const html = '<p>Foo χρῆν</p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 652', async () => {
		const md = 'Multiple     spaces';
		const ast: ASTLikeNode = ['document', ['paragraph', 'Multiple     spaces']];
		const html = '<p>Multiple     spaces</p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});
});
