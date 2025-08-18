/** @see https://spec.commonmark.org/0.31.2/#link-reference-definitions */

import { describe, expect, it } from 'vitest';
import { EzalMarkdown } from '../../src';
import { ASTLikeNode, initAstMatcher } from '../ast';

initAstMatcher();

describe('CommonMark: Link reference definitions', () => {
	it('Example 192', async () => {
		const md = '[foo]: /url "title"\n\n[foo]';
		const ast: ASTLikeNode = [
			'document',
			[
				'paragraph',
				[['#link', { label: 'FOO', destination: '/url', title: 'title' }], 'foo'],
			],
		];
		const html = '<p><a href="/url" title="title">foo</a></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 193', async () => {
		const md = `   [foo]: \n      /url  \n           'the title'  \n\n[foo]`;
		const ast: ASTLikeNode = [
			'document',
			[
				'paragraph',
				[
					['#link', { label: 'FOO', destination: '/url', title: 'the title' }],
					'foo',
				],
			],
		];
		const html = '<p><a href="/url" title="the title">foo</a></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 194', async () => {
		const md = `[Foo*bar\\]]:my_(url) 'title (with parens)'\n\n[Foo*bar\\]]\n`;
		const ast: ASTLikeNode = [
			'document',
			[
				'paragraph',
				[
					[
						'#link',
						{
							label: 'FOO*BAR\\]',
							destination: 'my_(url)',
							title: 'title (with parens)',
						},
					],
					'Foo*bar',
					['#escape'],
				],
			],
		];
		const html =
			'<p><a href="my_(url)" title="title (with parens)">Foo*bar]</a></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 195', async () => {
		const md = `[Foo bar]:\n<my url>\n'title'\n\n[Foo bar]\n`;
		const ast: ASTLikeNode = [
			'document',
			[
				'paragraph',
				[
					['#link', { label: 'FOO BAR', destination: 'my%20url', title: 'title' }],
					'Foo bar',
				],
			],
		];
		const html = '<p><a href="my%20url" title="title">Foo bar</a></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 196', async () => {
		const md = `[foo]: /url '\ntitle\nline1\nline2\n'\n\n[foo]\n`;
		const ast: ASTLikeNode = [
			'document',
			[
				'paragraph',
				[
					[
						'#link',
						{ label: 'FOO', destination: '/url', title: '\ntitle\nline1\nline2\n' },
					],
					'foo',
				],
			],
		];
		const html = `<p><a href="/url" title="
title
line1
line2
">foo</a></p>`;
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 197', async () => {
		const md = `[foo]: /url 'title\n\nwith blank line'\n\n[foo]\n`;
		const ast: ASTLikeNode = [
			'document',
			['paragraph', "[foo]: /url 'title"],
			['paragraph', "with blank line'"],
			['paragraph', '[foo]'],
		];
		const html =
			'<p>[foo]: /url &#39;title</p><p>with blank line&#39;</p><p>[foo]</p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 198', async () => {
		const md = '[foo]:\n/url\n\n[foo]';
		const ast: ASTLikeNode = [
			'document',
			[
				'paragraph',
				[['#link', { label: 'FOO', destination: '/url', title: undefined }], 'foo'],
			],
		];
		const html = '<p><a href="/url">foo</a></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 199', async () => {
		const md = '[foo]:\n\n[foo]';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', '[foo]:'],
			['paragraph', '[foo]'],
		];
		const html = '<p>[foo]:</p><p>[foo]</p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 200', async () => {
		const md = '[foo]: <>\n\n[foo]';
		const ast: ASTLikeNode = [
			'document',
			[
				'paragraph',
				[['#link', { label: 'FOO', destination: '', title: undefined }], 'foo'],
			],
		];
		const html = '<p><a>foo</a></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 201', async () => {
		const md = '[foo]: <bar>(baz)\n\n[foo]';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', '[foo]: ', ['#html'], '(baz)'],
			['paragraph', '[foo]'],
		];
		const html = '<p>[foo]: <bar>(baz)</p><p>[foo]</p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 202', async () => {
		const md = '[foo]: /url\\bar\\*baz "foo\\"bar\\baz"\n\n[foo]';
		const ast: ASTLikeNode = [
			'document',
			[
				'paragraph',
				[
					[
						'#link',
						{ label: 'FOO', destination: '/url%5Cbar*baz', title: 'foo"bar\\baz' },
					],
					'foo',
				],
			],
		];
		const html =
			'<p><a href="/url%5Cbar*baz" title="foo&quot;bar\\baz">foo</a></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 203', async () => {
		const md = '[foo]\n\n[foo]: url';
		const ast: ASTLikeNode = [
			'document',
			[
				'paragraph',
				[['#link', { label: 'FOO', destination: 'url', title: undefined }], 'foo'],
			],
		];
		const html = '<p><a href="url">foo</a></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 204', async () => {
		const md = '[foo]\n\n[foo]: first\n[foo]: second';
		const ast: ASTLikeNode = [
			'document',
			[
				'paragraph',
				[
					['#link', { label: 'FOO', destination: 'first', title: undefined }],
					'foo',
				],
			],
		];
		const html = '<p><a href="first">foo</a></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 205', async () => {
		const md = '[FOO]: /url\n\n[Foo]';
		const ast: ASTLikeNode = [
			'document',
			[
				'paragraph',
				[['#link', { label: 'FOO', destination: '/url', title: undefined }], 'Foo'],
			],
		];
		const html = '<p><a href="/url">Foo</a></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 206', async () => {
		const md = '[ΑΓΩ]: /φου\n\n[αγω]';
		const ast: ASTLikeNode = [
			'document',
			[
				'paragraph',
				[
					[
						'#link',
						{ label: 'ΑΓΩ', destination: '/%CF%86%CE%BF%CF%85', title: undefined },
					],
					'αγω',
				],
			],
		];
		const html = '<p><a href="/%CF%86%CE%BF%CF%85">αγω</a></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 207', async () => {
		const md = '[foo]: /url';
		const result = await EzalMarkdown.renderHTML(md);
		expect(result.html).toBe('');
	});

	it('Example 208', async () => {
		const md = '[\nfoo\n]: /url\nbar';
		const ast: ASTLikeNode = ['document', ['paragraph', 'bar']];
		const html = '<p>bar</p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 209', async () => {
		const md = '[foo]: /url "title" ok';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', '[foo]: /url "title" ok'],
		];
		const html = '<p>[foo]: /url &quot;title&quot; ok</p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 210', async () => {
		const md = '[foo]: /url\n"title" ok';
		const ast: ASTLikeNode = ['document', ['paragraph', '"title" ok']];
		const html = '<p>&quot;title&quot; ok</p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 211', async () => {
		const md = '    [foo]: /url "title"\n\n[foo]';
		const ast: ASTLikeNode = [
			'document',
			['indented-codeblock'],
			['paragraph', '[foo]'],
		];
		const html = `<pre><code>[foo]: /url &quot;title&quot;
</code></pre><p>[foo]</p>`;
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 212', async () => {
		const md = '```\n[foo]: /url\n```\n\n[foo]';
		const ast: ASTLikeNode = [
			'document',
			['fenced-codeblock'],
			['paragraph', '[foo]'],
		];
		const html = `<pre><code>[foo]: /url
</code></pre><p>[foo]</p>`;
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 213', async () => {
		const md = 'Foo\n[bar]: /baz\n\n[bar]';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', 'Foo', ['#softbreak'], '[bar]: /baz'],
			['paragraph', '[bar]'],
		];
		const html = `<p>Foo
[bar]: /baz</p><p>[bar]</p>`;
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 214', async () => {
		const md = '# [Foo]\n[foo]: /url\n> bar';
		const ast: ASTLikeNode = [
			'document',
			[
				'atx-heading',
				[
					'#item',
					[
						['#link', { label: 'FOO', destination: '/url', title: undefined }],
						'Foo',
					],
				],
			],
			['blockquote', ['item', ['paragraph', 'bar']]],
		];
		const html =
			'<h1 id="foo"><a href="/url">Foo</a></h1><blockquote><p>bar</p></blockquote>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 215', async () => {
		const md = '[foo]: /url\nbar\n===\n[foo]';
		const ast: ASTLikeNode = [
			'document',
			['setext-heading', ['#item', 'bar']],
			[
				'paragraph',
				[['#link', { label: 'FOO', destination: '/url', title: undefined }], 'foo'],
			],
		];
		const html = '<h1 id="bar">bar</h1><p><a href="/url">foo</a></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 216', async () => {
		const md = '[foo]: /url\n===\n[foo]';
		const ast: ASTLikeNode = [
			'document',
			[
				'paragraph',
				'===',
				['#softbreak'],
				[['#link', { label: 'FOO', destination: '/url', title: undefined }], 'foo'],
			],
		];
		const html = `<p>===
<a href="/url">foo</a></p>`;
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 217', async () => {
		const md =
			'[foo]: /foo-url "foo"\n[bar]: /bar-url\n  "bar"\n[baz]: /baz-url\n\n[foo],\n[bar],\n[baz]\n';
		const ast: ASTLikeNode = [
			'document',
			[
				'paragraph',
				[['#link', { label: 'FOO', destination: '/foo-url', title: 'foo' }], 'foo'],
				',',
				['#softbreak'],
				[['#link', { label: 'BAR', destination: '/bar-url', title: 'bar' }], 'bar'],
				',',
				['#softbreak'],
				[['#link', { label: 'BAZ', destination: '/baz-url' }], 'baz'],
			],
		];
		const html = `<p><a href="/foo-url" title="foo">foo</a>,
<a href="/bar-url" title="bar">bar</a>,
<a href="/baz-url">baz</a></p>`;
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 218', async () => {
		const md = '[foo]\n\n> [foo]: /url';
		const ast: ASTLikeNode = [
			'document',
			[
				'paragraph',
				[['#link', { label: 'FOO', destination: '/url', title: undefined }], 'foo'],
			],
			['blockquote', ['item']],
		];
		const html = '<p><a href="/url">foo</a></p><blockquote></blockquote>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});
});
