/** @see https://spec.commonmark.org/0.31.2/#fenced-code-blocks */

import { describe, expect, it } from 'vitest';
import { EzalMarkdown } from '../../src';
import { ASTLikeNode, initAstMatcher } from '../ast';

initAstMatcher();

describe('CommonMark: Fenced code blocks', () => {
	it('Example 119', async () => {
		const md = '```\n<\n >\n```';
		const ast: ASTLikeNode = [
			'document',
			[['fenced-codeblock', { code: '<\n >\n', lang: '' }]],
		];
		const html = `<pre><code>&lt;
 &gt;
</code></pre>`;
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 120', async () => {
		const md = '~~~\n<\n >\n~~~';
		const ast: ASTLikeNode = [
			'document',
			[['fenced-codeblock', { code: '<\n >\n', lang: '' }]],
		];
		const html = `<pre><code>&lt;
 &gt;
</code></pre>`;
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 121', async () => {
		const md = '``\nfoo\n``';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', [['#code', { code: 'foo' }]]],
		];
		const html = '<p><code>foo</code></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 122', async () => {
		const md = '```\naaa\n~~~\n```';
		const ast: ASTLikeNode = [
			'document',
			[['fenced-codeblock', { code: 'aaa\n~~~\n', lang: '' }]],
		];
		const html = `<pre><code>aaa
~~~
</code></pre>`;
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 123', async () => {
		const md = '~~~\naaa\n```\n~~~';
		const ast: ASTLikeNode = [
			'document',
			[['fenced-codeblock', { code: 'aaa\n```\n', lang: '' }]],
		];
		const html = '<pre><code>aaa\n```\n</code></pre>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 124', async () => {
		const md = '````\naaa\n```\n``````';
		const ast: ASTLikeNode = [
			'document',
			[['fenced-codeblock', { code: 'aaa\n```\n', lang: '' }]],
		];
		const html = '<pre><code>aaa\n```\n</code></pre>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 125', async () => {
		const md = '~~~~\naaa\n~~~\n~~~~';
		const ast: ASTLikeNode = [
			'document',
			[['fenced-codeblock', { code: 'aaa\n~~~\n', lang: '' }]],
		];
		const html = '<pre><code>aaa\n~~~\n</code></pre>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 126', async () => {
		const md = '```';
		const ast: ASTLikeNode = [
			'document',
			[['fenced-codeblock', { code: '', lang: '' }]],
		];
		const html = '<pre><code></code></pre>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 127', async () => {
		const md = '`````\n```\naaa';
		const ast: ASTLikeNode = [
			'document',
			[['fenced-codeblock', { code: '```\naaa', lang: '' }]],
		];
		const html = '<pre><code>```\naaa</code></pre>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 128', async () => {
		const md = '> ```\n> aaa\n\nbbb\n';
		const ast: ASTLikeNode = [
			'document',
			[
				'blockquote',
				['item', [['fenced-codeblock', { code: 'aaa\n', lang: '' }]]],
			],
			['paragraph', 'bbb'],
		];
		const html =
			'<blockquote><pre><code>aaa\n</code></pre></blockquote><p>bbb</p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 129', async () => {
		const md = '```\n\n  \n```';
		const ast: ASTLikeNode = [
			'document',
			[['fenced-codeblock', { code: '\n  \n', lang: '' }]],
		];
		const html = '<pre><code>\n  \n</code></pre>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 130', async () => {
		const md = '```\n```';
		const ast: ASTLikeNode = [
			'document',
			[['fenced-codeblock', { code: '', lang: '' }]],
		];
		const html = '<pre><code></code></pre>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 131', async () => {
		const md = ' ```\n aaa\naaa\n```';
		const ast: ASTLikeNode = [
			'document',
			[['fenced-codeblock', { code: 'aaa\naaa\n', lang: '' }]],
		];
		const html = '<pre><code>aaa\naaa\n</code></pre>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 132', async () => {
		const md = '  ```\naaa\n  aaa\naaa\n  ```';
		const ast: ASTLikeNode = [
			'document',
			[['fenced-codeblock', { code: 'aaa\naaa\naaa\n', lang: '' }]],
		];
		const html = '<pre><code>aaa\naaa\naaa\n</code></pre>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 133', async () => {
		const md = '   ```\n   aaa\n    aaa\n  aaa\n   ```';
		const ast: ASTLikeNode = [
			'document',
			[['fenced-codeblock', { code: 'aaa\n aaa\naaa\n', lang: '' }]],
		];
		const html = '<pre><code>aaa\n aaa\naaa\n</code></pre>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 134', async () => {
		const md = '    ```\n    aaa\n    ```';
		const ast: ASTLikeNode = [
			'document',
			[['indented-codeblock', { code: '```\naaa\n```' }]],
		];
		const html = '<pre><code>```\naaa\n```</code></pre>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 135', async () => {
		const md = '```\naaa\n  ```';
		const ast: ASTLikeNode = [
			'document',
			[['fenced-codeblock', { code: 'aaa\n', lang: '' }]],
		];
		const html = '<pre><code>aaa\n</code></pre>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 136', async () => {
		const md = '   ```\naaa\n  ```';
		const ast: ASTLikeNode = [
			'document',
			[['fenced-codeblock', { code: 'aaa\n', lang: '' }]],
		];
		const html = '<pre><code>aaa\n</code></pre>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 137', async () => {
		const md = '```\naaa\n    ```';
		const ast: ASTLikeNode = [
			'document',
			[['fenced-codeblock', { code: 'aaa\n    ```', lang: '' }]],
		];
		const html = '<pre><code>aaa\n    ```</code></pre>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 138', async () => {
		const md = '``` ```\naaa';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', ['#code'], ['#softbreak'], 'aaa'],
		];
		const html = '<p><code> </code>\naaa</p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 139', async () => {
		const md = '~~~~~~\naaa\n~~~ ~~';
		const ast: ASTLikeNode = [
			'document',
			[['fenced-codeblock', { code: 'aaa\n~~~ ~~', lang: '' }]],
		];
		const html = '<pre><code>aaa\n~~~ ~~</code></pre>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 140', async () => {
		const md = 'foo\n```\nbar\n```\nbaz';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', 'foo'],
			[['fenced-codeblock', { code: 'bar\n', lang: '' }]],
			['paragraph', 'baz'],
		];
		const html = '<p>foo</p><pre><code>bar\n</code></pre><p>baz</p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 141', async () => {
		const md = 'foo\n---\n~~~\nbar\n~~~\n# baz';
		const ast: ASTLikeNode = [
			'document',
			['setext-heading', ['#item', 'foo']],
			[['fenced-codeblock', { code: 'bar\n', lang: '' }]],
			['atx-heading', ['#item', 'baz']],
		];
		const html =
			'<h2 id="foo">foo</h2><pre><code>bar\n</code></pre><h1 id="baz">baz</h1>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 142', async () => {
		const md = '```ruby\ndef foo(x)\n  return 3\nend\n```';
		const ast: ASTLikeNode = [
			'document',
			[
				[
					'fenced-codeblock',
					{ code: 'def foo(x)\n  return 3\nend\n', lang: 'ruby' },
				],
			],
		];
		const html = '<pre><code>def foo(x)\n  return 3\nend\n</code></pre>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 143', async () => {
		const md =
			'~~~~    ruby startline=3 $%@#$\ndef foo(x)\n  return 3\nend\n~~~~~~~';
		const ast: ASTLikeNode = [
			'document',
			[
				[
					'fenced-codeblock',
					{ code: 'def foo(x)\n  return 3\nend\n', lang: 'ruby' },
				],
				['#item', 'startline=3 $%@#$'],
			],
		];
		const html = '<pre><code>def foo(x)\n  return 3\nend\n</code></pre>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 144', async () => {
		const md = '````;\n````';
		const ast: ASTLikeNode = [
			'document',
			[['fenced-codeblock', { code: '', lang: ';' }]],
		];
		const html = '<pre><code></code></pre>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 145', async () => {
		const md = '``` aa ```\nfoo';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', [['#code', { code: 'aa' }]], ['#softbreak'], 'foo'],
		];
		const html = '<p><code>aa</code>\nfoo</p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 146', async () => {
		const md = '~~~ aa ``` ~~~\nfoo\n~~~';
		const ast: ASTLikeNode = [
			'document',
			[
				['fenced-codeblock', { code: 'foo\n', lang: 'aa' }],
				['#item', '``` ~~~'],
			],
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

	it('Example 147', async () => {
		const md = '```\n``` aaa\n```';
		const ast: ASTLikeNode = [
			'document',
			[['fenced-codeblock', { code: '``` aaa\n', lang: '' }]],
		];
		const html = '<pre><code>``` aaa\n</code></pre>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});
});
