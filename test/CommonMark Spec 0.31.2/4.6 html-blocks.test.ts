/** @see https://spec.commonmark.org/0.31.2/#html-blocks */

import { describe, expect, it } from 'vitest';
import { EzalMarkdown } from '../../src';
import { ASTLikeNode, initAstMatcher } from '../ast';

initAstMatcher();

describe('CommonMark: HTML blocks ', () => {
	it('Example 148', async () => {
		const md =
			'<table><tr><td>\n<pre>\n**Hello**,\n\n_world_.\n</pre>\n</td></tr></table>';
		const ast: ASTLikeNode = [
			'document',
			[['html', { raw: '<table><tr><td>\n<pre>\n**Hello**,' }]],
			[
				'paragraph',
				['#emph', 'world'],
				'.',
				['#softbreak'],
				[['#html', { raw: '</pre>' }]],
			],
			[['html', { raw: '</td></tr></table>' }]],
		];
		const html = `<table><tr><td>
<pre>
**Hello**,<p><em>world</em>.
</pre></p></td></tr></table>`;
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 149', async () => {
		const md =
			'<table>\n  <tr>\n    <td>\n           hi\n    </td>\n  </tr>\n</table>\n\nokay.';
		const ast: ASTLikeNode = [
			'document',
			[
				[
					'html',
					{
						raw: '<table>\n  <tr>\n    <td>\n           hi\n    </td>\n  </tr>\n</table>',
					},
				],
			],
			['paragraph', 'okay.'],
		];
		const html = `<table>
  <tr>
    <td>
           hi
    </td>
  </tr>
</table><p>okay.</p>`;
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 150', async () => {
		const md = ' <div>\n  *hello*\n         <foo><a>';
		const ast: ASTLikeNode = ['document', [['html', { raw: md }]]];
		const html = ' <div>\n  *hello*\n         <foo><a>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 151', async () => {
		const md = '</div>\n*foo*';
		const ast: ASTLikeNode = ['document', [['html', { raw: md }]]];
		const html = '</div>\n*foo*';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 152', async () => {
		const md = '<DIV CLASS="foo">\n\n*Markdown*\n\n</DIV>';
		const ast: ASTLikeNode = [
			'document',
			[['html', { raw: '<DIV CLASS="foo">' }]],
			['paragraph', ['#emph', 'Markdown']],
			[['html', { raw: '</DIV>' }]],
		];
		const html = '<DIV CLASS="foo"><p><em>Markdown</em></p></DIV>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 153', async () => {
		const md = '<div id="foo"\n  class="bar">\n</div>';
		const ast: ASTLikeNode = ['document', [['html', { raw: md }]]];
		const html = `<div id="foo"
  class="bar">
</div>`;
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 154', async () => {
		const md = '<div id="foo" class="bar\n  baz">\n</div>';
		const ast: ASTLikeNode = ['document', [['html', { raw: md }]]];
		const html = `<div id="foo" class="bar
  baz">
</div>`;
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 155', async () => {
		const md = '<div>\n*foo*\n\n*bar*';
		const ast: ASTLikeNode = [
			'document',
			[['html', { raw: '<div>\n*foo*' }]],
			['paragraph', ['#emph', 'bar']],
		];
		const html = `<div>
*foo*<p><em>bar</em></p>`;
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 156', async () => {
		const md = '<div id="foo"\n*hi*';
		const ast: ASTLikeNode = ['document', [['html', { raw: md }]]];
		const html = `<div id="foo"
*hi*`;
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 157', async () => {
		const md = '<div class\nfoo';
		const ast: ASTLikeNode = ['document', [['html', { raw: md }]]];
		const html = `<div class
foo`;
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 158', async () => {
		const md = '<div *???-&&&-<---\n*foo*';
		const ast: ASTLikeNode = ['document', [['html', { raw: md }]]];
		const html = `<div *???-&&&-<---
*foo*`;
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 159', async () => {
		const md = '<div><a href="bar">*foo*</a></div>';
		const ast: ASTLikeNode = ['document', [['html', { raw: md }]]];
		const html = '<div><a href="bar">*foo*</a></div>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 160', async () => {
		const md = '<table><tr><td>\nfoo\n</td></tr></table>';
		const ast: ASTLikeNode = ['document', [['html', { raw: md }]]];
		const html = `<table><tr><td>
foo
</td></tr></table>`;
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 161', async () => {
		const md = '<div></div>\n``` c\nint x = 33;\n```';
		const ast: ASTLikeNode = ['document', [['html', { raw: md }]]];
		const html = '<div></div>\n``` c\nint x = 33;\n```';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 162', async () => {
		const md = '<a href="foo">\n*bar*\n</a>';
		const ast: ASTLikeNode = ['document', [['html', { raw: md }]]];
		const html = `<a href="foo">
*bar*
</a>`;
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 163', async () => {
		const md = '<Warning>\n*bar*\n</Warning>';
		const ast: ASTLikeNode = ['document', [['html', { raw: md }]]];
		const html = `<Warning>
*bar*
</Warning>`;
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 164', async () => {
		const md = '<i class="foo">\n*bar*\n</i>';
		const ast: ASTLikeNode = ['document', [['html', { raw: md }]]];
		const html = `<i class="foo">
*bar*
</i>`;
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 165', async () => {
		const md = '</ins>\n*bar*';
		const ast: ASTLikeNode = ['document', [['html', { raw: md }]]];
		const html = `</ins>
*bar*`;
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 166', async () => {
		const md = '<del>\n*foo*\n</del>';
		const ast: ASTLikeNode = ['document', [['html', { raw: md }]]];
		const html = `<del>
*foo*
</del>`;
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 167', async () => {
		const md = '<del>\n\n*foo*\n\n</del>';
		const ast: ASTLikeNode = [
			'document',
			[['html', { raw: '<del>' }]],
			['paragraph', ['#emph', 'foo']],
			[['html', { raw: '</del>' }]],
		];
		const html = '<del><p><em>foo</em></p></del>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 168', async () => {
		const md = '<del>*foo*</del>';
		const ast: ASTLikeNode = [
			'document',
			[
				'paragraph',
				[['#html', { raw: '<del>' }]],
				['#emph', 'foo'],
				[['#html', { raw: '</del>' }]],
			],
		];
		const html = '<p><del><em>foo</em></del></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 169', async () => {
		const md =
			'<pre language="haskell"><code>\nimport Text.HTML.TagSoup\n\nmain :: IO ()\nmain = print $ parseTags tags\n</code></pre>\nokay';
		const ast: ASTLikeNode = [
			'document',
			[
				[
					'html',
					{
						raw: '<pre language="haskell"><code>\nimport Text.HTML.TagSoup\n\nmain :: IO ()\nmain = print $ parseTags tags\n</code></pre>',
					},
				],
			],
			['paragraph', 'okay'],
		];
		const html = `<pre language="haskell"><code>
import Text.HTML.TagSoup

main :: IO ()
main = print $ parseTags tags
</code></pre><p>okay</p>`;
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 170', async () => {
		const md =
			'<script type="text/javascript">\n// JavaScript example\n\ndocument.getElementById("demo").innerHTML = "Hello JavaScript!";\n</script>\nokay';
		const ast: ASTLikeNode = [
			'document',
			[
				[
					'html',
					{
						raw: '<script type="text/javascript">\n// JavaScript example\n\ndocument.getElementById("demo").innerHTML = "Hello JavaScript!";\n</script>',
					},
				],
			],
			['paragraph', 'okay'],
		];
		const html = `<script type="text/javascript">
// JavaScript example

document.getElementById("demo").innerHTML = "Hello JavaScript!";
</script><p>okay</p>`;
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 171', async () => {
		const md = '<textarea>\n\n*foo*\n\n_bar_\n\n</textarea>';
		const ast: ASTLikeNode = [
			'document',
			[['html', { raw: '<textarea>\n\n*foo*\n\n_bar_\n\n</textarea>' }]],
		];
		const html = `<textarea>

*foo*

_bar_

</textarea>`;
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 172', async () => {
		const md =
			'<style\n  type="text/css">\nh1 {color:red;}\n\np {color:blue;}\n</style>\nokay';
		const ast: ASTLikeNode = [
			'document',
			[
				[
					'html',
					{
						raw: '<style\n  type="text/css">\nh1 {color:red;}\n\np {color:blue;}\n</style>',
					},
				],
			],
			['paragraph', 'okay'],
		];
		const html = `<style
  type="text/css">
h1 {color:red;}

p {color:blue;}
</style><p>okay</p>`;
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 173', async () => {
		const md = '<style\n  type="text/css">\n\nfoo';
		const ast: ASTLikeNode = [
			'document',
			[['html', { raw: '<style\n  type="text/css">\n\nfoo' }]],
		];
		const html = `<style
  type="text/css">

foo`;
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 174', async () => {
		const md = '> <div>\n> foo\n\nbar';
		const ast: ASTLikeNode = [
			'document',
			['blockquote', ['item', [['html', { raw: '<div>\nfoo\n' }]]]],
			['paragraph', 'bar'],
		];
		const html = `<blockquote><div>
foo
</blockquote><p>bar</p>`;
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 175', async () => {
		const md = '- <div>\n- foo';
		const ast: ASTLikeNode = [
			'document',
			['list', ['item', [['html', { raw: '<div>\n' }]]], ['item', 'foo']],
		];
		const html = `<ul><li><div>
</li><li>foo</li></ul>`;
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 176', async () => {
		const md = '<style>p{color:red;}</style>\n*foo*';
		const ast: ASTLikeNode = [
			'document',
			[['html', { raw: '<style>p{color:red;}</style>' }]],
			['paragraph', ['#emph', 'foo']],
		];
		const html = '<style>p{color:red;}</style><p><em>foo</em></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 177', async () => {
		const md = '<!-- foo -->*bar*\n*baz*';
		const ast: ASTLikeNode = [
			'document',
			[['html', { raw: '<!-- foo -->*bar*' }]],
			['paragraph', ['#emph', 'baz']],
		];
		const html = '<!-- foo -->*bar*<p><em>baz</em></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 178', async () => {
		const md = '<script>\nfoo\n</script>1. *bar*';
		const ast: ASTLikeNode = [
			'document',
			[['html', { raw: '<script>\nfoo\n</script>1. *bar*' }]],
		];
		const html = `<script>
foo
</script>1. *bar*`;
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 179', async () => {
		const md = '<!-- Foo\n\nbar\n   baz -->\nokay';
		const ast: ASTLikeNode = [
			'document',
			[['html', { raw: '<!-- Foo\n\nbar\n   baz -->' }]],
			['paragraph', 'okay'],
		];
		const html = `<!-- Foo

bar
   baz --><p>okay</p>`;
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 180', async () => {
		const md = "<?php\n\n  echo ' > ';\n\n?>\nokay";
		const ast: ASTLikeNode = [
			'document',
			[['html', { raw: "<?php\n\n  echo ' > ';" }]],
			['paragraph', '?>', ['#softbreak'], 'okay'],
		];
		const html = `<?php

  echo ' > ';<p>?&gt;
okay</p>`;
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 181', async () => {
		const md = '<!DOCTYPE html>';
		const ast: ASTLikeNode = ['document', [['html', { raw: '<!DOCTYPE html>' }]]];
		const html = '<!DOCTYPE html>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 182', async () => {
		const md = `<![CDATA[
function matchwo(a,b)
{
  if (a < b && a < 0) then {
    return 1;

  } else {

    return 0;
  }
}
]]>
okay`;
		const ast: ASTLikeNode = [
			'document',
			[
				[
					'html',
					{
						raw: '<![CDATA[\nfunction matchwo(a,b)\n{\n  if (a < b && a < 0) then {\n    return 1;\n\n  } else {\n\n    return 0;\n  }\n}\n]]>',
					},
				],
			],
			['paragraph', 'okay'],
		];
		const html = `<![CDATA[
function matchwo(a,b)
{
  if (a < b && a < 0) then {
    return 1;

  } else {

    return 0;
  }
}
]]><p>okay</p>`;
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 183', async () => {
		const md = '  <!-- foo -->\n\n    <!-- foo -->';
		const ast: ASTLikeNode = [
			'document',
			[['html', { raw: '  <!-- foo -->' }]],
			[['indented-codeblock', { code: '<!-- foo -->' }]],
		];
		const html = '  <!-- foo --><pre><code>&lt;!-- foo --&gt;</code></pre>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 184', async () => {
		const md = '  <div>\n\n    <div>';
		const ast: ASTLikeNode = [
			'document',
			[['html', { raw: '  <div>' }]],
			[['indented-codeblock', { code: '<div>' }]],
		];
		const html = '  <div><pre><code>&lt;div&gt;</code></pre>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 185', async () => {
		const md = 'Foo\n<div>\nbar\n</div>';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', 'Foo'],
			[['html', { raw: '<div>\nbar\n</div>' }]],
		];
		const html = `<p>Foo</p><div>
bar
</div>`;
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 186', async () => {
		const md = '<div>\nbar\n</div>\n*foo*';
		const ast: ASTLikeNode = [
			'document',
			[['html', { raw: '<div>\nbar\n</div>\n*foo*' }]],
		];
		const html = `<div>
bar
</div>
*foo*`;
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 187', async () => {
		const md = 'Foo\n<a href="bar">\nbaz';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', 'Foo'],
			[['html', { raw: '<a href="bar">\nbaz' }]],
		];
		const html = `<p>Foo</p><a href="bar">
baz`;
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 188', async () => {
		const md = '<div>\n\n*Emphasized* text.\n\n</div>';
		const ast: ASTLikeNode = [
			'document',
			[['html', { raw: '<div>' }]],
			['paragraph', ['#emph', 'Emphasized'], ' text.'],
			[['html', { raw: '</div>' }]],
		];
		const html = '<div><p><em>Emphasized</em> text.</p></div>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 189', async () => {
		const md = '<div>\n*Emphasized* text.\n</div>';
		const ast: ASTLikeNode = [
			'document',
			[['html', { raw: '<div>\n*Emphasized* text.\n</div>' }]],
		];
		const html = `<div>
*Emphasized* text.
</div>`;
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 190', async () => {
		const md = '<table>\n\n<tr>\n\n<td>\nHi\n</td>\n\n</tr>\n\n</table>\n';
		const ast: ASTLikeNode = [
			'document',
			[['html', { raw: '<table>' }]],
			[['html', { raw: '<tr>' }]],
			[['html', { raw: '<td>\nHi\n</td>' }]],
			[['html', { raw: '</tr>' }]],
			[['html', { raw: '</table>\n' }]],
		];
		const html = `<table><tr><td>
Hi
</td></tr></table>
`;
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 191', async () => {
		const md =
			'<table>\n\n  <tr>\n\n    <td>\n      Hi\n    </td>\n\n  </tr>\n\n</table>\n';
		const ast: ASTLikeNode = [
			'document',
			[['html', { raw: '<table>' }]],
			[['html', { raw: '  <tr>' }]],
			[['indented-codeblock', { code: '<td>\n  Hi\n</td>\n' }]],
			[['html', { raw: '  </tr>' }]],
			[['html', { raw: '</table>\n' }]],
		];
		const html = `<table>  <tr><pre><code>&lt;td&gt;
  Hi
&lt;/td&gt;
</code></pre>  </tr></table>
`;
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});
});
