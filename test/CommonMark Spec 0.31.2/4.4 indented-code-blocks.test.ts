/** @see https://spec.commonmark.org/0.31.2/#indented-code-blocks */

import { describe, expect, it } from 'vitest';
import { EzalMarkdown } from '../../src';
import { ASTLikeNode, initAstMatcher } from '../ast';

initAstMatcher();

describe('CommonMark: Indented code blocks', () => {
	it('Example 107', async () => {
		const md = '    a simple\n      indented code block';
		const ast: ASTLikeNode = [
			'document',
			[['indented-codeblock', { code: 'a simple\n  indented code block' }]],
		];
		const html = '<pre><code>a simple\n  indented code block</code></pre>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 108', async () => {
		const md = '  - foo\n\n    bar';
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

	it('Example 109', async () => {
		const md = '1.  foo\n\n    - bar';
		const ast: ASTLikeNode = [
			'document',
			['list', ['item', ['paragraph', 'foo'], ['list', ['item', 'bar']]]],
		];
		const html = '<ol start="1"><li><p>foo</p><ul><li>bar</li></ul></li></ol>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 110', async () => {
		const md = '    <a/>\n    *hi*\n\n    - one';
		const ast: ASTLikeNode = [
			'document',
			[['indented-codeblock', { code: '<a/>\n*hi*\n\n- one' }]],
		];
		const html = `<pre><code>&lt;a/&gt;
*hi*

- one</code></pre>`;
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 111', async () => {
		const md = '    chunk1\n\n    chunk2\n  \n \n \n    chunk3';
		const ast: ASTLikeNode = [
			'document',
			[['indented-codeblock', { code: 'chunk1\n\nchunk2\n\n\n\nchunk3' }]],
		];
		const html = `<pre><code>chunk1

chunk2



chunk3</code></pre>`;
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 112', async () => {
		const md = '    chunk1\n      \n      chunk2';
		const ast: ASTLikeNode = [
			'document',
			[['indented-codeblock', { code: 'chunk1\n  \n  chunk2' }]],
		];
		const html = '<pre><code>chunk1\n  \n  chunk2</code></pre>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 113', async () => {
		const md = 'Foo\n    bar';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', 'Foo', ['#softbreak'], 'bar'],
		];
		const html = '<p>Foo\nbar</p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 114', async () => {
		const md = '    foo\nbar';
		const ast: ASTLikeNode = [
			'document',
			[['indented-codeblock', { code: 'foo\n' }]],
			['paragraph', 'bar'],
		];
		const html = '<pre><code>foo\n</code></pre><p>bar</p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 115', async () => {
		const md = '# Heading\n    foo\nHeading\n------\n    foo\n----';
		const ast: ASTLikeNode = [
			'document',
			['atx-heading', ['#item', 'Heading']],
			[['indented-codeblock', { code: 'foo\n' }]],
			['setext-heading', ['#item', 'Heading']],
			[['indented-codeblock', { code: 'foo\n' }]],
			['thematic-break'],
		];
		const html = `<h1 id="heading">Heading</h1><pre><code>foo
</code></pre><h2 id="heading-1">Heading</h2><pre><code>foo
</code></pre><hr>`;
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 116', async () => {
		const md = '        foo\n    bar';
		const ast: ASTLikeNode = [
			'document',
			[['indented-codeblock', { code: '    foo\nbar' }]],
		];
		const html = '<pre><code>    foo\nbar</code></pre>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 117', async () => {
		const md = '\n    \n    foo\n    \n';
		const ast: ASTLikeNode = [
			'document',
			[['indented-codeblock', { code: 'foo\n' }]],
		];
		const html = '<pre><code>foo\n</code></pre>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 118', async () => {
		const md = '    foo  ';
		const ast: ASTLikeNode = [
			'document',
			[['indented-codeblock', { code: 'foo  ' }]],
		];
		const html = '<pre><code>foo  </code></pre>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});
});
