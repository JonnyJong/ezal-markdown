/** @see https://spec.commonmark.org/0.31.2/#code-spans */

import { describe, expect, it } from 'vitest';
import { EzalMarkdown } from '../../src';
import { ASTLikeNode, initAstMatcher } from '../ast';

initAstMatcher();

describe('CommonMark: Code spans', () => {
	it('Example 328', async () => {
		const md = '`foo`';
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

	it('Example 329', async () => {
		const md = '`` foo ` bar ``';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', [['#code', { code: 'foo ` bar' }]]],
		];
		const html = '<p><code>foo ` bar</code></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 330', async () => {
		const md = '` `` `';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', [['#code', { code: '``' }]]],
		];
		const html = '<p><code>``</code></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 331', async () => {
		const md = '`  ``  `';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', [['#code', { code: ' `` ' }]]],
		];
		const html = '<p><code> `` </code></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 332', async () => {
		const md = '` a`';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', [['#code', { code: ' a' }]]],
		];
		const html = '<p><code> a</code></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 333', async () => {
		const md = '`\u00A0b\u00A0`';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', [['#code', { code: '\u00A0b\u00A0' }]]],
		];
		const html = '<p><code>\u00A0b\u00A0</code></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 334', async () => {
		const md = '`\u00A0`\n`  `';
		const ast: ASTLikeNode = [
			'document',
			[
				'paragraph',
				[['#code', { code: '\u00A0' }]],
				['#softbreak'],
				[['#code', { code: '  ' }]],
			],
		];
		const html = `<p><code>\u00A0</code>
<code>  </code></p>`;
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 335', async () => {
		const md = '``\nfoo\nbar  \nbaz\n``';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', [['#code', { code: 'foo bar   baz' }]]],
		];
		const html = '<p><code>foo bar   baz</code></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 336', async () => {
		const md = '``\nfoo \n``';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', [['#code', { code: 'foo ' }]]],
		];
		const html = '<p><code>foo </code></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 337', async () => {
		const md = '`foo   bar \nbaz`';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', [['#code', { code: 'foo   bar  baz' }]]],
		];
		const html = '<p><code>foo   bar  baz</code></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 338', async () => {
		const md = '`foo\\`bar`';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', [['#code', { code: 'foo\\' }]], 'bar`'],
		];
		const html = '<p><code>foo\\</code>bar`</p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 339', async () => {
		const md = '``foo`bar``';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', [['#code', { code: 'foo`bar' }]]],
		];
		const html = '<p><code>foo`bar</code></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 340', async () => {
		const md = '` foo `` bar `';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', [['#code', { code: 'foo `` bar' }]]],
		];
		const html = '<p><code>foo `` bar</code></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 341', async () => {
		const md = '*foo`*`';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', '*foo', [['#code', { code: '*' }]]],
		];
		const html = '<p>*foo<code>*</code></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 342', async () => {
		const md = '[not a `link](/foo`)';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', '[not a ', [['#code', { code: 'link](/foo' }]], ')'],
		];
		const html = '<p>[not a <code>link](/foo</code>)</p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 343', async () => {
		const md = '`<a href="`">`';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', [['#code', { code: '<a href="' }]], '">`'],
		];
		const html = '<p><code>&lt;a href=&quot;</code>&quot;&gt;`</p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 344', async () => {
		const md = '<a href="`">`';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', [['#html', { raw: '<a href="`">' }]], '`'],
		];
		const html = '<p><a href="`">`</p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 345', async () => {
		const md = '`<https://foo.bar.`baz>`';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', [['#code', { code: '<https://foo.bar.' }]], 'baz>`'],
		];
		const html = '<p><code>&lt;https://foo.bar.</code>baz&gt;`</p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 346', async () => {
		const md = '<https://foo.bar.`baz>`';
		const ast: ASTLikeNode = ['document', ['paragraph', ['#autolink'], '`']];
		const html =
			'<p><a href="https://foo.bar.%60baz" target="_blank">https://foo.bar.`baz</a>`</p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 347', async () => {
		const md = '```foo``';
		const ast: ASTLikeNode = ['document', ['paragraph', md]];
		const html = '<p>```foo``</p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 348', async () => {
		const md = '`foo';
		const ast: ASTLikeNode = ['document', ['paragraph', md]];
		const html = '<p>`foo</p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 349', async () => {
		const md = '`foo``bar``';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', '`foo', [['#code', { code: 'bar' }]]],
		];
		const html = '<p>`foo<code>bar</code></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});
});
