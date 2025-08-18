/** @see https://spec.commonmark.org/0.31.2/#images */

import { describe, expect, it } from 'vitest';
import { EzalMarkdown } from '../../src';
import { ASTLikeNode, initAstMatcher } from '../ast';

initAstMatcher();

describe('CommonMark: Images', () => {
	it('Example 572', async () => {
		const md = '![foo](/url "title")';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', [['#image', { destination: '/url', title: 'title' }], 'foo']],
		];
		const html = '<p><img src="/url" title="title" alt="foo"></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 573', async () => {
		const md = '![foo *bar*]\n\n[foo *bar*]: train.jpg "train & tracks"';
		const ast: ASTLikeNode = [
			'document',
			[
				'paragraph',
				[
					['#image', { destination: 'train.jpg', title: 'train & tracks' }],
					'foo ',
					['#emph', 'bar'],
				],
			],
		];
		const html =
			'<p><img src="train.jpg" title="train &amp; tracks" alt="foo bar"></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 574', async () => {
		const md = '![foo ![bar](/url)](/url2)';
		const ast: ASTLikeNode = [
			'document',
			[
				'paragraph',
				[
					['#image', { destination: '/url2', title: undefined }],
					'foo ',
					[['#image', { destination: '/url', title: undefined }], 'bar'],
				],
			],
		];
		const html = '<p><img src="/url2" alt="foo "></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 575', async () => {
		const md = '![foo [bar](/url)](/url2)';
		const ast: ASTLikeNode = [
			'document',
			[
				'paragraph',
				[
					['#image', { destination: '/url2', title: undefined }],
					'foo ',
					['#link', 'bar'],
				],
			],
		];
		const html = '<p><img src="/url2" alt="foo bar"></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 576', async () => {
		const md = '![foo *bar*][]\n\n[foo *bar*]: train.jpg "train & tracks"';
		const ast: ASTLikeNode = [
			'document',
			[
				'paragraph',
				[
					['#image', { destination: 'train.jpg', title: 'train & tracks' }],
					'foo ',
					['#emph', 'bar'],
				],
			],
		];
		const html =
			'<p><img src="train.jpg" title="train &amp; tracks" alt="foo bar"></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 577', async () => {
		const md = '![foo *bar*][foobar]\n\n[FOOBAR]: train.jpg "train & tracks"';
		const ast: ASTLikeNode = [
			'document',
			[
				'paragraph',
				[
					['#image', { destination: 'train.jpg', title: 'train & tracks' }],
					'foo ',
					['#emph', 'bar'],
				],
			],
		];
		const html =
			'<p><img src="train.jpg" title="train &amp; tracks" alt="foo bar"></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 578', async () => {
		const md = '![foo](train.jpg)';
		const ast: ASTLikeNode = [
			'document',
			[
				'paragraph',
				[['#image', { destination: 'train.jpg', title: undefined }], 'foo'],
			],
		];
		const html = '<p><img src="train.jpg" alt="foo"></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 579', async () => {
		const md = 'My ![foo bar](/path/to/train.jpg  "title"   )';
		const ast: ASTLikeNode = [
			'document',
			[
				'paragraph',
				'My ',
				[
					['#image', { destination: '/path/to/train.jpg', title: 'title' }],
					'foo bar',
				],
			],
		];
		const html =
			'<p>My <img src="/path/to/train.jpg" title="title" alt="foo bar"></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 580', async () => {
		const md = '![foo](<url>)';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', [['#image', { destination: 'url', title: undefined }], 'foo']],
		];
		const html = '<p><img src="url" alt="foo"></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 581', async () => {
		const md = '![](/url)';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', [['#image', { destination: '/url', title: undefined }]]],
		];
		const html = '<p><img src="/url"></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 582', async () => {
		const md = '![foo][bar]\n\n[bar]: /url';
		const ast: ASTLikeNode = [
			'document',
			[
				'paragraph',
				[['#image', { destination: '/url', title: undefined }], 'foo'],
			],
		];
		const html = '<p><img src="/url" alt="foo"></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 583', async () => {
		const md = '![foo][bar]\n\n[BAR]: /url';
		const ast: ASTLikeNode = [
			'document',
			[
				'paragraph',
				[['#image', { destination: '/url', title: undefined }], 'foo'],
			],
		];
		const html = '<p><img src="/url" alt="foo"></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 584', async () => {
		const md = '![foo][]\n\n[foo]: /url "title"';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', [['#image', { destination: '/url', title: 'title' }], 'foo']],
		];
		const html = '<p><img src="/url" title="title" alt="foo"></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 585', async () => {
		const md = '![*foo* bar][]\n\n[*foo* bar]: /url "title"';
		const ast: ASTLikeNode = [
			'document',
			[
				'paragraph',
				[
					['#image', { destination: '/url', title: 'title' }],
					['#emph', 'foo'],
					' bar',
				],
			],
		];
		const html = '<p><img src="/url" title="title" alt="foo bar"></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 586', async () => {
		const md = '![Foo][]\n\n[foo]: /url "title"';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', [['#image', { destination: '/url', title: 'title' }], 'Foo']],
		];
		const html = '<p><img src="/url" title="title" alt="Foo"></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 587', async () => {
		const md = '![foo] \n[]\n\n[foo]: /url "title"';
		const ast: ASTLikeNode = [
			'document',
			[
				'paragraph',
				[['#image', { destination: '/url', title: 'title' }], 'foo'],
				['#softbreak'],
				'[]',
			],
		];
		const html = `<p><img src="/url" title="title" alt="foo">
[]</p>`;
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 588', async () => {
		const md = '![foo]\n\n[foo]: /url "title"';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', [['#image', { destination: '/url', title: 'title' }], 'foo']],
		];
		const html = '<p><img src="/url" title="title" alt="foo"></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 589', async () => {
		const md = '![*foo* bar]\n\n[*foo* bar]: /url "title"';
		const ast: ASTLikeNode = [
			'document',
			[
				'paragraph',
				[
					['#image', { destination: '/url', title: 'title' }],
					['#emph', 'foo'],
					' bar',
				],
			],
		];
		const html = '<p><img src="/url" title="title" alt="foo bar"></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 590', async () => {
		const md = '![[foo]]\n\n[[foo]]: /url "title"';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', '![[foo]]'],
			['paragraph', '[[foo]]: /url "title"'],
		];
		const html = '<p>![[foo]]</p><p>[[foo]]: /url &quot;title&quot;</p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 591', async () => {
		const md = '![Foo]\n\n[foo]: /url "title"';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', [['#image', { destination: '/url', title: 'title' }], 'Foo']],
		];
		const html = '<p><img src="/url" title="title" alt="Foo"></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 592', async () => {
		const md = '!\\[foo]\n\n[foo]: /url "title"';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', '!', ['#escape'], 'foo]'],
		];
		const html = '<p>![foo]</p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 593', async () => {
		const md = '\\![foo]\n\n[foo]: /url "title"';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', ['#escape'], ['#link', 'foo']],
		];
		const html = '<p>!<a href="/url" title="title">foo</a></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});
});
