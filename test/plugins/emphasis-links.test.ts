/** @see https://spec.commonmark.org/0.31.2/#atx-headings */

import { describe, expect, it } from 'vitest';
import { EzalMarkdown } from '../../src';
import { emphasisAndLink } from '../../src/plugins/emphasis-links';
import { ASTLikeNode, initAstMatcher } from '../ast';

initAstMatcher();

describe('Plugin: emphasis-links', () => {
	it('targetResolver', async () => {
		const md = `[foo](/url1)

[bar][baz]

[bim][]

[boo]

[baz]: /url2
[bim]: /url3
[boo]: /url4`;
		const ast: ASTLikeNode = [
			'document',
			[
				'paragraph',
				[['#link', { label: undefined, destination: '/url1' }], 'foo'],
			],
			['paragraph', [['#link', { label: 'BAZ', destination: '/url2' }], 'bar']],
			['paragraph', [['#link', { label: 'BIM', destination: '/url3' }], 'bim']],
			['paragraph', [['#link', { label: 'BOO', destination: '/url4' }], 'boo']],
		];
		const html = `<p><a href="/url1" target="_parent">foo</a></p><p><a href="/url2" target="_parent">bar</a></p><p><a href="/url3" target="_parent">bim</a></p><p><a href="/url4" target="_parent">boo</a></p>`;
		const renderer = new EzalMarkdown();
		renderer.set(
			emphasisAndLink({
				targetResolver: () => 'parent',
			}),
		);
		const result = await renderer.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await renderer.renderHTML(result.document, result.options);
		expect(rendered.html).toBe(html);
	});

	it('disableEmphasis', async () => {
		const md = '**strong**~~del~~';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', '**strong**', ['#del', 'del']],
		];
		const html = '<p>**strong**<del>del</del></p>';
		const renderer = new EzalMarkdown();
		renderer.set(emphasisAndLink({ disableEmphasis: true }));
		const result = await renderer.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await renderer.renderHTML(result.document, result.options);
		expect(rendered.html).toBe(html);
	});

	it('disableLinks', async () => {
		const md = '[]()![]()';
		const ast: ASTLikeNode = ['document', ['paragraph', '[]()', ['#image']]];
		const html = '<p>[]()<img></p>';
		const renderer = new EzalMarkdown();
		renderer.set(emphasisAndLink({ disableLinks: true }));
		const result = await renderer.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await renderer.renderHTML(result.document, result.options);
		expect(rendered.html).toBe(html);
	});

	it('disableImages', async () => {
		const md = '[]()![]()';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', ['#link'], '!', ['#link']],
		];
		const html = '<p><a></a>!<a></a></p>';
		const renderer = new EzalMarkdown();
		renderer.set(emphasisAndLink({ disableImages: true }));
		const result = await renderer.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await renderer.renderHTML(result.document, result.options);
		expect(rendered.html).toBe(html);
	});

	it('disableStrikethrough', async () => {
		const md = '**strong**~~del~~';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', ['#strong', 'strong'], '~~del~~'],
		];
		const html = '<p><strong>strong</strong>~~del~~</p>';
		const renderer = new EzalMarkdown();
		renderer.set(emphasisAndLink({ disableStrikethrough: true }));
		const result = await renderer.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await renderer.renderHTML(result.document, result.options);
		expect(rendered.html).toBe(html);
	});
});
