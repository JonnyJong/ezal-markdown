/** @see https://spec.commonmark.org/0.31.2/#block-quotes */

import { describe, expect, it } from 'vitest';
import { EzalMarkdown } from '../../src';
import { ASTLikeNode, initAstMatcher } from '../ast';

initAstMatcher();

describe('CommonMark: Block quotes', () => {
	it('Example 228', async () => {
		const md = '> # Foo\n> bar\n> baz';
		const ast: ASTLikeNode = [
			'document',
			[
				'blockquote',
				[
					'item',
					['atx-heading', ['#item', 'Foo']],
					['paragraph', 'bar', ['#softbreak'], 'baz'],
				],
			],
		];
		const html = `<blockquote><h1 id="foo">Foo</h1><p>bar
baz</p></blockquote>`;
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 229', async () => {
		const md = '># Foo\n>bar\n> baz';
		const ast: ASTLikeNode = [
			'document',
			[
				'blockquote',
				[
					'item',
					['atx-heading', ['#item', 'Foo']],
					['paragraph', 'bar', ['#softbreak'], 'baz'],
				],
			],
		];
		const html = `<blockquote><h1 id="foo">Foo</h1><p>bar
baz</p></blockquote>`;
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 230', async () => {
		const md = '   > # Foo\n   > bar\n > baz';
		const ast: ASTLikeNode = [
			'document',
			[
				'blockquote',
				[
					'item',
					['atx-heading', ['#item', 'Foo']],
					['paragraph', 'bar', ['#softbreak'], 'baz'],
				],
			],
		];
		const html = `<blockquote><h1 id="foo">Foo</h1><p>bar
baz</p></blockquote>`;
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 231', async () => {
		const md = '    > # Foo\n    > bar\n    > baz';
		const ast: ASTLikeNode = ['document', ['indented-codeblock']];
		const html = `<pre><code>&gt; # Foo
&gt; bar
&gt; baz</code></pre>`;
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 232', async () => {
		const md = '> # Foo\n> bar\nbaz';
		const ast: ASTLikeNode = [
			'document',
			[
				'blockquote',
				[
					'item',
					['atx-heading', ['#item', 'Foo']],
					['paragraph', 'bar', ['#softbreak'], 'baz'],
				],
			],
		];
		const html = `<blockquote><h1 id="foo">Foo</h1><p>bar
baz</p></blockquote>`;
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 233', async () => {
		const md = '> bar\nbaz\n> foo';
		const ast: ASTLikeNode = [
			'document',
			[
				'blockquote',
				[
					'item',
					['paragraph', 'bar', ['#softbreak'], 'baz', ['#softbreak'], 'foo'],
				],
			],
		];
		const html = `<blockquote><p>bar
baz
foo</p></blockquote>`;
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 234', async () => {
		const md = '> foo\n---';
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

	it('Example 235', async () => {
		const md = '> - foo\n- bar';
		const ast: ASTLikeNode = [
			'document',
			['blockquote', ['item', ['list', ['item', 'foo']]]],
			['list', ['item', 'bar']],
		];
		const html =
			'<blockquote><ul><li>foo</li></ul></blockquote><ul><li>bar</li></ul>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 236', async () => {
		const md = '>     foo\n    bar';
		const ast: ASTLikeNode = [
			'document',
			['blockquote', ['item', ['indented-codeblock']]],
			['indented-codeblock'],
		];
		const html = `<blockquote><pre><code>foo
</code></pre></blockquote><pre><code>bar</code></pre>`;
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 237', async () => {
		const md = '> ```\nfoo\n```';
		const ast: ASTLikeNode = [
			'document',
			['blockquote', ['item', ['fenced-codeblock']]],
			['paragraph', 'foo'],
			['fenced-codeblock'],
		];
		const html =
			'<blockquote><pre><code></code></pre></blockquote><p>foo</p><pre><code></code></pre>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 238', async () => {
		const md = '> foo\n    - bar';
		const ast: ASTLikeNode = [
			'document',
			['blockquote', ['item', ['paragraph', 'foo', ['#softbreak'], '- bar']]],
		];
		const html = `<blockquote><p>foo
- bar</p></blockquote>`;
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 239', async () => {
		const md = '>';
		const ast: ASTLikeNode = ['document', ['blockquote', ['item']]];
		const html = '<blockquote></blockquote>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 240', async () => {
		const md = '>\n>  \n> \n';
		const ast: ASTLikeNode = ['document', ['blockquote', ['item']]];
		const html = '<blockquote></blockquote>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 241', async () => {
		const md = '>\n> foo\n>  ';
		const ast: ASTLikeNode = [
			'document',
			['blockquote', ['item', ['paragraph', 'foo']]],
		];
		const html = '<blockquote><p>foo</p></blockquote>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 242', async () => {
		const md = '> foo\n\n> bar';
		const ast: ASTLikeNode = [
			'document',
			['blockquote', ['item', ['paragraph', 'foo']]],
			['blockquote', ['item', ['paragraph', 'bar']]],
		];
		const html =
			'<blockquote><p>foo</p></blockquote><blockquote><p>bar</p></blockquote>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 243', async () => {
		const md = '> foo\n> bar';
		const ast: ASTLikeNode = [
			'document',
			['blockquote', ['item', ['paragraph', 'foo', ['#softbreak'], 'bar']]],
		];
		const html = `<blockquote><p>foo
bar</p></blockquote>`;
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 244', async () => {
		const md = '> foo\n>\n> bar';
		const ast: ASTLikeNode = [
			'document',
			['blockquote', ['item', ['paragraph', 'foo'], ['paragraph', 'bar']]],
		];
		const html = '<blockquote><p>foo</p><p>bar</p></blockquote>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 245', async () => {
		const md = 'foo\n> bar\n';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', 'foo'],
			['blockquote', ['item', ['paragraph', 'bar']]],
		];
		const html = '<p>foo</p><blockquote><p>bar</p></blockquote>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 246', async () => {
		const md = '> aaa\n***\n> bbb';
		const ast: ASTLikeNode = [
			'document',
			['blockquote', ['item', ['paragraph', 'aaa']]],
			['thematic-break'],
			['blockquote', ['item', ['paragraph', 'bbb']]],
		];
		const html =
			'<blockquote><p>aaa</p></blockquote><hr><blockquote><p>bbb</p></blockquote>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 247', async () => {
		const md = '> bar\nbaz';
		const ast: ASTLikeNode = [
			'document',
			['blockquote', ['item', ['paragraph', 'bar', ['#softbreak'], 'baz']]],
		];
		const html = `<blockquote><p>bar
baz</p></blockquote>`;
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 248', async () => {
		const md = '> bar\n\nbaz';
		const ast: ASTLikeNode = [
			'document',
			['blockquote', ['item', ['paragraph', 'bar']]],
			['paragraph', 'baz'],
		];
		const html = '<blockquote><p>bar</p></blockquote><p>baz</p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 249', async () => {
		const md = '> bar\n>\nbaz';
		const ast: ASTLikeNode = [
			'document',
			['blockquote', ['item', ['paragraph', 'bar']]],
			['paragraph', 'baz'],
		];
		const html = '<blockquote><p>bar</p></blockquote><p>baz</p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 250', async () => {
		const md = '> > > foo\nbar';
		const ast: ASTLikeNode = [
			'document',
			[
				'blockquote',
				[
					'item',
					[
						'blockquote',
						[
							'item',
							['blockquote', ['item', ['paragraph', 'foo', ['#softbreak'], 'bar']]],
						],
					],
				],
			],
		];
		const html = `<blockquote><blockquote><blockquote><p>foo
bar</p></blockquote></blockquote></blockquote>`;
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 251', async () => {
		const md = '>>> foo\n> bar\n>>baz';
		const ast: ASTLikeNode = [
			'document',
			[
				'blockquote',
				[
					'item',
					[
						'blockquote',
						[
							'item',
							[
								'blockquote',
								[
									'item',
									['paragraph', 'foo', ['#softbreak'], 'bar', ['#softbreak'], 'baz'],
								],
							],
						],
					],
				],
			],
		];
		const html = `<blockquote><blockquote><blockquote><p>foo
bar
baz</p></blockquote></blockquote></blockquote>`;
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 252', async () => {
		const md = '>     code\n\n>    not code';
		const ast: ASTLikeNode = [
			'document',
			['blockquote', ['item', ['indented-codeblock']]],
			['blockquote', ['item', ['paragraph', 'not code']]],
		];
		const html = `<blockquote><pre><code>code
</code></pre></blockquote><blockquote><p>not code</p></blockquote>`;
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});
});
