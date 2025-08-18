/** @see https://spec.commonmark.org/0.31.2/#atx-headings */

import { describe, expect, it } from 'vitest';
import { EzalMarkdown } from '../../src';
import { ASTLikeNode, initAstMatcher } from '../ast';

initAstMatcher();

describe('CommonMark: ATX headings', () => {
	it('Example 62', async () => {
		const md = '# foo\n## foo\n### foo\n#### foo\n##### foo\n###### foo';
		const ast: ASTLikeNode = [
			'document',
			[
				['atx-heading', { level: 1 }],
				['#item', 'foo'],
			],
			[
				['atx-heading', { level: 2 }],
				['#item', 'foo'],
			],
			[
				['atx-heading', { level: 3 }],
				['#item', 'foo'],
			],
			[
				['atx-heading', { level: 4 }],
				['#item', 'foo'],
			],
			[
				['atx-heading', { level: 5 }],
				['#item', 'foo'],
			],
			[
				['atx-heading', { level: 6 }],
				['#item', 'foo'],
			],
		];
		const html =
			'<h1 id="foo">foo</h1><h2 id="foo-1">foo</h2><h3 id="foo-2">foo</h3><h4 id="foo-3">foo</h4><h5 id="foo-4">foo</h5><h6 id="foo-5">foo</h6>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 63', async () => {
		const md = '####### foo';
		const ast: ASTLikeNode = ['document', ['paragraph', '####### foo']];
		const html = '<p>####### foo</p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 64', async () => {
		const md = '#5 bolt\n\n#hashtag';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', '#5 bolt'],
			['paragraph', '#hashtag'],
		];
		const html = '<p>#5 bolt</p><p>#hashtag</p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 65', async () => {
		const md = '\\## foo';
		const ast: ASTLikeNode = ['document', ['paragraph', ['#escape'], '# foo']];
		const html = '<p>## foo</p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 66', async () => {
		const md = '# foo *bar* \\*baz\\*';
		const ast: ASTLikeNode = [
			'document',
			[
				['atx-heading', { level: 1 }],
				['#item', 'foo ', ['#emph', 'bar'], ' ', ['#escape'], 'baz', ['#escape']],
			],
		];
		const html = '<h1 id="foo-bar-baz">foo <em>bar</em> *baz*</h1>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 67', async () => {
		const md = '#                  foo                     ';
		const ast: ASTLikeNode = [
			'document',
			[
				['atx-heading', { level: 1 }],
				['#item', 'foo'],
			],
		];
		const html = '<h1 id="foo">foo</h1>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 68', async () => {
		const md = ' ### foo\n  ## foo\n   # foo';
		const ast: ASTLikeNode = [
			'document',
			[
				['atx-heading', { level: 3 }],
				['#item', 'foo'],
			],
			[
				['atx-heading', { level: 2 }],
				['#item', 'foo'],
			],
			[
				['atx-heading', { level: 1 }],
				['#item', 'foo'],
			],
		];
		const html =
			'<h3 id="foo">foo</h3><h2 id="foo-1">foo</h2><h1 id="foo-2">foo</h1>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 69', async () => {
		const md = '    # foo';
		const ast: ASTLikeNode = ['document', ['indented-codeblock']];
		const html = '<pre><code># foo</code></pre>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 70', async () => {
		const md = 'foo\n    # bar';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', 'foo', ['#softbreak'], '# bar'],
		];
		const html = '<p>foo\n# bar</p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 71', async () => {
		const md = '## foo ##\n  ###   bar    ###';
		const ast: ASTLikeNode = [
			'document',
			[
				['atx-heading', { level: 2 }],
				['#item', 'foo'],
			],
			[
				['atx-heading', { level: 3 }],
				['#item', 'bar'],
			],
		];
		const html = '<h2 id="foo">foo</h2><h3 id="bar">bar</h3>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 72', async () => {
		const md = '# foo ##################################\n##### foo ##';
		const ast: ASTLikeNode = [
			'document',
			[
				['atx-heading', { level: 1 }],
				['#item', 'foo'],
			],
			[
				['atx-heading', { level: 5 }],
				['#item', 'foo'],
			],
		];
		const html = '<h1 id="foo">foo</h1><h5 id="foo-1">foo</h5>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 73', async () => {
		const md = '### foo ###     ';
		const ast: ASTLikeNode = [
			'document',
			[
				['atx-heading', { level: 3 }],
				['#item', 'foo'],
			],
		];
		const html = '<h3 id="foo">foo</h3>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 74', async () => {
		const md = '### foo ### b';
		const ast: ASTLikeNode = [
			'document',
			[
				['atx-heading', { level: 3 }],
				['#item', 'foo ### b'],
			],
		];
		const html = '<h3 id="foo--b">foo ### b</h3>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 75', async () => {
		const md = '# foo#';
		const ast: ASTLikeNode = [
			'document',
			[
				['atx-heading', { level: 1 }],
				['#item', 'foo#'],
			],
		];
		const html = '<h1 id="foo">foo#</h1>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 76', async () => {
		const md = '### foo \\###\n## foo #\\##\n# foo \\#';
		const ast: ASTLikeNode = [
			'document',
			[
				['atx-heading', { level: 3 }],
				['#item', 'foo ', ['#escape'], '##'],
			],
			[
				['atx-heading', { level: 2 }],
				['#item', 'foo #', ['#escape'], '#'],
			],
			[
				['atx-heading', { level: 1 }],
				['#item', 'foo ', ['#escape']],
			],
		];
		const html =
			'<h3 id="foo">foo ###</h3><h2 id="foo-1">foo ###</h2><h1 id="foo-2">foo #</h1>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 77', async () => {
		const md = '****\n## foo\n****';
		const ast: ASTLikeNode = [
			'document',
			['thematic-break'],
			[
				['atx-heading', { level: 2 }],
				['#item', 'foo'],
			],
			['thematic-break'],
		];
		const html = '<hr><h2 id="foo">foo</h2><hr>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 78', async () => {
		const md = 'Foo bar\n# baz\nBar foo';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', 'Foo bar'],
			[
				['atx-heading', { level: 1 }],
				['#item', 'baz'],
			],
			['paragraph', 'Bar foo'],
		];
		const html = '<p>Foo bar</p><h1 id="baz">baz</h1><p>Bar foo</p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 79', async () => {
		const md = '## \n#\n### ###';
		const ast: ASTLikeNode = [
			'document',
			[['atx-heading', { level: 2 }], ['#item']],
			['paragraph', '#'],
			[['atx-heading', { level: 3 }], ['#item']],
		];
		const html = '<h2></h2><p>#</p><h3 id="-1"></h3>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});
});
