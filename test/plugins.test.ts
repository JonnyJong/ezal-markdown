import { it } from 'vitest';
import { describe } from 'vitest';
import { expect } from 'vitest';
import { EzalMarkdown } from '../src';

describe('Plugins', () => {
	it('blockquote', async () => {
		const result = await EzalMarkdown.render(`> This is a blockquote\u0020\u0020
> with multiple lines.
>
> And a second paragraph.
> A sentence in second paragraph.`);
		expect(
			result.html,
		).toEqual(`<blockquote>This is a blockquote<br>with multiple lines.<br>And a second paragraph.
A sentence in second paragraph.</blockquote>`);
	});

	it('code', async () => {
		const result = await EzalMarkdown.render('This is `inline code` example.');
		expect(result.html).toEqual(
			'<p>This is <code>inline code</code> example.</p>',
		);
	});

	it('codeblock', async () => {
		const result = await EzalMarkdown.render(`    function hello() {
        console.log("Hello, world!");
    }`);
		expect(result.html).toEqual(`<pre><code>function hello() {
    console.log("Hello, world!");
}</code></pre>`);
	});

	it('codeblock-fenced', async () => {
		const result = await EzalMarkdown.render(
			'```javascript\nfunction hello() {\n    console.log("Hello, world!");\n}\n```',
		);
		expect(result.html).toEqual(`<pre><code>function hello() {
    console.log("Hello, world!");
}</code></pre>`);
	});

	it('codeblock-fenced (more backticks)', async () => {
		const result = await EzalMarkdown.render(
			'````\n```js\nnested backticks\n```\n````',
		);
		expect(result.html).toEqual(
			'<pre><code>```js\nnested backticks\n```</code></pre>',
		);
	});

	it('codeblock-fenced (tildes)', async () => {
		const result = await EzalMarkdown.render('~~~js\nconsole.log("Tilde");\n~~~');
		expect(result.html).toEqual('<pre><code>console.log("Tilde");</code></pre>');
	});

	it('codeblock-fenced (more tildes)', async () => {
		const result = await EzalMarkdown.render(
			'~~~~\n~~~\nnested tildes\n~~~\n~~~~',
		);
		expect(result.html).toEqual(
			'<pre><code>~~~\nnested tildes\n~~~</code></pre>',
		);
	});

	it('footnote', async () => {
		const result =
			await EzalMarkdown.render(`Here's a sentence with a footnote.[^note]

[^note]: This is the footnote content.`);
		expect(result.html).toEqual(
			`<p>Here's a sentence with a footnote.<a href="#note">note</a></p><dl><dt id="note">note</dt><dd>This is the footnote content.</dd></dl>`,
		);
	});

	it('heading', async () => {
		const result = await EzalMarkdown.render('### My Great Heading');
		expect(result.html).toEqual(
			'<h3 id="my-great-heading">My Great Heading</h3>',
		);
	});

	it('heading (with custom id)', async () => {
		const result = await EzalMarkdown.render('### My Great Heading {#custom-id}');
		expect(result.html).toEqual('<h3 id="custom-id">My Great Heading</h3>');
	});

	it('hr', async () => {
		const result = await EzalMarkdown.render(`---

Above is a horizontal rule`);
		expect(result.html).toEqual('<hr><p>Above is a horizontal rule</p>');
	});

	it('image (inline)', async () => {
		const result = await EzalMarkdown.render(
			`This is a example image: ![alt text](https://example.com/image.jpg "title text")`,
		);
		expect(result.html).toEqual(
			'<p>This is a example image: <img src="https://example.com/image.jpg" alt="alt text" title="title text"></p>',
		);
	});

	it('image (block)', async () => {
		const result = await EzalMarkdown.render(
			`![alt text](https://example.com/image.jpg "title text")`,
		);
		expect(result.html).toEqual(
			'<img src="https://example.com/image.jpg" alt="alt text" title="title text">',
		);
	});

	it('image-reference (inline)', async () => {
		const result =
			await EzalMarkdown.render(`This is ![an example][id] reference-style inline image.

[id]: https://example.com/  "Optional Title Here"`);
		expect(result.html).toEqual(
			'<p>This is <img src="https://example.com/" alt="an example" title="Optional Title Here"> reference-style inline image.</p>',
		);
	});

	it('image-reference (block)', async () => {
		const result = await EzalMarkdown.render(`![an example][id]

[id]: https://example.com/  "Optional Title Here"`);
		expect(result.html).toEqual(
			'<img src="https://example.com/" alt="an example" title="Optional Title Here">',
		);
	});

	it('link', async () => {
		const result = await EzalMarkdown.render(
			`这是一个链接 [Jonnys' Blog](https://jonnys.top)。`,
		);
		expect(result.html).toEqual(
			`<p>这是一个链接 <a href="https://jonnys.top" target="_blank">Jonnys' Blog</a>。</p>`,
		);
	});

	it('link (with title)', async () => {
		const result = await EzalMarkdown.render(
			`这是一个链接 [Jonnys' Blog](https://jonnys.top "欢迎光临小站")。`,
		);
		expect(result.html).toEqual(
			`<p>这是一个链接 <a href="https://jonnys.top" title="欢迎光临小站" target="_blank">Jonnys' Blog</a>。</p>`,
		);
	});

	it('link-bracket', async () => {
		const result = await EzalMarkdown.render('<https://example.com>');
		expect(result.html).toEqual(
			'<p><a href="https://example.com" target="_blank">https://example.com</a></p>',
		);
	});

	it('email-bracket', async () => {
		const result = await EzalMarkdown.render('<user@example.com>');
		expect(result.html).toEqual(
			'<p><a href="mailto:user@example.com">user@example.com</a></p>',
		);
	});

	it('link-reference', async () => {
		const result =
			await EzalMarkdown.render(`This is [an example][id] reference-style link.

[id]: https://example.com/  "Optional Title Here"`);
		expect(result.html).toEqual(
			`<p>This is <a href="https://example.com/" title="Optional Title Here" target="_blank">an example</a> reference-style link.</p>`,
		);
	});

	it('list-ordered', async () => {
		const result = await EzalMarkdown.render(`1. First item
2. Second item
3. Third item`);
		expect(result.html).toEqual(
			'<ol><li>First item</li><li>Second item</li><li>Third item</li></ol>',
		);
	});

	it('list-unordered', async () => {
		const result = await EzalMarkdown.render(`- First item
- Second item
- Third item`);
		expect(result.html).toEqual(
			'<ul><li>First item</li><li>Second item</li><li>Third item</li></ul>',
		);
	});

	it('list-task', async () => {
		const result = await EzalMarkdown.render(`- [x] Write the press release
- [ ] Update the website
- [ ] Contact the media`);
		expect(result.html).toEqual(
			'<ul><li><input type="checkbox" checked>Write the press release</li><li><input type="checkbox">Update the website</li><li><input type="checkbox">Contact the media</li></ul>',
		);
	});

	it('table', async () => {
		const result = await EzalMarkdown.render(`| Syntax      | Description |
| ----------- | ----------- |
| Header      | Title       |
| Paragraph   | Text        |`);
		expect(result.html).toEqual(
			'<table><thead><tr><th>Syntax</th><th>Description</th></tr></thead><tbody><tr><td>Header</td><td>Title</td></tr><tr><td>Paragraph</td><td>Text</td></tr></tbody></table>',
		);
	});

	it('table (escape)', async () => {
		const result =
			await EzalMarkdown.render(`| Column A       | Column B (with \\|) |
| -----------     | ------------------ |
| Normal text     | Pipe: \\|           |
| Another row     | More \\| examples   |`);
		expect(result.html).toEqual(
			'<table><thead><tr><th>Column A</th><th>Column B (with |)</th></tr></thead><tbody><tr><td>Normal text</td><td>Pipe: |</td></tr><tr><td>Another row</td><td>More | examples</td></tr></tbody></table>',
		);
	});

	it('table (align)', async () => {
		const result = await EzalMarkdown.render(`
| Left Align      | Center Align    | Right Align |
|:----------------|:---------------:|------------:|
| Content A       | Content B       | Content C   |
| Longer content  | Centered item   | 123456      |`);

		expect(result.html).toEqual(
			'<table>' +
				'<thead>' +
				'<tr>' +
				'<th style="text-align:left;">Left Align</th>' +
				'<th style="text-align:center;">Center Align</th>' +
				'<th style="text-align:right;">Right Align</th>' +
				'</tr>' +
				'</thead>' +
				'<tbody>' +
				'<tr>' +
				'<td style="text-align:left;">Content A</td>' +
				'<td style="text-align:center;">Content B</td>' +
				'<td style="text-align:right;">Content C</td>' +
				'</tr>' +
				'<tr>' +
				'<td style="text-align:left;">Longer content</td>' +
				'<td style="text-align:center;">Centered item</td>' +
				'<td style="text-align:right;">123456</td>' +
				'</tr>' +
				'</tbody>' +
				'</table>',
		);
	});

	it('bold', async () => {
		const result = await EzalMarkdown.render('This is **bold** text.');
		expect(result.html).toEqual('<p>This is <b>bold</b> text.</p>');
	});

	it('italic', async () => {
		const result = await EzalMarkdown.render('This is *italic* text.');
		expect(result.html).toEqual('<p>This is <i>italic</i> text.</p>');
	});

	it('strikethrough', async () => {
		const result = await EzalMarkdown.render('This is ~~strikethrough~~ text.');
		expect(result.html).toEqual('<p>This is <del>strikethrough</del> text.</p>');
	});

	it('bold-italic', async () => {
		const result = await EzalMarkdown.render(
			'This is ***bold and italic*** text.',
		);
		expect(result.html).toEqual(
			'<p>This is <b><i>bold and italic</i></b> text.</p>',
		);
	});
});
