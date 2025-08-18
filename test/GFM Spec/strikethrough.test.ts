/** @see https://github.github.com/gfm/#strikethrough-extension- */

import { describe, expect, it } from 'vitest';
import { EzalMarkdown } from '../../src';
import { ASTLikeNode, initAstMatcher } from '../ast';

initAstMatcher();

describe('GFM: Strikethrough', () => {
	it('Example 491', async () => {
		const md = '~~Hi~~ Hello, ~there~ world!';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', ['#del', 'Hi'], ' Hello, ', ['#del', 'there'], ' world!'],
		];
		const html = '<p><del>Hi</del> Hello, <del>there</del> world!</p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 492', async () => {
		const md = `This ~~has a

new paragraph~~.`;
		const ast: ASTLikeNode = [
			'document',
			['paragraph', 'This ~~has a'],
			['paragraph', 'new paragraph~~.'],
		];
		const html = '<p>This ~~has a</p><p>new paragraph~~.</p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 493', async () => {
		const md = 'This will ~~~not~~~ strike.';
		const ast: ASTLikeNode = ['document', ['paragraph', md]];
		const html = '<p>This will ~~~not~~~ strike.</p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});
});
