/** @see https://spec.commonmark.org/0.31.2/#thematic-breaks */

import { describe, expect, it } from 'vitest';
import { EzalMarkdown } from '../../src';
import { ASTLikeNode, initAstMatcher } from '../ast';

initAstMatcher();

describe('CommonMark: Thematic breaks', () => {
	it('Example 43', async () => {
		const md = '***\n---\n___';
		const ast: ASTLikeNode = [
			'document',
			['thematic-break'],
			['thematic-break'],
			['thematic-break'],
		];
		const html = '<hr><hr><hr>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 44', async () => {
		const md = '+++';
		const ast: ASTLikeNode = ['document', ['paragraph', '+++']];
		const html = '<p>+++</p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 45', async () => {
		const md = '===';
		const ast: ASTLikeNode = ['document', ['paragraph', '===']];
		const html = '<p>===</p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 46', async () => {
		const md = '--\n**\n__';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', '--', ['#softbreak'], '**', ['#softbreak'], '__'],
		];
		const html = '<p>--\n**\n__</p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 47', async () => {
		const md = ' ***\n  ***\n   ***';
		const ast: ASTLikeNode = [
			'document',
			['thematic-break'],
			['thematic-break'],
			['thematic-break'],
		];
		const html = '<hr><hr><hr>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 48', async () => {
		const md = '    ***';
		const ast: ASTLikeNode = ['document', ['indented-codeblock']];
		const html = '<pre><code>***</code></pre>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 49', async () => {
		const md = 'Foo\n    ***';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', 'Foo', ['#softbreak'], '***'],
		];
		const html = '<p>Foo\n***</p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 50', async () => {
		const md = '_____________________________________';
		const ast: ASTLikeNode = ['document', ['thematic-break']];
		const html = '<hr>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 51', async () => {
		const md = ' - - -';
		const ast: ASTLikeNode = ['document', ['thematic-break']];
		const html = '<hr>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 52', async () => {
		const md = ' **  * ** * ** * **';
		const ast: ASTLikeNode = ['document', ['thematic-break']];
		const html = '<hr>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 53', async () => {
		const md = '-     -      -      -';
		const ast: ASTLikeNode = ['document', ['thematic-break']];
		const html = '<hr>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 54', async () => {
		const md = '- - - -    ';
		const ast: ASTLikeNode = ['document', ['thematic-break']];
		const html = '<hr>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 55', async () => {
		const md = '_ _ _ _ a\n\na------\n\n---a---';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', '_ _ _ _ a'],
			['paragraph', 'a------'],
			['paragraph', '---a---'],
		];
		const html = '<p>_ _ _ _ a</p><p>a------</p><p>---a---</p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 56', async () => {
		const md = ' *-*';
		const ast: ASTLikeNode = ['document', ['paragraph', ['#emph', '-']]];
		const html = '<p><em>-</em></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 57', async () => {
		const md = '- foo\n***\n- bar';
		const ast: ASTLikeNode = [
			'document',
			['list', ['item', 'foo']],
			['thematic-break'],
			['list', ['item', 'bar']],
		];
		const html = '<ul><li>foo</li></ul><hr><ul><li>bar</li></ul>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 58', async () => {
		const md = 'Foo\n***\nbar';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', 'Foo'],
			['thematic-break'],
			['paragraph', 'bar'],
		];
		const html = '<p>Foo</p><hr><p>bar</p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 59', async () => {
		const md = '* Foo\n* * *\n* Bar';
		const ast: ASTLikeNode = [
			'document',
			['list', ['item', 'Foo']],
			['thematic-break'],
			['list', ['item', 'Bar']],
		];
		const html = '<ul><li>Foo</li></ul><hr><ul><li>Bar</li></ul>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 60', async () => {
		const md = '- Foo\n- * * *';
		const ast: ASTLikeNode = [
			'document',
			['list', ['item', 'Foo'], ['item', ['thematic-break']]],
		];
		const html = '<ul><li>Foo</li><li><hr></li></ul>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});
});
