/** @see https://spec.commonmark.org/0.31.2/#backslash-escapes */

import { describe, expect, it } from 'vitest';
import { EzalMarkdown } from '../../src';
import { ASTLikeNode, initAstMatcher } from '../ast';

initAstMatcher();

describe('CommonMark: Backslash escapes', () => {
	it('Example 12', async () => {
		const md = `\\!\\"\\#\\$\\%\\&\\'\\(\\)\\*\\+\\,\\-\\.\\/\\:\\;\\<\\=\\>\\?\\@\\[\\\\\\]\\^\\_\\\`\\{\\|\\}\\~`;
		const ast: ASTLikeNode = [
			'document',
			[
				'paragraph',
				[['#escape', { char: '!' }]],
				[['#escape', { char: '"' }]],
				[['#escape', { char: '#' }]],
				[['#escape', { char: '$' }]],
				[['#escape', { char: '%' }]],
				[['#escape', { char: '&' }]],
				[['#escape', { char: "'" }]],
				[['#escape', { char: '(' }]],
				[['#escape', { char: ')' }]],
				[['#escape', { char: '*' }]],
				[['#escape', { char: '+' }]],
				[['#escape', { char: ',' }]],
				[['#escape', { char: '-' }]],
				[['#escape', { char: '.' }]],
				[['#escape', { char: '/' }]],
				[['#escape', { char: ':' }]],
				[['#escape', { char: ';' }]],
				[['#escape', { char: '<' }]],
				[['#escape', { char: '=' }]],
				[['#escape', { char: '>' }]],
				[['#escape', { char: '?' }]],
				[['#escape', { char: '@' }]],
				[['#escape', { char: '[' }]],
				[['#escape', { char: '\\' }]],
				[['#escape', { char: ']' }]],
				[['#escape', { char: '^' }]],
				[['#escape', { char: '_' }]],
				[['#escape', { char: '`' }]],
				[['#escape', { char: '{' }]],
				[['#escape', { char: '|' }]],
				[['#escape', { char: '}' }]],
				[['#escape', { char: '~' }]],
			],
		];
		const html = '<p>!&quot;#$%&amp;&#39;()*+,-./:;&lt;=&gt;?@[\\]^_`{|}~</p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 13', async () => {
		const md = '\\→\\A\\a\\ \\3\\φ\\«';
		const ast: ASTLikeNode = ['document', ['paragraph', md]];
		const html = '<p>\\→\\A\\a\\ \\3\\φ\\«</p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 14', async () => {
		const md = `\\*not emphasized*
\\<br/> not a tag
\\[not a link](/foo)
\\\`not code\`
1\\. not a list
\\* not a list
\\# not a heading
\\[foo]: /url "not a reference"
\\&ouml; not a character entity`;
		const ast: ASTLikeNode = [
			'document',
			[
				'paragraph',
				[['#escape', { char: '*' }]],
				'not emphasized*',
				['#softbreak'],
				[['#escape', { char: '<' }]],
				'br/> not a tag',
				['#softbreak'],
				[['#escape', { char: '[' }]],
				'not a link](/foo)',
				['#softbreak'],
				[['#escape', { char: '`' }]],
				'not code`',
				['#softbreak'],
				'1',
				[['#escape', { char: '.' }]],
				' not a list',
				['#softbreak'],
				[['#escape', { char: '*' }]],
				' not a list',
				['#softbreak'],
				[['#escape', { char: '#' }]],
				' not a heading',
				['#softbreak'],
				[['#escape', { char: '[' }]],
				'foo]: /url "not a reference"',
				['#softbreak'],
				[['#escape', { char: '&' }]],
				'ouml; not a character entity',
			],
		];
		const html = `<p>*not emphasized*
&lt;br/&gt; not a tag
[not a link](/foo)
\`not code\`
1. not a list
* not a list
# not a heading
[foo]: /url &quot;not a reference&quot;
&amp;ouml; not a character entity</p>`;
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 15', async () => {
		const md = '\\\\*emphasis*';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', [['#escape', { char: '\\' }]], ['#emph', 'emphasis']],
		];
		const html = '<p>\\<em>emphasis</em></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 16', async () => {
		const md = 'foo\\\nbar';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', 'foo', ['#linebreak'], 'bar'],
		];
		const html = '<p>foo<br>bar</p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 17', async () => {
		const md = '`` \\[\\` ``';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', [['#code', { code: '\\[\\`' }]]],
		];
		const html = '<p><code>\\[\\`</code></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 18', async () => {
		const md = '    \\[\\]';
		const ast: ASTLikeNode = [
			'document',
			[['indented-codeblock', { code: '\\[\\]' }]],
		];
		const html = '<pre><code>\\[\\]</code></pre>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 19', async () => {
		const md = `~~~
\\[\\]
~~~`;
		const ast: ASTLikeNode = [
			'document',
			[['fenced-codeblock', { code: '\\[\\]\n' }]],
		];
		const html = '<pre><code>\\[\\]\n</code></pre>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 20', async () => {
		const md = '<https://example.com?find=\\*>';
		const ast: ASTLikeNode = [
			'document',
			[
				'paragraph',
				[
					[
						'#autolink',
						{
							destination: 'https://example.com?find=%5C*',
							text: 'https://example.com?find=\\*',
						},
					],
				],
			],
		];
		const html =
			'<p><a href="https://example.com?find=%5C*" target="_blank">https://example.com?find=\\*</a></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 21', async () => {
		const md = '<a href="/bar\\/)">';
		const ast: ASTLikeNode = ['document', [['html', { raw: md }]]];
		const html = '<a href="/bar\\/)">';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 22', async () => {
		const md = '[foo](/bar\\* "ti\\*tle")';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', [['#link', { destination: '/bar*', title: 'ti*tle' }], 'foo']],
		];
		const html = '<p><a href="/bar*" title="ti*tle">foo</a></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 23', async () => {
		const md = '[foo]\n\n[foo]: /bar* "ti*tle"';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', [['#link', { destination: '/bar*', title: 'ti*tle' }], 'foo']],
		];
		const html = '<p><a href="/bar*" title="ti*tle">foo</a></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 24', async () => {
		const md = '``` foo\\+bar\nfoo\n```';
		const ast: ASTLikeNode = [
			'document',
			[['fenced-codeblock', { code: 'foo\n', lang: 'foo+bar' }]],
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
});
