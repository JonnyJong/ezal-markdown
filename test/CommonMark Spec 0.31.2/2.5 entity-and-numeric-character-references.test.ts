/** @see https://spec.commonmark.org/0.31.2/#entity-and-numeric-character-references */

import { describe, expect, it } from 'vitest';
import { EzalMarkdown } from '../../src';
import { ASTLikeNode, initAstMatcher } from '../ast';

initAstMatcher();

describe('CommonMark: Entity and numeric character references', () => {
	it('Example 25', async () => {
		const md = `&nbsp; &amp; &copy; &AElig; &Dcaron;
&frac34; &HilbertSpace; &DifferentialD;
&ClockwiseContourIntegral; &ngE;`;
		const ast: ASTLikeNode = [
			'document',
			[
				'paragraph',
				[['#entity-reference', { char: '\u00A0', valid: true }]],
				' ',
				[['#entity-reference', { char: '&', valid: true }]],
				' ',
				[['#entity-reference', { char: '©', valid: true }]],
				' ',
				[['#entity-reference', { char: 'Æ', valid: true }]],
				' ',
				[['#entity-reference', { char: 'Ď', valid: true }]],
				['#softbreak'],
				[['#entity-reference', { char: '¾', valid: true }]],
				' ',
				[['#entity-reference', { char: '\u210B', valid: true }]],
				' ',
				[['#entity-reference', { char: '\u2146', valid: true }]],
				['#softbreak'],
				[['#entity-reference', { char: '∲', valid: true }]],
				' ',
				[['#entity-reference', { char: '≧̸', valid: true }]],
			],
		];
		const html = `<p>  &amp; © Æ Ď
¾ ℋ ⅆ
∲ ≧̸</p>`;
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 26', async () => {
		const md = '&#35; &#1234; &#992; &#0;';
		const ast: ASTLikeNode = [
			'document',
			[
				'paragraph',
				[['#decimal-character-reference', { char: '#', valid: true }]],
				' ',
				[['#decimal-character-reference', { char: 'Ӓ', valid: true }]],
				' ',
				[['#decimal-character-reference', { char: 'Ϡ', valid: true }]],
				' ',
				[['#decimal-character-reference', { char: '�', valid: false }]],
			],
		];
		const html = '<p># Ӓ Ϡ �</p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 27', async () => {
		const md = '&#X22; &#XD06; &#xcab;';
		const ast: ASTLikeNode = [
			'document',
			[
				'paragraph',
				[['#hexadecimal-character-reference', { char: '"', valid: true }]],
				' ',
				[['#hexadecimal-character-reference', { char: 'ആ', valid: true }]],
				' ',
				[['#hexadecimal-character-reference', { char: 'ಫ', valid: true }]],
			],
		];
		const html = '<p>&quot; ആ ಫ</p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 28', async () => {
		const md = `&nbsp &x; &#; &#x;
&#87654321;
&#abcdef0;
&ThisIsNotDefined; &hi?;`;
		const ast: ASTLikeNode = [
			'document',
			[
				'paragraph',
				'&nbsp &x; &#; &#x;',
				['#softbreak'],
				'&#87654321;',
				['#softbreak'],
				'&#abcdef0;',
				['#softbreak'],
				'&ThisIsNotDefined; &hi?;',
			],
		];
		const html = `<p>&amp;nbsp &amp;x; &amp;#; &amp;#x;
&amp;#87654321;
&amp;#abcdef0;
&amp;ThisIsNotDefined; &amp;hi?;</p>`;
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 29', async () => {
		const md = '&copy';
		const ast: ASTLikeNode = ['document', ['paragraph', '&copy']];
		const html = '<p>&amp;copy</p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 30', async () => {
		const md = '&MadeUpEntity;';
		const ast: ASTLikeNode = ['document', ['paragraph', '&MadeUpEntity;']];
		const html = '<p>&amp;MadeUpEntity;</p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 31', async () => {
		const md = '<a href="&ouml;&ouml;.char">';
		const ast: ASTLikeNode = ['document', [['html', { raw: md }]]];
		const html = '<a href="&ouml;&ouml;.char">';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 32', async () => {
		const md = '[foo](/f&ouml;&ouml; "f&ouml;&ouml;")';
		const ast: ASTLikeNode = [
			'document',
			[
				'paragraph',
				[['#link', { destination: '/f%C3%B6%C3%B6', title: 'föö' }], 'foo'],
			],
		];
		const html = '<p><a href="/f%C3%B6%C3%B6" title="föö">foo</a></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 33', async () => {
		const md = '[foo]\n\n[foo]: /f&ouml;&ouml; "f&ouml;&ouml;"';
		const ast: ASTLikeNode = [
			'document',
			[
				'paragraph',
				[['#link', { destination: '/f%C3%B6%C3%B6', title: 'föö' }], 'foo'],
			],
		];
		const html = '<p><a href="/f%C3%B6%C3%B6" title="föö">foo</a></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 34', async () => {
		const md = '``` f&ouml;&ouml;\nfoo\n```';
		const ast: ASTLikeNode = [
			'document',
			[['fenced-codeblock', { code: 'foo\n', lang: 'föö' }]],
		];
		const html = '<pre><code>foo\n</code></pre>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 35', async () => {
		const md = '`f&ouml;&ouml;`';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', [['#code', { code: 'f&ouml;&ouml;' }]]],
		];
		const html = '<p><code>f&amp;ouml;&amp;ouml;</code></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 36', async () => {
		const md = '    f&ouml;f&ouml;';
		const ast: ASTLikeNode = [
			'document',
			[['indented-codeblock', { code: 'f&ouml;f&ouml;' }]],
		];
		const html = '<pre><code>f&amp;ouml;f&amp;ouml;</code></pre>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 37', async () => {
		const md = '&#42;foo&#42;\n*foo*';
		const ast: ASTLikeNode = [
			'document',
			[
				'paragraph',
				[['#decimal-character-reference', { char: '*' }]],
				'foo',
				[['#decimal-character-reference', { char: '*' }]],
				['#softbreak'],
				['#emph', 'foo'],
			],
		];
		const html = '<p>*foo*\n<em>foo</em></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 38', async () => {
		const md = '&#42; foo\n\n* foo';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', [['#decimal-character-reference', { char: '*' }]], ' foo'],
			['list', ['item', 'foo']],
		];
		const html = '<p>* foo</p><ul><li>foo</li></ul>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 39', async () => {
		const md = 'foo&#10;&#10;bar';
		const ast: ASTLikeNode = [
			'document',
			[
				'paragraph',
				'foo',
				[['#decimal-character-reference', { char: '\n' }]],
				[['#decimal-character-reference', { char: '\n' }]],
				'bar',
			],
		];
		const html = '<p>foo\n\nbar</p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 40', async () => {
		const md = '&#9;foo';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', [['#decimal-character-reference', { char: '\t' }]], 'foo'],
		];
		const html = '<p>\tfoo</p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 41', async () => {
		const md = '[a](url &quot;tit&quot;)';
		const ast: ASTLikeNode = [
			'document',
			[
				'paragraph',
				'[a](url ',
				[['#entity-reference', { char: '"' }]],
				'tit',
				[['#entity-reference', { char: '"' }]],
				')',
			],
		];
		const html = '<p>[a](url &quot;tit&quot;)</p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});
});
