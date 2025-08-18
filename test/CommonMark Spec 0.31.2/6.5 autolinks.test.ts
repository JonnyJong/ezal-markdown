/** @see https://spec.commonmark.org/0.31.2/#autolinks */

import { describe, expect, it } from 'vitest';
import { EzalMarkdown } from '../../src';
import { ASTLikeNode, initAstMatcher } from '../ast';

initAstMatcher();

describe('CommonMark: Autolinks', () => {
	it('Example 594', async () => {
		const md = '<http://foo.bar.baz>';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', [['#autolink', { destination: 'http://foo.bar.baz' }]]],
		];
		const html =
			'<p><a href="http://foo.bar.baz" target="_blank">http://foo.bar.baz</a></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 595', async () => {
		const md = '<https://foo.bar.baz/test?q=hello&id=22&boolean>';
		const ast: ASTLikeNode = [
			'document',
			[
				'paragraph',
				[
					[
						'#autolink',
						{ destination: 'https://foo.bar.baz/test?q=hello&id=22&boolean' },
					],
				],
			],
		];
		const html =
			'<p><a href="https://foo.bar.baz/test?q=hello&amp;id=22&amp;boolean" target="_blank">https://foo.bar.baz/test?q=hello&amp;id=22&amp;boolean</a></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 596', async () => {
		const md = '<irc://foo.bar:2233/baz>';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', [['#autolink', { destination: 'irc://foo.bar:2233/baz' }]]],
		];
		const html =
			'<p><a href="irc://foo.bar:2233/baz" target="_blank">irc://foo.bar:2233/baz</a></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 597', async () => {
		const md = '<MAILTO:FOO@BAR.BAZ>';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', [['#autolink', { destination: 'MAILTO:FOO@BAR.BAZ' }]]],
		];
		const html = '<p><a href="MAILTO:FOO@BAR.BAZ">MAILTO:FOO@BAR.BAZ</a></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 598', async () => {
		const md = '<a+b+c:d>';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', [['#autolink', { destination: 'a+b+c:d' }]]],
		];
		const html = '<p><a href="a+b+c:d" target="_blank">a+b+c:d</a></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 599', async () => {
		const md = '<made-up-scheme://foo,bar>';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', [['#autolink', { destination: 'made-up-scheme://foo,bar' }]]],
		];
		const html =
			'<p><a href="made-up-scheme://foo,bar" target="_blank">made-up-scheme://foo,bar</a></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 600', async () => {
		const md = '<https://../>';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', [['#autolink', { destination: 'https://../' }]]],
		];
		const html = '<p><a href="https://../" target="_blank">https://../</a></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 601', async () => {
		const md = '<localhost:5001/foo>';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', [['#autolink', { destination: 'localhost:5001/foo' }]]],
		];
		const html =
			'<p><a href="localhost:5001/foo" target="_blank">localhost:5001/foo</a></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 602', async () => {
		const md = '<https://foo.bar/baz bim>';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', '<https://foo.bar/baz bim>'],
		];
		const html = '<p>&lt;https://foo.bar/baz bim&gt;</p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 603', async () => {
		const md = '<https://example.com/\\[\\>';
		const ast: ASTLikeNode = [
			'document',
			[
				'paragraph',
				[['#autolink', { destination: 'https://example.com/%5C%5B%5C' }]],
			],
		];
		const html =
			'<p><a href="https://example.com/%5C%5B%5C" target="_blank">https://example.com/\\[\\</a></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 604', async () => {
		const md = '<foo@bar.example.com>';
		const ast: ASTLikeNode = [
			'document',
			[
				'paragraph',
				[['#autolink', { destination: 'mailto:foo@bar.example.com' }]],
			],
		];
		const html =
			'<p><a href="mailto:foo@bar.example.com" target="_blank">foo@bar.example.com</a></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 605', async () => {
		const md = '<foo+special@Bar.baz-bar0.com>';
		const ast: ASTLikeNode = [
			'document',
			[
				'paragraph',
				[['#autolink', { destination: 'mailto:foo+special@Bar.baz-bar0.com' }]],
			],
		];
		const html =
			'<p><a href="mailto:foo+special@Bar.baz-bar0.com" target="_blank">foo+special@Bar.baz-bar0.com</a></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 606', async () => {
		const md = '<foo\\+@bar.example.com>';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', '<foo', ['#escape'], '@bar.example.com>'],
		];
		const html = '<p>&lt;foo+@bar.example.com&gt;</p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 607', async () => {
		const md = '<>';
		const ast: ASTLikeNode = ['document', ['paragraph', '<>']];
		const html = '<p>&lt;&gt;</p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 608', async () => {
		const md = '< https://foo.bar >';
		const ast: ASTLikeNode = ['document', ['paragraph', '< https://foo.bar >']];
		const html = '<p>&lt; https://foo.bar &gt;</p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 609', async () => {
		const md = '<m:abc>';
		const ast: ASTLikeNode = ['document', ['paragraph', ['#html']]];
		const html = '<p><m:abc></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 610', async () => {
		const md = '<foo.bar.baz>';
		const ast: ASTLikeNode = ['document', ['paragraph', ['#html']]];
		const html = '<p><foo.bar.baz></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 611', async () => {
		const md = 'https://example.com';
		const ast: ASTLikeNode = ['document', ['paragraph', 'https://example.com']];
		const html = '<p>https://example.com</p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 612', async () => {
		const md = 'foo@bar.example.com';
		const ast: ASTLikeNode = ['document', ['paragraph', 'foo@bar.example.com']];
		const html = '<p>foo@bar.example.com</p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});
});
