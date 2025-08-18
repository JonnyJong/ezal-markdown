/** @see https://spec.commonmark.org/0.31.2/#list-items */

import { describe, expect, it } from 'vitest';
import { EzalMarkdown } from '../../src';
import { ASTLikeNode, initAstMatcher } from '../ast';

initAstMatcher();

describe('CommonMark: List items', () => {
	it('Example 253', async () => {
		const md =
			'A paragraph\nwith two lines.\n\n    indented code\n\n> A block quote.';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', 'A paragraph', ['#softbreak'], 'with two lines.'],
			['indented-codeblock'],
			['blockquote', ['item', ['paragraph', 'A block quote.']]],
		];
		const html = `<p>A paragraph
with two lines.</p><pre><code>indented code
</code></pre><blockquote><p>A block quote.</p></blockquote>`;
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 254', async () => {
		const md =
			'1.  A paragraph\n    with two lines.\n\n        indented code\n\n    > A block quote.';
		const ast: ASTLikeNode = [
			'document',
			[
				['list', { start: 1 }],
				[
					'item',
					['paragraph', 'A paragraph', ['#softbreak'], 'with two lines.'],
					['indented-codeblock'],
					['blockquote', ['item', ['paragraph', 'A block quote.']]],
				],
			],
		];
		const html = `<ol start="1"><li><p>A paragraph
with two lines.</p><pre><code>indented code
</code></pre><blockquote><p>A block quote.</p></blockquote></li></ol>`;
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 255', async () => {
		const md = '- one\n\n two';
		const ast: ASTLikeNode = [
			'document',
			['list', ['item', 'one']],
			['paragraph', 'two'],
		];
		const html = '<ul><li>one</li></ul><p>two</p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 256', async () => {
		const md = '- one\n  two';
		const ast: ASTLikeNode = [
			'document',
			['list', ['item', 'one', ['#softbreak'], 'two']],
		];
		const html = `<ul><li>one
two</li></ul>`;
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 257', async () => {
		const md = ' -    one\n\n     two';
		const ast: ASTLikeNode = [
			'document',
			['list', ['item', 'one']],
			['indented-codeblock'],
		];
		const html = '<ul><li>one</li></ul><pre><code> two</code></pre>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 258', async () => {
		const md = ' -    one\n\n      two';
		const ast: ASTLikeNode = [
			'document',
			['list', ['item', ['paragraph', 'one'], ['paragraph', 'two']]],
		];
		const html = '<ul><li><p>one</p><p>two</p></li></ul>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 259', async () => {
		const md = '   > > 1.  one\n>>\n>>     two';
		const ast: ASTLikeNode = [
			'document',
			[
				'blockquote',
				[
					'item',
					[
						'blockquote',
						['item', ['list', ['item', ['paragraph', 'one'], ['paragraph', 'two']]]],
					],
				],
			],
		];
		const html =
			'<blockquote><blockquote><ol start="1"><li><p>one</p><p>two</p></li></ol></blockquote></blockquote>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 260', async () => {
		const md = '>>- one\n>>\n  >  > two';
		const ast: ASTLikeNode = [
			'document',
			[
				'blockquote',
				[
					'item',
					['blockquote', ['item', ['list', ['item', 'one']], ['paragraph', 'two']]],
				],
			],
		];
		const html =
			'<blockquote><blockquote><ul><li>one</li></ul><p>two</p></blockquote></blockquote>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 261', async () => {
		const md = '-one\n\n2.two';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', '-one'],
			['paragraph', '2.two'],
		];
		const html = '<p>-one</p><p>2.two</p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 262', async () => {
		const md = '- foo\n\n\n  bar';
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

	it('Example 263', async () => {
		const md = '1.  foo\n\n    ```\n    bar\n    ```\n\n    baz\n\n    > bam';
		const ast: ASTLikeNode = [
			'document',
			[
				'list',
				[
					'item',
					['paragraph', 'foo'],
					['fenced-codeblock'],
					['paragraph', 'baz'],
					['blockquote', ['item', ['paragraph', 'bam']]],
				],
			],
		];
		const html = `<ol start="1"><li><p>foo</p><pre><code>bar
</code></pre><p>baz</p><blockquote><p>bam</p></blockquote></li></ol>`;
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 264', async () => {
		const md = '- Foo\n\n      bar\n\n\n      baz';
		const ast: ASTLikeNode = [
			'document',
			['list', ['item', ['paragraph', 'Foo'], ['indented-codeblock']]],
		];
		const html = `<ul><li><p>Foo</p><pre><code>bar


baz</code></pre></li></ul>`;
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 265', async () => {
		const md = '123456789. ok';
		const ast: ASTLikeNode = [
			'document',
			[
				['list', { start: 123456789 }],
				['item', 'ok'],
			],
		];
		const html = '<ol start="123456789"><li>ok</li></ol>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 266', async () => {
		const md = '1234567890. not ok';
		const ast: ASTLikeNode = ['document', ['paragraph', '1234567890. not ok']];
		const html = '<p>1234567890. not ok</p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 267', async () => {
		const md = '0. ok';
		const ast: ASTLikeNode = [
			'document',
			[
				['list', { start: 0 }],
				['item', 'ok'],
			],
		];
		const html = '<ol><li>ok</li></ol>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 268', async () => {
		const md = '003. ok';
		const ast: ASTLikeNode = [
			'document',
			[
				['list', { start: 3 }],
				['item', 'ok'],
			],
		];
		const html = '<ol start="3"><li>ok</li></ol>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 269', async () => {
		const md = '-1. not ok';
		const ast: ASTLikeNode = ['document', ['paragraph', '-1. not ok']];
		const html = '<p>-1. not ok</p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 270', async () => {
		const md = '- foo\n\n      bar';
		const ast: ASTLikeNode = [
			'document',
			['list', ['item', ['paragraph', 'foo'], ['indented-codeblock']]],
		];
		const html = '<ul><li><p>foo</p><pre><code>bar</code></pre></li></ul>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 271', async () => {
		const md = '  10.  foo\n\n           bar';
		const ast: ASTLikeNode = [
			'document',
			['list', ['item', ['paragraph', 'foo'], ['indented-codeblock']]],
		];
		const html =
			'<ol start="10"><li><p>foo</p><pre><code>bar</code></pre></li></ol>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 272', async () => {
		const md = '    indented code\n\nparagraph\n\n    more code';
		const ast: ASTLikeNode = [
			'document',
			['indented-codeblock'],
			['paragraph', 'paragraph'],
			['indented-codeblock'],
		];
		const html = `<pre><code>indented code
</code></pre><p>paragraph</p><pre><code>more code</code></pre>`;
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 273', async () => {
		const md = '1.     indented code\n\n   paragraph\n\n       more code';
		const ast: ASTLikeNode = [
			'document',
			[
				'list',
				[
					'item',
					[['indented-codeblock', { code: 'indented code\n' }]],
					['paragraph', 'paragraph'],
					[['indented-codeblock', { code: 'more code' }]],
				],
			],
		];
		const html = `<ol start="1"><li><pre><code>indented code
</code></pre><p>paragraph</p><pre><code>more code</code></pre></li></ol>`;
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 274', async () => {
		const md = '1.      indented code\n\n   paragraph\n\n       more code';
		const ast: ASTLikeNode = [
			'document',
			[
				'list',
				[
					'item',
					[['indented-codeblock', { code: ' indented code\n' }]],
					['paragraph', 'paragraph'],
					[['indented-codeblock', { code: 'more code' }]],
				],
			],
		];
		const html = `<ol start="1"><li><pre><code> indented code
</code></pre><p>paragraph</p><pre><code>more code</code></pre></li></ol>`;
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 275', async () => {
		const md = '   foo\n\nbar';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', 'foo'],
			['paragraph', 'bar'],
		];
		const html = '<p>foo</p><p>bar</p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 276', async () => {
		const md = '-    foo\n\n  bar';
		const ast: ASTLikeNode = [
			'document',
			['list', ['item', 'foo']],
			['paragraph', 'bar'],
		];
		const html = '<ul><li>foo</li></ul><p>bar</p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 277', async () => {
		const md = '-  foo\n\n   bar';
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

	it('Example 278', async () => {
		const md = '-\n  foo\n-\n  ```\n  bar\n  ```\n-\n      baz';
		const ast: ASTLikeNode = [
			'document',
			[
				'list',
				['item', 'foo'],
				['item', ['fenced-codeblock']],
				['item', ['indented-codeblock']],
			],
		];
		const html = `<ul><li>foo</li><li><pre><code>bar
</code></pre></li><li><pre><code>baz</code></pre></li></ul>`;
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 279', async () => {
		const md = '-   \n  foo';
		const ast: ASTLikeNode = ['document', ['list', ['item', 'foo']]];
		const html = '<ul><li>foo</li></ul>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 280', async () => {
		const md = '-\n\n  foo';
		const ast: ASTLikeNode = [
			'document',
			['list', ['item']],
			['paragraph', 'foo'],
		];
		const html = '<ul><li></li></ul><p>foo</p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 281', async () => {
		const md = '- foo\n-\n- bar';
		const ast: ASTLikeNode = [
			'document',
			[['list', { ordered: false }], ['item', 'foo'], ['item'], ['item', 'bar']],
		];
		const html = '<ul><li>foo</li><li></li><li>bar</li></ul>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 282', async () => {
		const md = '- foo\n-   \n- bar';
		const ast: ASTLikeNode = [
			'document',
			[['list', { ordered: false }], ['item', 'foo'], ['item'], ['item', 'bar']],
		];
		const html = '<ul><li>foo</li><li></li><li>bar</li></ul>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 283', async () => {
		const md = '1. foo\n2.\n3. bar';
		const ast: ASTLikeNode = [
			'document',
			[['list', { ordered: true }], ['item', 'foo'], ['item'], ['item', 'bar']],
		];
		const html = '<ol start="1"><li>foo</li><li></li><li>bar</li></ol>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 284', async () => {
		const md = '*';
		const ast: ASTLikeNode = ['document', ['list', ['item']]];
		const html = '<ul><li></li></ul>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 285', async () => {
		const md = 'foo\n*\n\nfoo\n1.';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', 'foo', ['#softbreak'], '*'],
			['paragraph', 'foo', ['#softbreak'], '1.'],
		];
		const html = `<p>foo
*</p><p>foo
1.</p>`;
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 286', async () => {
		const md =
			' 1.  A paragraph\n     with two lines.\n\n         indented code\n\n     > A block quote.';
		const ast: ASTLikeNode = [
			'document',
			[
				'list',
				[
					'item',
					['paragraph', 'A paragraph', ['#softbreak'], 'with two lines.'],
					['indented-codeblock'],
					['blockquote', ['item', ['paragraph', 'A block quote.']]],
				],
			],
		];
		const html = `<ol start="1"><li><p>A paragraph
with two lines.</p><pre><code>indented code
</code></pre><blockquote><p>A block quote.</p></blockquote></li></ol>`;
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 287', async () => {
		const md =
			'  1.  A paragraph\n      with two lines.\n\n          indented code\n\n      > A block quote.';
		const ast: ASTLikeNode = [
			'document',
			[
				'list',
				[
					'item',
					['paragraph', 'A paragraph', ['#softbreak'], 'with two lines.'],
					['indented-codeblock'],
					['blockquote', ['item', ['paragraph', 'A block quote.']]],
				],
			],
		];
		const html = `<ol start="1"><li><p>A paragraph
with two lines.</p><pre><code>indented code
</code></pre><blockquote><p>A block quote.</p></blockquote></li></ol>`;
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 288', async () => {
		const md =
			'   1.  A paragraph\n       with two lines.\n\n           indented code\n\n       > A block quote.';
		const ast: ASTLikeNode = [
			'document',
			[
				'list',
				[
					'item',
					['paragraph', 'A paragraph', ['#softbreak'], 'with two lines.'],
					['indented-codeblock'],
					['blockquote', ['item', ['paragraph', 'A block quote.']]],
				],
			],
		];
		const html = `<ol start="1"><li><p>A paragraph
with two lines.</p><pre><code>indented code
</code></pre><blockquote><p>A block quote.</p></blockquote></li></ol>`;
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 289', async () => {
		const md =
			'    1.  A paragraph\n        with two lines.\n\n            indented code\n\n        > A block quote.';
		const ast: ASTLikeNode = ['document', ['indented-codeblock']];
		const html = `<pre><code>1.  A paragraph
    with two lines.

        indented code

    &gt; A block quote.</code></pre>`;
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 290', async () => {
		const md =
			'  1.  A paragraph\nwith two lines.\n\n          indented code\n\n      > A block quote.';
		const ast: ASTLikeNode = [
			'document',
			[
				'list',
				[
					'item',
					['paragraph', 'A paragraph', ['#softbreak'], 'with two lines.'],
					['indented-codeblock'],
					['blockquote', ['item', ['paragraph', 'A block quote.']]],
				],
			],
		];
		const html = `<ol start="1"><li><p>A paragraph
with two lines.</p><pre><code>indented code
</code></pre><blockquote><p>A block quote.</p></blockquote></li></ol>`;
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 291', async () => {
		const md = '  1.  A paragraph\n    with two lines.';
		const ast: ASTLikeNode = [
			'document',
			['list', ['item', 'A paragraph', ['#softbreak'], 'with two lines.']],
		];
		const html = `<ol start="1"><li>A paragraph
with two lines.</li></ol>`;
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 292', async () => {
		const md = '> 1. > Blockquote\ncontinued here.';
		const ast: ASTLikeNode = [
			'document',
			[
				'blockquote',
				[
					'item',
					[
						'list',
						[
							'item',
							[
								'blockquote',
								[
									'item',
									['paragraph', 'Blockquote', ['#softbreak'], 'continued here.'],
								],
							],
						],
					],
				],
			],
		];
		const html = `<blockquote><ol start="1"><li><blockquote><p>Blockquote
continued here.</p></blockquote></li></ol></blockquote>`;
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 293', async () => {
		const md = '> 1. > Blockquote\n> continued here.';
		const ast: ASTLikeNode = [
			'document',
			[
				'blockquote',
				[
					'item',
					[
						'list',
						[
							'item',
							[
								'blockquote',
								[
									'item',
									['paragraph', 'Blockquote', ['#softbreak'], 'continued here.'],
								],
							],
						],
					],
				],
			],
		];
		const html = `<blockquote><ol start="1"><li><blockquote><p>Blockquote
continued here.</p></blockquote></li></ol></blockquote>`;
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 294', async () => {
		const md = '- foo\n  - bar\n    - baz\n      - boo';
		const ast: ASTLikeNode = [
			'document',
			[
				'list',
				[
					'item',
					'foo',
					[
						'list',
						['item', 'bar', ['list', ['item', 'baz', ['list', ['item', 'boo']]]]],
					],
				],
			],
		];
		const html =
			'<ul><li>foo<ul><li>bar<ul><li>baz<ul><li>boo</li></ul></li></ul></li></ul></li></ul>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 295', async () => {
		const md = '- foo\n - bar\n  - baz\n   - boo';
		const ast: ASTLikeNode = [
			'document',
			['list', ['item', 'foo'], ['item', 'bar'], ['item', 'baz'], ['item', 'boo']],
		];
		const html = '<ul><li>foo</li><li>bar</li><li>baz</li><li>boo</li></ul>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 296', async () => {
		const md = '10) foo\n    - bar';
		const ast: ASTLikeNode = [
			'document',
			[
				['list', { ordered: true }],
				[
					'item',
					'foo',
					[
						['list', { ordered: false }],
						['item', 'bar'],
					],
				],
			],
		];
		const html = '<ol start="10"><li>foo<ul><li>bar</li></ul></li></ol>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 297', async () => {
		const md = '10) foo\n   - bar';
		const ast: ASTLikeNode = [
			'document',
			[
				['list', { ordered: true }],
				['item', 'foo'],
			],
			[
				['list', { ordered: false }],
				['item', 'bar'],
			],
		];
		const html = '<ol start="10"><li>foo</li></ol><ul><li>bar</li></ul>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 298', async () => {
		const md = '- - foo';
		const ast: ASTLikeNode = [
			'document',
			[
				['list', { ordered: false }],
				[
					'item',
					[
						['list', { ordered: false }],
						['item', 'foo'],
					],
				],
			],
		];
		const html = '<ul><li><ul><li>foo</li></ul></li></ul>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 299', async () => {
		const md = '1. - 2. foo';
		const ast: ASTLikeNode = [
			'document',
			[
				['list', { ordered: true }],
				[
					'item',
					[
						['list', { ordered: false }],
						[
							'item',
							[
								['list', { ordered: true }],
								['item', 'foo'],
							],
						],
					],
				],
			],
		];
		const html =
			'<ol start="1"><li><ul><li><ol start="2"><li>foo</li></ol></li></ul></li></ol>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 300', async () => {
		const md = '- # Foo\n- Bar\n  ---\n  baz';
		const ast: ASTLikeNode = [
			'document',
			[
				'list',
				['item', ['atx-heading', ['#item', 'Foo']]],
				['item', ['setext-heading', ['#item', 'Bar']], 'baz'],
			],
		];
		const html =
			'<ul><li><h1 id="foo">Foo</h1></li><li><h2 id="bar">Bar</h2>baz</li></ul>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});
});
