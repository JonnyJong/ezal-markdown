/** @see https://spec.commonmark.org/0.31.2/#tabs */

import { describe, expect, it } from 'vitest';
import { EzalMarkdown } from '../../src';
import { ASTLikeNode, initAstMatcher } from '../ast';

initAstMatcher();

describe('CommonMark: Tabs', () => {
	it('Example 1', async () => {
		const md = '\tfoo\tbaz\t\tbim';
		const ast: ASTLikeNode = [
			'document',
			[['indented-codeblock', { code: 'foo\tbaz\t\tbim' }]],
		];
		const html = '<pre><code>foo	baz		bim</code></pre>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 2', async () => {
		const md = '  \tfoo\tbaz\t\tbim';
		const ast: ASTLikeNode = [
			'document',
			[['indented-codeblock', { code: 'foo\tbaz\t\tbim' }]],
		];
		const html = '<pre><code>foo\tbaz\t\tbim</code></pre>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 3', async () => {
		const md = '    a\ta\n    ὐ\ta';
		const ast: ASTLikeNode = [
			'document',
			[['indented-codeblock', { code: 'a\ta\nὐ\ta' }]],
		];
		const html = '<pre><code>a\ta\nὐ\ta</code></pre>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 4', async () => {
		const md = '  - foo\n\n\tbar';
		const ast: ASTLikeNode = [
			'document',
			['list', ['item', ['paragraph', 'foo'], ['paragraph', 'bar']]],
		];
		const html = '<ul><li><p>foo</p><p>bar</p></li></ul>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 5', async () => {
		const md = '- foo\n\n\t\tbar';
		const ast: ASTLikeNode = [
			'document',
			[
				'list',
				['item', ['paragraph', 'foo'], [['indented-codeblock', { code: '  bar' }]]],
			],
		];
		const html = '<ul><li><p>foo</p><pre><code>  bar</code></pre></li></ul>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it.todo('Example 6', async () => {
		const md = '>\t\tfoo';
		const ast: ASTLikeNode = [
			'document',
			['blockquote', ['item', [['indented-codeblock', { raw: '  foo' }]]]],
		];
		const html = '<blockquote><pre><code>  foo</code></pre></blockquote>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it.todo('Example 7', async () => {
		const md = '-\t\tfoo';
		const ast: ASTLikeNode = [
			'document',
			['list', ['item', [['indented-codeblock', { raw: '  foo' }]]]],
		];
		const html = '<ul><li><pre><code>  foo</code></pre></li></ul>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 8', async () => {
		const md = '    foo\n\tbar';
		const ast: ASTLikeNode = [
			'document',
			[['indented-codeblock', { code: 'foo\nbar' }]],
		];
		const html = '<pre><code>foo\nbar</code></pre>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 9', async () => {
		const md = ' - foo\n   - bar\n\t - baz';
		const ast: ASTLikeNode = [
			'document',
			[
				'list',
				['item', 'foo', ['list', ['item', 'bar', ['list', ['item', 'baz']]]]],
			],
		];
		const html =
			'<ul><li>foo<ul><li>bar<ul><li>baz</li></ul></li></ul></li></ul>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 10', async () => {
		const md = '#\tFoo';
		const ast: ASTLikeNode = ['document', ['atx-heading', ['#item', 'Foo']]];
		const html = '<h1 id="foo">Foo</h1>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 11', async () => {
		const md = '*\t*\t*\t';
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
});
