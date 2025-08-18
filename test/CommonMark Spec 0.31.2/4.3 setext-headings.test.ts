/** @see https://spec.commonmark.org/0.31.2/#setext-headings */

import { describe, expect, it } from 'vitest';
import { EzalMarkdown } from '../../src';
import { ASTLikeNode, initAstMatcher } from '../ast';

initAstMatcher();

describe('CommonMark: Setext headings', () => {
	it('Example 80', async () => {
		const md = 'Foo *bar*\n=========\n\nFoo *bar*\n---------';
		const ast: ASTLikeNode = [
			'document',
			[
				['setext-heading', { level: 1 }],
				['#item', 'Foo ', ['#emph', 'bar']],
			],
			[
				['setext-heading', { level: 2 }],
				['#item', 'Foo ', ['#emph', 'bar']],
			],
		];
		const html =
			'<h1 id="foo-bar">Foo <em>bar</em></h1><h2 id="foo-bar-1">Foo <em>bar</em></h2>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 81', async () => {
		const md = 'Foo *bar\nbaz*\n====';
		const ast: ASTLikeNode = [
			'document',
			[
				['setext-heading', { level: 1 }],
				['#item', 'Foo ', ['#emph', 'bar', ['#softbreak'], 'baz']],
			],
		];
		const html = '<h1 id="foo-bar-baz">Foo <em>bar\nbaz</em></h1>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 82', async () => {
		const md = '  Foo *bar\nbaz*\t\n====';
		const ast: ASTLikeNode = [
			'document',
			[
				['setext-heading', { level: 1 }],
				['#item', 'Foo ', ['#emph', 'bar', ['#softbreak'], 'baz']],
			],
		];
		const html = '<h1 id="foo-bar-baz">Foo <em>bar\nbaz</em></h1>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 83', async () => {
		const md = 'Foo\n-------------------------\n\nFoo\n=';
		const ast: ASTLikeNode = [
			'document',
			[
				['setext-heading', { level: 2 }],
				['#item', 'Foo'],
			],
			[
				['setext-heading', { level: 1 }],
				['#item', 'Foo'],
			],
		];
		const html = '<h2 id="foo">Foo</h2><h1 id="foo-1">Foo</h1>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 84', async () => {
		const md = '   Foo\n---\n\n  Foo\n-----\n\n  Foo\n  ===';
		const ast: ASTLikeNode = [
			'document',
			[
				['setext-heading', { level: 2 }],
				['#item', 'Foo'],
			],
			[
				['setext-heading', { level: 2 }],
				['#item', 'Foo'],
			],
			[
				['setext-heading', { level: 1 }],
				['#item', 'Foo'],
			],
		];
		const html =
			'<h2 id="foo">Foo</h2><h2 id="foo-1">Foo</h2><h1 id="foo-2">Foo</h1>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 85', async () => {
		const md = '    Foo\n    ---\n\n    Foo\n---';
		const ast: ASTLikeNode = [
			'document',
			['indented-codeblock'],
			['thematic-break'],
		];
		const html = '<pre><code>Foo\n---\n\nFoo\n</code></pre><hr>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 86', async () => {
		const md = 'Foo\n   ----      ';
		const ast: ASTLikeNode = [
			'document',
			[
				['setext-heading', { level: 2 }],
				['#item', 'Foo'],
			],
		];
		const html = '<h2 id="foo">Foo</h2>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 87', async () => {
		const md = 'Foo\n    ---';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', 'Foo', ['#softbreak'], '---'],
		];
		const html = '<p>Foo\n---</p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 88', async () => {
		const md = 'Foo\n= =\n\nFoo\n--- -';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', 'Foo', ['#softbreak'], '= ='],
			['paragraph', 'Foo'],
			['thematic-break'],
		];
		const html = '<p>Foo\n= =</p><p>Foo</p><hr>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 89', async () => {
		const md = 'Foo  \n-----';
		const ast: ASTLikeNode = [
			'document',
			[
				['setext-heading', { level: 2 }],
				['#item', 'Foo'],
			],
		];
		const html = '<h2 id="foo">Foo</h2>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 90', async () => {
		const md = 'Foo\\\n----';
		const ast: ASTLikeNode = [
			'document',
			[
				['setext-heading', { level: 2 }],
				['#item', 'Foo\\'],
			],
		];
		const html = '<h2 id="foo">Foo\\</h2>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 91', async () => {
		const md = '`Foo\n----\n`\n\n<a title="a lot\n---\nof dashes"/>';
		const ast: ASTLikeNode = [
			'document',
			[
				['setext-heading', { level: 2 }],
				['#item', '`Foo'],
			],
			['paragraph', '`'],
			[
				['setext-heading', { level: 2 }],
				['#item', '<a title="a lot'],
			],
			['paragraph', 'of dashes"/>'],
		];
		const html =
			'<h2 id="foo">`Foo</h2><p>`</p><h2 id="a-titlea-lot">&lt;a title=&quot;a lot</h2><p>of dashes&quot;/&gt;</p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 92', async () => {
		const md = '> Foo\n---';
		const ast: ASTLikeNode = [
			'document',
			['blockquote', ['item', ['paragraph', 'Foo']]],
			['thematic-break'],
		];
		const html = '<blockquote><p>Foo</p></blockquote><hr>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 93', async () => {
		const md = '> foo\nbar\n===';
		const ast: ASTLikeNode = [
			'document',
			['blockquote', ['item', ['paragraph', 'foo']]],
			[
				['setext-heading', { level: 1 }],
				['#item', 'bar'],
			],
		];
		const html = '<blockquote><p>foo</p></blockquote><h1 id="bar">bar</h1>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 94', async () => {
		const md = '- Foo\n---';
		const ast: ASTLikeNode = [
			'document',
			['list', ['item', 'Foo']],
			['thematic-break'],
		];
		const html = '<ul><li>Foo</li></ul><hr>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 95', async () => {
		const md = 'Foo\nBar\n---';
		const ast: ASTLikeNode = [
			'document',
			[
				['setext-heading', { level: 2 }],
				['#item', 'Foo', ['#softbreak'], 'Bar'],
			],
		];
		const html = '<h2 id="foo-bar">Foo\nBar</h2>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 96', async () => {
		const md = '---\nFoo\n---\nBar\n---\nBaz';
		const ast: ASTLikeNode = [
			'document',
			['thematic-break'],
			[
				['setext-heading', { level: 2 }],
				['#item', 'Foo'],
			],
			[
				['setext-heading', { level: 2 }],
				['#item', 'Bar'],
			],
			['paragraph', 'Baz'],
		];
		const html = '<hr><h2 id="foo">Foo</h2><h2 id="bar">Bar</h2><p>Baz</p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 97', async () => {
		const md = '\n====';
		const ast: ASTLikeNode = ['document', ['paragraph', '====']];
		const html = '<p>====</p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 98', async () => {
		const md = '---\n---';
		const ast: ASTLikeNode = ['document', ['thematic-break'], ['thematic-break']];
		const html = '<hr><hr>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 99', async () => {
		const md = '- foo\n-----';
		const ast: ASTLikeNode = [
			'document',
			['list', ['item', 'foo']],
			['thematic-break'],
		];
		const html = '<ul><li>foo</li></ul><hr>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 100', async () => {
		const md = '    foo\n---';
		const ast: ASTLikeNode = [
			'document',
			['indented-codeblock'],
			['thematic-break'],
		];
		const html = '<pre><code>foo\n</code></pre><hr>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 101', async () => {
		const md = '> foo\n-----';
		const ast: ASTLikeNode = [
			'document',
			['blockquote', ['item', ['paragraph', 'foo']]],
			['thematic-break'],
		];
		const html = '<blockquote><p>foo</p></blockquote><hr>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 102', async () => {
		const md = '\\> foo\n------';
		const ast: ASTLikeNode = [
			'document',
			[
				['setext-heading', { level: 2 }],
				['#item', ['#escape'], ' foo'],
			],
		];
		const html = '<h2 id="foo">&gt; foo</h2>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 103', async () => {
		const md = 'Foo\n\nbar\n---\nbaz';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', 'Foo'],
			[
				['setext-heading', { level: 2 }],
				['#item', 'bar'],
			],
			['paragraph', 'baz'],
		];
		const html = '<p>Foo</p><h2 id="bar">bar</h2><p>baz</p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 104', async () => {
		const md = 'Foo\nbar\n\n---\n\nbaz';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', 'Foo', ['#softbreak'], 'bar'],
			['thematic-break'],
			['paragraph', 'baz'],
		];
		const html = '<p>Foo\nbar</p><hr><p>baz</p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 105', async () => {
		const md = 'Foo\nbar\n* * *\nbaz';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', 'Foo', ['#softbreak'], 'bar'],
			['thematic-break'],
			['paragraph', 'baz'],
		];
		const html = '<p>Foo\nbar</p><hr><p>baz</p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 106', async () => {
		const md = 'Foo\nbar\n\\---\nbaz';
		const ast: ASTLikeNode = [
			'document',
			[
				'paragraph',
				'Foo',
				['#softbreak'],
				'bar',
				['#softbreak'],
				['#escape'],
				'--',
				['#softbreak'],
				'baz',
			],
		];
		const html = `<p>Foo
bar
---
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
