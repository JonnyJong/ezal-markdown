/** @see https://spec.commonmark.org/0.31.2/#paragraphs */

import { describe, expect, it } from 'vitest';
import { EzalMarkdown } from '../../src';
import { ASTLikeNode, initAstMatcher } from '../ast';

initAstMatcher();

describe('CommonMark: Paragraphs', () => {
	it('Example 219', async () => {
		const md = 'aaa\n\nbbb';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', 'aaa'],
			['paragraph', 'bbb'],
		];
		const html = '<p>aaa</p><p>bbb</p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 220', async () => {
		const md = 'aaa\nbbb\n\nccc\nddd';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', 'aaa', ['#softbreak'], 'bbb'],
			['paragraph', 'ccc', ['#softbreak'], 'ddd'],
		];
		const html = `<p>aaa
bbb</p><p>ccc
ddd</p>`;
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 221', async () => {
		const md = 'aaa\n\n\nbbb';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', 'aaa'],
			['paragraph', 'bbb'],
		];
		const html = '<p>aaa</p><p>bbb</p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 222', async () => {
		const md = '  aaa\n bbb';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', 'aaa', ['#softbreak'], 'bbb'],
		];
		const html = `<p>aaa
bbb</p>`;
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 223', async () => {
		const md =
			'aaa\n             bbb\n                                       ccc';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', 'aaa', ['#softbreak'], 'bbb', ['#softbreak'], 'ccc'],
		];
		const html = `<p>aaa
bbb
ccc</p>`;
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 224', async () => {
		const md = '   aaa\nbbb';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', 'aaa', ['#softbreak'], 'bbb'],
		];
		const html = `<p>aaa
bbb</p>`;
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 225', async () => {
		const md = '    aaa\nbbb';
		const ast: ASTLikeNode = [
			'document',
			['indented-codeblock'],
			['paragraph', 'bbb'],
		];
		const html = `<pre><code>aaa
</code></pre><p>bbb</p>`;
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 226', async () => {
		const md = 'aaa     \nbbb     ';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', 'aaa', ['#linebreak'], 'bbb'],
		];
		const html = '<p>aaa<br>bbb</p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});
});
