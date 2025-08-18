/** @see https://spec.commonmark.org/0.31.2/#lists */

import { describe, expect, it } from 'vitest';
import { EzalMarkdown } from '../../src';
import { ASTLikeNode, initAstMatcher } from '../ast';

initAstMatcher();

describe('CommonMark: Lists', () => {
	it('Example 301', async () => {
		const md = '- foo\n- bar\n+ baz';
		const ast: ASTLikeNode = [
			'document',
			['list', ['item', 'foo'], ['item', 'bar']],
			['list', ['item', 'baz']],
		];
		const html = '<ul><li>foo</li><li>bar</li></ul><ul><li>baz</li></ul>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 302', async () => {
		const md = '1. foo\n2. bar\n3) baz';
		const ast: ASTLikeNode = [
			'document',
			['list', ['item', 'foo'], ['item', 'bar']],
			['list', ['item', 'baz']],
		];
		const html =
			'<ol start="1"><li>foo</li><li>bar</li></ol><ol start="3"><li>baz</li></ol>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 303', async () => {
		const md = 'Foo\n- bar\n- baz';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', 'Foo'],
			['list', ['item', 'bar'], ['item', 'baz']],
		];
		const html = '<p>Foo</p><ul><li>bar</li><li>baz</li></ul>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 304', async () => {
		const md =
			'The number of windows in my house is\n14.  The number of doors is 6.';
		const ast: ASTLikeNode = [
			'document',
			[
				'paragraph',
				'The number of windows in my house is',
				['#softbreak'],
				'14.  The number of doors is 6.',
			],
		];
		const html = `<p>The number of windows in my house is
14.  The number of doors is 6.</p>`;
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 305', async () => {
		const md =
			'The number of windows in my house is\n1.  The number of doors is 6.';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', 'The number of windows in my house is'],
			['list', ['item', 'The number of doors is 6.']],
		];
		const html =
			'<p>The number of windows in my house is</p><ol start="1"><li>The number of doors is 6.</li></ol>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 306', async () => {
		const md = '- foo\n\n- bar\n\n\n- baz';
		const ast: ASTLikeNode = [
			'document',
			[
				'list',
				['item', ['paragraph', 'foo']],
				['item', ['paragraph', 'bar']],
				['item', ['paragraph', 'baz']],
			],
		];
		const html =
			'<ul><li><p>foo</p></li><li><p>bar</p></li><li><p>baz</p></li></ul>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 307', async () => {
		const md = '- foo\n  - bar\n    - baz\n\n\n      bim';
		const ast: ASTLikeNode = [
			'document',
			[
				'list',
				[
					'item',
					'foo',
					[
						'list',
						[
							'item',
							'bar',
							['list', ['item', ['paragraph', 'baz'], ['paragraph', 'bim']]],
						],
					],
				],
			],
		];
		const html =
			'<ul><li>foo<ul><li>bar<ul><li><p>baz</p><p>bim</p></li></ul></li></ul></li></ul>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 308', async () => {
		const md = '- foo\n- bar\n\n<!-- -->\n\n- baz\n- bim';
		const ast: ASTLikeNode = [
			'document',
			['list', ['item', 'foo'], ['item', 'bar']],
			['html'],
			['list', ['item', 'baz'], ['item', 'bim']],
		];
		const html =
			'<ul><li>foo</li><li>bar</li></ul><!-- --><ul><li>baz</li><li>bim</li></ul>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 309', async () => {
		const md = '-   foo\n\n    notcode\n\n-   foo\n\n<!-- -->\n\n    code';
		const ast: ASTLikeNode = [
			'document',
			[
				'list',
				['item', ['paragraph', 'foo'], ['paragraph', 'notcode']],
				['item', ['paragraph', 'foo']],
			],
			['html'],
			['indented-codeblock'],
		];
		const html =
			'<ul><li><p>foo</p><p>notcode</p></li><li><p>foo</p></li></ul><!-- --><pre><code>code</code></pre>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 310', async () => {
		const md = '- a\n - b\n  - c\n   - d\n  - e\n - f\n- g';
		const ast: ASTLikeNode = [
			'document',
			[
				'list',
				['item', 'a'],
				['item', 'b'],
				['item', 'c'],
				['item', 'd'],
				['item', 'e'],
				['item', 'f'],
				['item', 'g'],
			],
		];
		const html =
			'<ul><li>a</li><li>b</li><li>c</li><li>d</li><li>e</li><li>f</li><li>g</li></ul>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 311', async () => {
		const md = '1. a\n\n  2. b\n\n   3. c';
		const ast: ASTLikeNode = [
			'document',
			[
				'list',
				['item', ['paragraph', 'a']],
				['item', ['paragraph', 'b']],
				['item', ['paragraph', 'c']],
			],
		];
		const html =
			'<ol start="1"><li><p>a</p></li><li><p>b</p></li><li><p>c</p></li></ol>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 312', async () => {
		const md = '- a\n - b\n  - c\n   - d\n    - e';
		const ast: ASTLikeNode = [
			'document',
			[
				'list',
				['item', 'a'],
				['item', 'b'],
				['item', 'c'],
				['item', 'd', ['#softbreak'], '- e'],
			],
		];
		const html = `<ul><li>a</li><li>b</li><li>c</li><li>d
- e</li></ul>`;
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 313', async () => {
		const md = '1. a\n\n  2. b\n\n    3. c';
		const ast: ASTLikeNode = [
			'document',
			['list', ['item', ['paragraph', 'a']], ['item', ['paragraph', 'b']]],
			['indented-codeblock'],
		];
		const html =
			'<ol start="1"><li><p>a</p></li><li><p>b</p></li></ol><pre><code>3. c</code></pre>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 314', async () => {
		const md = '- a\n- b\n\n- c';
		const ast: ASTLikeNode = [
			'document',
			[
				'list',
				['item', ['paragraph', 'a']],
				['item', ['paragraph', 'b']],
				['item', ['paragraph', 'c']],
			],
		];
		const html = '<ul><li><p>a</p></li><li><p>b</p></li><li><p>c</p></li></ul>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 315', async () => {
		const md = '* a\n*\n\n* c';
		const ast: ASTLikeNode = [
			'document',
			[
				'list',
				['item', ['paragraph', 'a']],
				['item'],
				['item', ['paragraph', 'c']],
			],
		];
		const html = '<ul><li><p>a</p></li><li></li><li><p>c</p></li></ul>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 316', async () => {
		const md = '- a\n- b\n\n  c\n- d';
		const ast: ASTLikeNode = [
			'document',
			[
				'list',
				['item', ['paragraph', 'a']],
				['item', ['paragraph', 'b'], ['paragraph', 'c']],
				['item', ['paragraph', 'd']],
			],
		];
		const html =
			'<ul><li><p>a</p></li><li><p>b</p><p>c</p></li><li><p>d</p></li></ul>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 317', async () => {
		const md = '- a\n- b\n\n  [ref]: /url\n- d';
		const ast: ASTLikeNode = [
			'document',
			[
				'list',
				['item', ['paragraph', 'a']],
				['item', ['paragraph', 'b']],
				['item', ['paragraph', 'd']],
			],
		];
		const html = '<ul><li><p>a</p></li><li><p>b</p></li><li><p>d</p></li></ul>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 318', async () => {
		const md = '- a\n- ```\n  b\n\n\n  ```\n- c';
		const ast: ASTLikeNode = [
			'document',
			['list', ['item', 'a'], ['item', ['fenced-codeblock']], ['item', 'c']],
		];
		const html = `<ul><li>a</li><li><pre><code>b


</code></pre></li><li>c</li></ul>`;
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 319', async () => {
		const md = '- a\n  - b\n\n    c\n- d';
		const ast: ASTLikeNode = [
			'document',
			[
				'list',
				['item', 'a', ['list', ['item', ['paragraph', 'b'], ['paragraph', 'c']]]],
				['item', 'd'],
			],
		];
		const html =
			'<ul><li>a<ul><li><p>b</p><p>c</p></li></ul></li><li>d</li></ul>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 320', async () => {
		const md = '* a\n  > b\n  >\n* c';
		const ast: ASTLikeNode = [
			'document',
			[
				'list',
				['item', 'a', ['blockquote', ['item', ['paragraph', 'b']]]],
				['item', 'c'],
			],
		];
		const html = '<ul><li>a<blockquote><p>b</p></blockquote></li><li>c</li></ul>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 321', async () => {
		const md = '- a\n  > b\n  ```\n  c\n  ```\n- d';
		const ast: ASTLikeNode = [
			'document',
			[
				'list',
				[
					'item',
					'a',
					['blockquote', ['item', ['paragraph', 'b']]],
					['fenced-codeblock'],
				],
				['item', 'd'],
			],
		];
		const html = `<ul><li>a<blockquote><p>b</p></blockquote><pre><code>c
</code></pre></li><li>d</li></ul>`;
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 322', async () => {
		const md = '- a';
		const ast: ASTLikeNode = ['document', ['list', ['item', 'a']]];
		const html = '<ul><li>a</li></ul>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 323', async () => {
		const md = '- a\n  - b';
		const ast: ASTLikeNode = [
			'document',
			['list', ['item', 'a', ['list', ['item', 'b']]]],
		];
		const html = '<ul><li>a<ul><li>b</li></ul></li></ul>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 324', async () => {
		const md = '1. ```\n   foo\n   ```\n\n   bar';
		const ast: ASTLikeNode = [
			'document',
			['list', ['item', ['fenced-codeblock'], ['paragraph', 'bar']]],
		];
		const html = `<ol start="1"><li><pre><code>foo
</code></pre><p>bar</p></li></ol>`;
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 325', async () => {
		const md = '* foo\n  * bar\n\n  baz';
		const ast: ASTLikeNode = [
			'document',
			[
				'list',
				[
					'item',
					['paragraph', 'foo'],
					['list', ['item', 'bar']],
					['paragraph', 'baz'],
				],
			],
		];
		const html = '<ul><li><p>foo</p><ul><li>bar</li></ul><p>baz</p></li></ul>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 326', async () => {
		const md = '- a\n  - b\n  - c\n\n- d\n  - e\n  - f';
		const ast: ASTLikeNode = [
			'document',
			[
				'list',
				['item', ['paragraph', 'a'], ['list', ['item', 'b'], ['item', 'c']]],
				['item', ['paragraph', 'd'], ['list', ['item', 'e'], ['item', 'f']]],
			],
		];
		const html =
			'<ul><li><p>a</p><ul><li>b</li><li>c</li></ul></li><li><p>d</p><ul><li>e</li><li>f</li></ul></li></ul>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});
});
