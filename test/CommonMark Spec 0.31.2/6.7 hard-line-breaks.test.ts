/** @see https://spec.commonmark.org/0.31.2/#hard-line-breaks */

import { describe, expect, it } from 'vitest';
import { EzalMarkdown } from '../../src';
import { ASTLikeNode, initAstMatcher } from '../ast';

initAstMatcher();

describe('CommonMark: Hard line breaks', () => {
	it('Example 633', async () => {
		const md = 'foo  \nbaz';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', 'foo', ['#linebreak'], 'baz'],
		];
		const html = '<p>foo<br>baz</p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 634', async () => {
		const md = 'foo\\\nbaz';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', 'foo', ['#linebreak'], 'baz'],
		];
		const html = '<p>foo<br>baz</p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 635', async () => {
		const md = 'foo       \nbaz';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', 'foo', ['#linebreak'], 'baz'],
		];
		const html = '<p>foo<br>baz</p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 636', async () => {
		const md = 'foo  \n     bar';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', 'foo', ['#linebreak'], 'bar'],
		];
		const html = '<p>foo<br>bar</p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 637', async () => {
		const md = 'foo\\\n     bar';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', 'foo', ['#linebreak'], 'bar'],
		];
		const html = '<p>foo<br>bar</p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 638', async () => {
		const md = '*foo  \nbar*';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', ['#emph', 'foo', ['#linebreak'], 'bar']],
		];
		const html = '<p><em>foo<br>bar</em></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 639', async () => {
		const md = '*foo\\\nbar*';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', ['#emph', 'foo', ['#linebreak'], 'bar']],
		];
		const html = '<p><em>foo<br>bar</em></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 640', async () => {
		const md = '`code  \nspan`';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', [['#code', { code: 'code   span' }]]],
		];
		const html = '<p><code>code   span</code></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 641', async () => {
		const md = '`code\\\nspan`';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', [['#code', { code: 'code\\ span' }]]],
		];
		const html = '<p><code>code\\ span</code></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 642', async () => {
		const md = '<a href="foo  \nbar">';
		const ast: ASTLikeNode = ['document', ['html']];
		const html = `<a href="foo  \nbar">`;
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 643', async () => {
		const md = '<a href="foo\\\nbar">';
		const ast: ASTLikeNode = ['document', ['html']];
		const html = `<a href="foo\\
bar">`;
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 644', async () => {
		const md = 'foo\\';
		const ast: ASTLikeNode = ['document', ['paragraph', 'foo\\']];
		const html = '<p>foo\\</p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 645', async () => {
		const md = 'foo  ';
		const ast: ASTLikeNode = ['document', ['paragraph', 'foo']];
		const html = '<p>foo</p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 646', async () => {
		const md = '### foo\\';
		const ast: ASTLikeNode = ['document', ['atx-heading', ['#item', 'foo\\']]];
		const html = '<h3 id="foo">foo\\</h3>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 647', async () => {
		const md = '### foo  ';
		const ast: ASTLikeNode = ['document', ['atx-heading', ['#item', 'foo']]];
		const html = '<h3 id="foo">foo</h3>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});
});
