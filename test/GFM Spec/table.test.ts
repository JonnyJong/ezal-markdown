/** @see https://github.github.com/gfm/#tables-extension- */

import { describe, expect, it } from 'vitest';
import { EzalMarkdown } from '../../src';
import { ASTLikeNode, initAstMatcher } from '../ast';

initAstMatcher();

describe('GFM: Table', () => {
	it('Example 198', async () => {
		const md = `| foo | bar |
| --- | --- |
| baz | bim |`;
		const ast: ASTLikeNode = [
			'document',
			[
				['table', { align: [undefined, undefined] }],
				['#item', 'foo'],
				['#item', 'bar'],
				['#item', 'baz'],
				['#item', 'bim'],
			],
		];
		const html =
			'<table><thead><th>foo</th><th>bar</th></thead><tbody><tr><td>baz</td><td>bim</td></tr></tbody></table>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 199', async () => {
		const md = `| abc | defghi |
:-: | -----------:
bar | baz`;
		const ast: ASTLikeNode = [
			'document',
			[
				['table', { align: ['center', 'right'] }],
				['#item', 'abc'],
				['#item', 'defghi'],
				['#item', 'bar'],
				['#item', 'baz'],
			],
		];
		const html =
			'<table><thead><th style="text-align:center;">abc</th><th style="text-align:right;">defghi</th></thead><tbody><tr><td style="text-align:center;">bar</td><td style="text-align:right;">baz</td></tr></tbody></table>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 200', async () => {
		const md = `| f\\|oo  |
| ------ |
| b \`\\|\` az |
| b **\\|** im |`;
		const ast: ASTLikeNode = [
			'document',
			[
				['table', { align: [undefined] }],
				['#item', 'f', [['#escape', { char: '|' }]], 'oo'],
				['#item', 'b ', ['#code'], ' az'],
				['#item', 'b ', ['#strong', [['#escape', { char: '|' }]]], ' im'],
			],
		];
		const html =
			'<table><thead><th>f|oo</th></thead><tbody><tr><td>b <code>\\|</code> az</td></tr><tr><td>b <strong>|</strong> im</td></tr></tbody></table>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 201', async () => {
		const md = `| abc | def |
| --- | --- |
| bar | baz |
> bar`;
		const ast: ASTLikeNode = [
			'document',
			[
				['table', { align: [undefined, undefined] }],
				['#item', 'abc'],
				['#item', 'def'],
				['#item', 'bar'],
				['#item', 'baz'],
			],
			['blockquote', ['item', ['paragraph', 'bar']]],
		];
		const html =
			'<table><thead><th>abc</th><th>def</th></thead><tbody><tr><td>bar</td><td>baz</td></tr></tbody></table><blockquote><p>bar</p></blockquote>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 202', async () => {
		const md = `| abc | def |
| --- | --- |
| bar | baz |
bar

bar`;
		const ast: ASTLikeNode = [
			'document',
			[
				['table', { align: [undefined, undefined] }],
				['#item', 'abc'],
				['#item', 'def'],
				['#item', 'bar'],
				['#item', 'baz'],
				['#item', 'bar'],
			],
			['paragraph', 'bar'],
		];
		const html =
			'<table><thead><th>abc</th><th>def</th></thead><tbody><tr><td>bar</td><td>baz</td></tr><tr><td>bar</td></tr></tbody></table><p>bar</p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 203', async () => {
		const md = `| abc | def |
| --- |
| bar |`;
		const ast: ASTLikeNode = [
			'document',
			[
				'paragraph',
				'| abc | def |',
				['#softbreak'],
				'| --- |',
				['#softbreak'],
				'| bar |',
			],
		];
		const html = `<p>| abc | def |
| --- |
| bar |</p>`;
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 204', async () => {
		const md = `| abc | def |
| --- | --- |
| bar |
| bar | baz | boo |`;
		const ast: ASTLikeNode = [
			'document',
			[
				['table', { align: [undefined, undefined] }],
				['#item', 'abc'],
				['#item', 'def'],
				['#item', 'bar'],
				['#item', 'bar'],
				['#item', 'baz'],
				['#item', 'boo'],
			],
		];
		const html =
			'<table><thead><th>abc</th><th>def</th></thead><tbody><tr><td>bar</td></tr><tr><td>bar</td><td>baz</td><td>boo</td></tr></tbody></table>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 205', async () => {
		const md = `| abc | def |
| --- | --- |`;
		const ast: ASTLikeNode = [
			'document',
			[
				['table', { align: [undefined, undefined] }],
				['#item', 'abc'],
				['#item', 'def'],
			],
		];
		const html =
			'<table><thead><th>abc</th><th>def</th></thead><tbody></tbody></table>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});
});
