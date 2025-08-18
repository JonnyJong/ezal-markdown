/** @see https://spec.commonmark.org/0.31.2/#links */

import { describe, expect, it } from 'vitest';
import { EzalMarkdown } from '../../src';
import { ASTLikeNode, initAstMatcher } from '../ast';

initAstMatcher();

describe('CommonMark: Links', () => {
	it('Example 482', async () => {
		const md = '[link](/uri "title")';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', [['#link', { destination: '/uri', title: 'title' }], 'link']],
		];
		const html = '<p><a href="/uri" title="title">link</a></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 483', async () => {
		const md = '[link](/uri)';
		const ast: ASTLikeNode = [
			'document',
			[
				'paragraph',
				[['#link', { destination: '/uri', title: undefined }], 'link'],
			],
		];
		const html = '<p><a href="/uri">link</a></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 484', async () => {
		const md = '[](./target.md)';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', [['#link', { destination: './target.md', title: undefined }]]],
		];
		const html = '<p><a href="./target.md"></a></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 485', async () => {
		const md = '[link]()';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', [['#link', { destination: '', title: undefined }], 'link']],
		];
		const html = '<p><a>link</a></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 486', async () => {
		const md = '[link](<>)';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', [['#link', { destination: '', title: undefined }], 'link']],
		];
		const html = '<p><a>link</a></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 487', async () => {
		const md = '[]()';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', [['#link', { destination: '', title: undefined }]]],
		];
		const html = '<p><a></a></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 488', async () => {
		const md = '[link](/my uri)';
		const ast: ASTLikeNode = ['document', ['paragraph', '[link](/my uri)']];
		const html = '<p>[link](/my uri)</p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 489', async () => {
		const md = '[link](</my uri>)';
		const ast: ASTLikeNode = [
			'document',
			[
				'paragraph',
				[['#link', { destination: '/my%20uri', title: undefined }], 'link'],
			],
		];
		const html = '<p><a href="/my%20uri">link</a></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 490', async () => {
		const md = '[link](foo\nbar)';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', '[link](foo', ['#softbreak'], 'bar)'],
		];
		const html = `<p>[link](foo
bar)</p>`;
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 491', async () => {
		const md = '[link](<foo\nbar>)';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', '[link](', ['#html'], ')'],
		];
		const html = `<p>[link](<foo
bar>)</p>`;
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 492', async () => {
		const md = '[a](<b)c>)';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', [['#link', { destination: 'b)c', title: undefined }], 'a']],
		];
		const html = '<p><a href="b)c">a</a></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 493', async () => {
		const md = '[link](<foo\\>)';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', '[link](<foo', ['#escape'], ')'],
		];
		const html = '<p>[link](&lt;foo&gt;)</p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 494', async () => {
		const md = '[a](<b)c\n[a](<b)c>\n[a](<b>c)';
		const ast: ASTLikeNode = [
			'document',
			[
				'paragraph',
				'[a](<b)c',
				['#softbreak'],
				'[a](<b)c>',
				['#softbreak'],
				'[a](',
				['#html'],
				'c)',
			],
		];
		const html = `<p>[a](&lt;b)c
[a](&lt;b)c&gt;
[a](<b>c)</p>`;
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 495', async () => {
		const md = '[link](\\(foo\\))';
		const ast: ASTLikeNode = [
			'document',
			[
				'paragraph',
				[['#link', { destination: '(foo)', title: undefined }], 'link'],
			],
		];
		const html = '<p><a href="(foo)">link</a></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 496', async () => {
		const md = '[link](foo(and(bar)))';
		const ast: ASTLikeNode = [
			'document',
			[
				'paragraph',
				[['#link', { destination: 'foo(and(bar))', title: undefined }], 'link'],
			],
		];
		const html = '<p><a href="foo(and(bar))">link</a></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 497', async () => {
		const md = '[link](foo(and(bar))';
		const ast: ASTLikeNode = ['document', ['paragraph', '[link](foo(and(bar))']];
		const html = '<p>[link](foo(and(bar))</p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 498', async () => {
		const md = '[link](foo\\(and\\(bar\\))';
		const ast: ASTLikeNode = [
			'document',
			[
				'paragraph',
				[['#link', { destination: 'foo(and(bar)', title: undefined }], 'link'],
			],
		];
		const html = '<p><a href="foo(and(bar)">link</a></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 499', async () => {
		const md = '[link](<foo(and(bar)>)';
		const ast: ASTLikeNode = [
			'document',
			[
				'paragraph',
				[['#link', { destination: 'foo(and(bar)', title: undefined }], 'link'],
			],
		];
		const html = '<p><a href="foo(and(bar)">link</a></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 500', async () => {
		const md = '[link](foo\\)\\:)';
		const ast: ASTLikeNode = [
			'document',
			[
				'paragraph',
				[['#link', { destination: 'foo):', title: undefined }], 'link'],
			],
		];
		const html = '<p><a href="foo):">link</a></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 501', async () => {
		const md = `[link](#fragment)

[link](https://example.com#fragment)

[link](https://example.com?foo=3#frag)`;
		const ast: ASTLikeNode = [
			'document',
			[
				'paragraph',
				[['#link', { destination: '#fragment', title: undefined }], 'link'],
			],
			[
				'paragraph',
				[
					[
						'#link',
						{ destination: 'https://example.com#fragment', title: undefined },
					],
					'link',
				],
			],
			[
				'paragraph',
				[
					[
						'#link',
						{ destination: 'https://example.com?foo=3#frag', title: undefined },
					],
					'link',
				],
			],
		];
		const html =
			'<p><a href="#fragment">link</a></p><p><a href="https://example.com#fragment" target="_blank">link</a></p><p><a href="https://example.com?foo=3#frag" target="_blank">link</a></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 502', async () => {
		const md = '[link](foo\\bar)';
		const ast: ASTLikeNode = [
			'document',
			[
				'paragraph',
				[['#link', { destination: 'foo%5Cbar', title: undefined }], 'link'],
			],
		];
		const html = '<p><a href="foo%5Cbar">link</a></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 503', async () => {
		const md = '[link](foo%20b&auml;)';
		const ast: ASTLikeNode = [
			'document',
			[
				'paragraph',
				[['#link', { destination: 'foo%20b%C3%A4', title: undefined }], 'link'],
			],
		];
		const html = '<p><a href="foo%20b%C3%A4">link</a></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 504', async () => {
		const md = '[link]("title")';
		const ast: ASTLikeNode = [
			'document',
			[
				'paragraph',
				[['#link', { destination: '%22title%22', title: undefined }], 'link'],
			],
		];
		const html = '<p><a href="%22title%22">link</a></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 505', async () => {
		const md = `[link](/url "title")\n[link](/url 'title')\n[link](/url (title))`;
		const ast: ASTLikeNode = [
			'document',
			[
				'paragraph',
				[['#link', { destination: '/url', title: 'title' }], 'link'],
				['#softbreak'],
				[['#link', { destination: '/url', title: 'title' }], 'link'],
				['#softbreak'],
				[['#link', { destination: '/url', title: 'title' }], 'link'],
			],
		];
		const html = `<p><a href="/url" title="title">link</a>
<a href="/url" title="title">link</a>
<a href="/url" title="title">link</a></p>`;
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 506', async () => {
		const md = '[link](/url "title \\"&quot;")';
		const ast: ASTLikeNode = [
			'document',
			[
				'paragraph',
				[['#link', { destination: '/url', title: 'title ""' }], 'link'],
			],
		];
		const html = '<p><a href="/url" title="title &quot;&quot;">link</a></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 507', async () => {
		const md = '[link](/url\u00A0"title")';
		const ast: ASTLikeNode = [
			'document',
			[
				'paragraph',
				[
					['#link', { destination: '/url%C2%A0%22title%22', title: undefined }],
					'link',
				],
			],
		];
		const html = '<p><a href="/url%C2%A0%22title%22">link</a></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 508', async () => {
		const md = '[link](/url "title "and" title")';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', '[link](/url "title "and" title")'],
		];
		const html = '<p>[link](/url &quot;title &quot;and&quot; title&quot;)</p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 509', async () => {
		const md = `[link](/url 'title "and" title')`;
		const ast: ASTLikeNode = [
			'document',
			[
				'paragraph',
				[['#link', { destination: '/url', title: 'title "and" title' }], 'link'],
			],
		];
		const html =
			'<p><a href="/url" title="title &quot;and&quot; title">link</a></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 510', async () => {
		const md = '[link](   /uri\n  "title"  )';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', [['#link', { destination: '/uri', title: 'title' }], 'link']],
		];
		const html = '<p><a href="/uri" title="title">link</a></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 511', async () => {
		const md = '[link] (/uri)';
		const ast: ASTLikeNode = ['document', ['paragraph', '[link] (/uri)']];
		const html = '<p>[link] (/uri)</p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 512', async () => {
		const md = '[link [foo [bar]]](/uri)';
		const ast: ASTLikeNode = [
			'document',
			[
				'paragraph',
				[['#link', { destination: '/uri', title: undefined }], 'link [foo [bar]]'],
			],
		];
		const html = '<p><a href="/uri">link [foo [bar]]</a></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 513', async () => {
		const md = '[link] bar](/uri)';
		const ast: ASTLikeNode = ['document', ['paragraph', '[link] bar](/uri)']];
		const html = '<p>[link] bar](/uri)</p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 514', async () => {
		const md = '[link [bar](/uri)';
		const ast: ASTLikeNode = [
			'document',
			[
				'paragraph',
				'[link ',
				[['#link', { destination: '/uri', title: undefined }], 'bar'],
			],
		];
		const html = '<p>[link <a href="/uri">bar</a></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 515', async () => {
		const md = '[link \\[bar](/uri)';
		const ast: ASTLikeNode = [
			'document',
			[
				'paragraph',
				[
					['#link', { destination: '/uri', title: undefined }],
					'link ',
					['#escape'],
					'bar',
				],
			],
		];
		const html = '<p><a href="/uri">link [bar</a></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 516', async () => {
		const md = '[link *foo **bar** `#`*](/uri)';
		const ast: ASTLikeNode = [
			'document',
			[
				'paragraph',
				[
					['#link', { destination: '/uri', title: undefined }],
					'link ',
					['#emph', 'foo ', ['#strong', 'bar'], ' ', ['#code']],
				],
			],
		];
		const html =
			'<p><a href="/uri">link <em>foo <strong>bar</strong> <code>#</code></em></a></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 517', async () => {
		const md = '[![moon](moon.jpg)](/uri)';
		const ast: ASTLikeNode = [
			'document',
			[
				'paragraph',
				[
					['#link', { destination: '/uri' }],
					[['#image', { destination: 'moon.jpg' }], 'moon'],
				],
			],
		];
		const html = '<p><a href="/uri"><img src="moon.jpg" alt="moon"></a></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 518', async () => {
		const md = '[foo [bar](/uri)](/uri)';
		const ast: ASTLikeNode = [
			'document',
			[
				'paragraph',
				'[foo ',
				[['#link', { destination: '/uri', title: undefined }], 'bar'],
				'](/uri)',
			],
		];
		const html = '<p>[foo <a href="/uri">bar</a>](/uri)</p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 519', async () => {
		const md = '[foo *[bar [baz](/uri)](/uri)*](/uri)';
		const ast: ASTLikeNode = [
			'document',
			[
				'paragraph',
				'[foo ',
				[
					'#emph',
					'[bar ',
					[['#link', { destination: '/uri', title: undefined }], 'baz'],
					'](/uri)',
				],
				'](/uri)',
			],
		];
		const html = '<p>[foo <em>[bar <a href="/uri">baz</a>](/uri)</em>](/uri)</p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 520', async () => {
		const md = '![[[foo](uri1)](uri2)](uri3)';
		const ast: ASTLikeNode = [
			'document',
			[
				'paragraph',
				[['#image', { destination: 'uri3' }], '[', ['#link', 'foo'], '](uri2)'],
			],
		];
		const html = '<p><img src="uri3" alt="[foo](uri2)"></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 521', async () => {
		const md = '*[foo*](/uri)';
		const ast: ASTLikeNode = [
			'document',
			[
				'paragraph',
				'*',
				[['#link', { destination: '/uri', title: undefined }], 'foo*'],
			],
		];
		const html = '<p>*<a href="/uri">foo*</a></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 522', async () => {
		const md = '[foo *bar](baz*)';
		const ast: ASTLikeNode = [
			'document',
			[
				'paragraph',
				[['#link', { destination: 'baz*', title: undefined }], 'foo *bar'],
			],
		];
		const html = '<p><a href="baz*">foo *bar</a></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 523', async () => {
		const md = '*foo [bar* baz]';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', ['#emph', 'foo [bar'], ' baz]'],
		];
		const html = '<p><em>foo [bar</em> baz]</p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 524', async () => {
		const md = '[foo <bar attr="](baz)">';
		const ast: ASTLikeNode = ['document', ['paragraph', '[foo ', ['#html']]];
		const html = '<p>[foo <bar attr="](baz)"></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 525', async () => {
		const md = '[foo`](/uri)`';
		const ast: ASTLikeNode = ['document', ['paragraph', '[foo', ['#code']]];
		const html = '<p>[foo<code>](/uri)</code></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 526', async () => {
		const md = '[foo<https://example.com/?search=](uri)>';
		const ast: ASTLikeNode = ['document', ['paragraph', '[foo', ['#autolink']]];
		const html =
			'<p>[foo<a href="https://example.com/?search=%5D(uri)" target="_blank">https://example.com/?search=](uri)</a></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 527', async () => {
		const md = '[foo][bar]\n\n[bar]: /url "title"';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', [['#link', { destination: '/url', title: 'title' }], 'foo']],
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

	it('Example 528', async () => {
		const md = '[link [foo [bar]]][ref]\n\n[ref]: /uri';
		const ast: ASTLikeNode = [
			'document',
			[
				'paragraph',
				[['#link', { destination: '/uri', title: undefined }], 'link [foo [bar]]'],
			],
		];
		const html = '<p><a href="/uri">link [foo [bar]]</a></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 529', async () => {
		const md = '[link \\[bar][ref]\n\n[ref]: /uri';
		const ast: ASTLikeNode = [
			'document',
			[
				'paragraph',
				[
					['#link', { destination: '/uri', title: undefined }],
					'link ',
					['#escape'],
					'bar',
				],
			],
		];
		const html = '<p><a href="/uri">link [bar</a></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 530', async () => {
		const md = '[link *foo **bar** `#`*][ref]\n\n[ref]: /uri';
		const ast: ASTLikeNode = [
			'document',
			[
				'paragraph',
				[
					['#link', { destination: '/uri', title: undefined }],
					'link ',
					['#emph', 'foo ', ['#strong', 'bar'], ' ', ['#code']],
				],
			],
		];
		const html =
			'<p><a href="/uri">link <em>foo <strong>bar</strong> <code>#</code></em></a></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 531', async () => {
		const md = '[![moon](moon.jpg)][ref]\n\n[ref]: /uri';
		const ast: ASTLikeNode = [
			'document',
			[
				'paragraph',
				[
					['#link', { destination: '/uri', title: undefined }],
					['#image', 'moon'],
				],
			],
		];
		const html = '<p><a href="/uri"><img src="moon.jpg" alt="moon"></a></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 532', async () => {
		const md = '[foo [bar](/uri)][ref]\n\n[ref]: /uri';
		const ast: ASTLikeNode = [
			'document',
			[
				'paragraph',
				'[foo ',
				[['#link', { destination: '/uri', title: undefined }], 'bar'],
				']',
				[['#link', { destination: '/uri', title: undefined }], 'ref'],
			],
		];
		const html = '<p>[foo <a href="/uri">bar</a>]<a href="/uri">ref</a></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 533', async () => {
		const md = '[foo *bar [baz][ref]*][ref]\n\n[ref]: /uri';
		const ast: ASTLikeNode = [
			'document',
			[
				'paragraph',
				'[foo ',
				[
					'#emph',
					'bar ',
					[['#link', { destination: '/uri', title: undefined }], 'baz'],
				],
				']',
				[['#link', { destination: '/uri', title: undefined }], 'ref'],
			],
		];
		const html =
			'<p>[foo <em>bar <a href="/uri">baz</a></em>]<a href="/uri">ref</a></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 534', async () => {
		const md = '*[foo*][ref]\n\n[ref]: /uri';
		const ast: ASTLikeNode = [
			'document',
			[
				'paragraph',
				'*',
				[['#link', { destination: '/uri', title: undefined }], 'foo*'],
			],
		];
		const html = '<p>*<a href="/uri">foo*</a></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 535', async () => {
		const md = '[foo *bar][ref]*\n\n[ref]: /uri';
		const ast: ASTLikeNode = [
			'document',
			[
				'paragraph',
				[['#link', { destination: '/uri', title: undefined }], 'foo *bar'],
				'*',
			],
		];
		const html = '<p><a href="/uri">foo *bar</a>*</p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 536', async () => {
		const md = '[foo <bar attr="][ref]">\n\n[ref]: /uri';
		const ast: ASTLikeNode = ['document', ['paragraph', '[foo ', ['#html']]];
		const html = '<p>[foo <bar attr="][ref]"></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 537', async () => {
		const md = '[foo`][ref]`\n\n[ref]: /uri';
		const ast: ASTLikeNode = ['document', ['paragraph', '[foo', ['#code']]];
		const html = '<p>[foo<code>][ref]</code></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 538', async () => {
		const md = '[foo<https://example.com/?search=][ref]>\n\n[ref]: /uri';
		const ast: ASTLikeNode = ['document', ['paragraph', '[foo', ['#autolink']]];
		const html =
			'<p>[foo<a href="https://example.com/?search=%5D%5Bref%5D" target="_blank">https://example.com/?search=][ref]</a></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 539', async () => {
		const md = '[foo][BaR]\n\n[bar]: /url "title"';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', [['#link', { destination: '/url', title: 'title' }], 'foo']],
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

	it('Example 540', async () => {
		const md = '[ẞ]\n\n[SS]: /url';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', [['#link', { destination: '/url', title: undefined }], 'ẞ']],
		];
		const html = '<p><a href="/url">ẞ</a></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 541', async () => {
		const md = '[Foo\n  bar]: /url\n\n[Baz][Foo bar]';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', [['#link', { destination: '/url', title: undefined }], 'Baz']],
		];
		const html = '<p><a href="/url">Baz</a></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 542', async () => {
		const md = '[foo] [bar]\n\n[bar]: /url "title"';
		const ast: ASTLikeNode = [
			'document',
			[
				'paragraph',
				'[foo] ',
				[['#link', { destination: '/url', title: 'title' }], 'bar'],
			],
		];
		const html = '<p>[foo] <a href="/url" title="title">bar</a></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 543', async () => {
		const md = '[foo]\n[bar]\n\n[bar]: /url "title"';
		const ast: ASTLikeNode = [
			'document',
			[
				'paragraph',
				'[foo]',
				['#softbreak'],
				[['#link', { destination: '/url', title: 'title' }], 'bar'],
			],
		];
		const html = `<p>[foo]
<a href="/url" title="title">bar</a></p>`;
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 544', async () => {
		const md = '[foo]: /url1\n\n[foo]: /url2\n\n[bar][foo]';
		const ast: ASTLikeNode = [
			'document',
			[
				'paragraph',
				[['#link', { destination: '/url1', title: undefined }], 'bar'],
			],
		];
		const html = '<p><a href="/url1">bar</a></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 545', async () => {
		const md = '[bar][foo\\!]\n\n[foo!]: /url';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', '[bar][foo', ['#escape'], ']'],
		];
		const html = '<p>[bar][foo!]</p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 546', async () => {
		const md = '[foo][ref[]\n\n[ref[]: /uri';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', '[foo][ref[]'],
			['paragraph', '[ref[]: /uri'],
		];
		const html = '<p>[foo][ref[]</p><p>[ref[]: /uri</p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 547', async () => {
		const md = '[foo][ref[bar]]\n\n[ref[bar]]: /uri';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', '[foo][ref[bar]]'],
			['paragraph', '[ref[bar]]: /uri'],
		];
		const html = '<p>[foo][ref[bar]]</p><p>[ref[bar]]: /uri</p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 548', async () => {
		const md = '[[[foo]]]\n\n[[[foo]]]: /url';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', '[[[foo]]]'],
			['paragraph', '[[[foo]]]: /url'],
		];
		const html = '<p>[[[foo]]]</p><p>[[[foo]]]: /url</p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 549', async () => {
		const md = '[foo][ref\\[]\n\n[ref\\[]: /uri';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', [['#link', { destination: '/uri', title: undefined }], 'foo']],
		];
		const html = '<p><a href="/uri">foo</a></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 550', async () => {
		const md = '[bar\\\\]: /uri\n\n[bar\\\\]';
		const ast: ASTLikeNode = [
			'document',
			[
				'paragraph',
				[['#link', { destination: '/uri', title: undefined }], 'bar', ['#escape']],
			],
		];
		const html = '<p><a href="/uri">bar\\</a></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 551', async () => {
		const md = '[]\n\n[]: /uri';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', '[]'],
			['paragraph', '[]: /uri'],
		];
		const html = '<p>[]</p><p>[]: /uri</p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 552', async () => {
		const md = '[\n ]\n\n[\n ]: /uri';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', '[', ['#softbreak'], ']'],
			['paragraph', '[', ['#softbreak'], ']: /uri'],
		];
		const html = `<p>[
]</p><p>[
]: /uri</p>`;
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 553', async () => {
		const md = '[foo][]\n\n[foo]: /url "title"';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', [['#link', { destination: '/url', title: 'title' }], 'foo']],
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

	it('Example 554', async () => {
		const md = '[*foo* bar][]\n\n[*foo* bar]: /url "title"';
		const ast: ASTLikeNode = [
			'document',
			[
				'paragraph',
				[
					['#link', { destination: '/url', title: 'title' }],
					['#emph', 'foo'],
					' bar',
				],
			],
		];
		const html = '<p><a href="/url" title="title"><em>foo</em> bar</a></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 555', async () => {
		const md = '[Foo][]\n\n[foo]: /url "title"';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', [['#link', { destination: '/url', title: 'title' }], 'Foo']],
		];
		const html = '<p><a href="/url" title="title">Foo</a></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 556', async () => {
		const md = '[foo] \n[]\n\n[foo]: /url "title"';
		const ast: ASTLikeNode = [
			'document',
			[
				'paragraph',
				[['#link', { destination: '/url', title: 'title' }], 'foo'],
				['#softbreak'],
				'[]',
			],
		];
		const html = `<p><a href="/url" title="title">foo</a>
[]</p>`;
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 557', async () => {
		const md = '[foo]\n\n[foo]: /url "title"';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', [['#link', { destination: '/url', title: 'title' }], 'foo']],
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

	it('Example 558', async () => {
		const md = '[*foo* bar]\n\n[*foo* bar]: /url "title"';
		const ast: ASTLikeNode = [
			'document',
			[
				'paragraph',
				[
					['#link', { destination: '/url', title: 'title' }],
					['#emph', 'foo'],
					' bar',
				],
			],
		];
		const html = '<p><a href="/url" title="title"><em>foo</em> bar</a></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 559', async () => {
		const md = '[[*foo* bar]]\n\n[*foo* bar]: /url "title"';
		const ast: ASTLikeNode = [
			'document',
			[
				'paragraph',
				'[',
				[
					['#link', { destination: '/url', title: 'title' }],
					['#emph', 'foo'],
					' bar',
				],
				']',
			],
		];
		const html = '<p>[<a href="/url" title="title"><em>foo</em> bar</a>]</p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 560', async () => {
		const md = '[[bar [foo]\n\n[foo]: /url';
		const ast: ASTLikeNode = [
			'document',
			[
				'paragraph',
				'[[bar ',
				[['#link', { destination: '/url', title: undefined }], 'foo'],
			],
		];
		const html = '<p>[[bar <a href="/url">foo</a></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 561', async () => {
		const md = '[Foo]\n\n[foo]: /url "title"';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', [['#link', { destination: '/url', title: 'title' }], 'Foo']],
		];
		const html = '<p><a href="/url" title="title">Foo</a></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 562', async () => {
		const md = '[foo] bar\n\n[foo]: /url';
		const ast: ASTLikeNode = [
			'document',
			[
				'paragraph',
				[['#link', { destination: '/url', title: undefined }], 'foo'],
				' bar',
			],
		];
		const html = '<p><a href="/url">foo</a> bar</p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 563', async () => {
		const md = '\\[foo]\n\n[foo]: /url "title"';
		const ast: ASTLikeNode = ['document', ['paragraph', ['#escape'], 'foo]']];
		const html = '<p>[foo]</p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 564', async () => {
		const md = '[foo*]: /url\n\n*[foo*]';
		const ast: ASTLikeNode = [
			'document',
			[
				'paragraph',
				'*',
				[['#link', { destination: '/url', title: undefined }], 'foo*'],
			],
		];
		const html = '<p>*<a href="/url">foo*</a></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 565', async () => {
		const md = '[foo][bar]\n\n[foo]: /url1\n[bar]: /url2';
		const ast: ASTLikeNode = [
			'document',
			[
				'paragraph',
				[['#link', { destination: '/url2', title: undefined }], 'foo'],
			],
		];
		const html = '<p><a href="/url2">foo</a></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 566', async () => {
		const md = '[foo][]\n\n[foo]: /url1';
		const ast: ASTLikeNode = [
			'document',
			[
				'paragraph',
				[['#link', { destination: '/url1', title: undefined }], 'foo'],
			],
		];
		const html = '<p><a href="/url1">foo</a></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 567', async () => {
		const md = '[foo]()\n\n[foo]: /url1';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', [['#link', { destination: '', title: undefined }], 'foo']],
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

	it('Example 568', async () => {
		const md = '[foo](not a link)\n\n[foo]: /url1';
		const ast: ASTLikeNode = [
			'document',
			[
				'paragraph',
				[['#link', { destination: '/url1', title: undefined }], 'foo'],
				'(not a link)',
			],
		];
		const html = '<p><a href="/url1">foo</a>(not a link)</p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 569', async () => {
		const md = '[foo][bar][baz]\n\n[baz]: /url';
		const ast: ASTLikeNode = [
			'document',
			[
				'paragraph',
				'[foo]',
				[['#link', { destination: '/url', title: undefined }], 'bar'],
			],
		];
		const html = '<p>[foo]<a href="/url">bar</a></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 570', async () => {
		const md = '[foo][bar][baz]\n\n[baz]: /url1\n[bar]: /url2';
		const ast: ASTLikeNode = [
			'document',
			[
				'paragraph',
				[['#link', { destination: '/url2', title: undefined }], 'foo'],
				[['#link', { destination: '/url1', title: undefined }], 'baz'],
			],
		];
		const html = '<p><a href="/url2">foo</a><a href="/url1">baz</a></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 571', async () => {
		const md = '[foo][bar][baz]\n\n[baz]: /url1\n[foo]: /url2';
		const ast: ASTLikeNode = [
			'document',
			[
				'paragraph',
				'[foo]',
				[['#link', { destination: '/url1', title: undefined }], 'bar'],
			],
		];
		const html = '<p>[foo]<a href="/url1">bar</a></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});
});
