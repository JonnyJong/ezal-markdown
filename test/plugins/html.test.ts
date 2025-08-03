import { describe, expect, it } from 'vitest';
import { EzalMarkdown, plugins } from '../../src';

describe('Plugin: html', () => {
	it('default', async () => {
		const result = await EzalMarkdown.render('<div>Hello World</div>');
		expect(result.html).toEqual('<div>Hello World</div>');
	});

	it('with heading semantics', async () => {
		const result = await EzalMarkdown.render('<h2>HTML Heading</h2>');
		expect(result.html).toEqual('<h2 id="html-heading">HTML Heading</h2>');
	});

	it('with disableHeadingSemantics=true', async () => {
		const renderer = new EzalMarkdown();
		renderer.set(...plugins.html({ disableHeadingSemantics: true }));
		const result = await renderer.render('<h3>Raw HTML Heading</h3>');
		expect(result.html).toEqual('<h3>Raw HTML Heading</h3>');
	});

	it('with parseInnerMarkdown=false', async () => {
		const renderer = new EzalMarkdown();
		renderer.set(...plugins.html({ parseInnerMarkdown: false }));
		const result = await renderer.render('<p>*italic* **bold**</p>');
		expect(result.html).toEqual('<p>*italic* **bold**</p>');
	});

	it('with parseInnerMarkdown=true', async () => {
		const renderer = new EzalMarkdown();
		renderer.set(...plugins.html({ parseInnerMarkdown: true }));
		const result = await renderer.render('<div>*italic* **bold**</div>');
		expect(result.html).toEqual('<div><i>italic</i> <b>bold</b></div>');
	});

	it('with strictTagCase=true', async () => {
		const renderer = new EzalMarkdown();
		renderer.set(...plugins.html({ strictTagCase: false }));
		const result = await renderer.render('<Div>Content</Div>');
		expect(result.html).toEqual('<Div>Content</Div>');
	});

	it('with strictTagCase=false (mismatched case)', async () => {
		const renderer = new EzalMarkdown();
		renderer.set(...plugins.html({ strictTagCase: false }));
		const result = await renderer.render('<Div>Content</div>');
		expect(result.html).toEqual('<Div>Content</div>');
	});

	it('with heading options', async () => {
		const renderer = new EzalMarkdown();
		renderer.set(
			...plugins.html({
				shiftLevels: true,
				anchorPrefix: 'html-',
				applyAnchorPrefixToCustomId: true,
			}),
		);
		const result = await renderer.render(
			'<h1>Main</h1>\n<h2 id="section">Section</h2>',
		);
		expect(result.html).toEqual(
			'<h2 id="html-main">Main</h2><h3 id="html-section">Section</h3>',
		);
	});

	it('avoid conflict with indented code block', async () => {
		const result = await EzalMarkdown.render(
			'    <div>not html</div>\n\n<div>real html</div>',
		);
		expect(result.html).toEqual(
			'<pre><code>&lt;div&gt;not html&lt;/div&gt;</code></pre><div>real html</div>',
		);
	});

	it('complex nested html with markdown', async () => {
		const renderer = new EzalMarkdown();
		renderer.set(
			...plugins.html({
				parseInnerMarkdown: true,
				disableHeadingSemantics: false,
			}),
		);
		const result = await renderer.render(
			'<div class="content">\n  <h2>Title</h2>\n  <p>*italic* **bold**</p>\n</div>',
		);
		expect(result.html).toEqual(
			'<div class="content">  <h2 id="title">Title</h2>\n  <p><i>italic</i> <b>bold</b></p></div>',
		);
	});

	it('self-closing tags', async () => {
		const result = await EzalMarkdown.render('Line<br>break');
		expect(result.html).toEqual('<p>Line<br>break</p>');
	});
});

describe('Plugin: html-comment', () => {
	it('default', async () => {
		const result = await EzalMarkdown.render('Before<!-- comment -->After');
		expect(result.html).toEqual('<p>Before<!-- comment -->After</p>');
	});

	it('stripHtmlComments=true', async () => {
		const renderer = new EzalMarkdown();
		renderer.set(...plugins.html({ stripHtmlComments: true }));
		const result = await renderer.render('Line1<!-- to be removed -->Line2');
		expect(result.html).toEqual('<p>Line1Line2</p>');
	});

	it('parseCommentMarkdown=false (default)', async () => {
		const result = await EzalMarkdown.render('<!-- *not* **parsed** -->');
		expect(result.html).toEqual('<!-- *not* **parsed** -->');
	});

	it('parseCommentMarkdown=true', async () => {
		const renderer = new EzalMarkdown();
		renderer.set(...plugins.html({ parseCommentMarkdown: true }));
		const result = await renderer.render('<!-- _italic_ __bold__ -->');
		expect(result.html).toEqual('<!--<p> <i>italic</i> <b>bold</b> </p>-->');
	});

	it('combined stripHtmlComments and parseCommentMarkdown', async () => {
		const renderer = new EzalMarkdown();
		renderer.set(
			...plugins.html({
				stripHtmlComments: true,
				parseCommentMarkdown: true,
			}),
		);
		const result = await renderer.render('Text<!-- *content* -->');
		expect(result.html).toEqual('<p>Text</p>');
	});

	it('multiline comments', async () => {
		const renderer = new EzalMarkdown();
		renderer.set(...plugins.html({ parseCommentMarkdown: true }));
		const result = await renderer.render(`<!--
# Heading
* List item
-->`);
		expect(result.html).toEqual(
			'<!--<h1 id="heading">Heading</h1><ul><li>List item</li></ul>-->',
		);
	});

	it('comments with html tags', async () => {
		const renderer = new EzalMarkdown();
		renderer.set(
			...plugins.html({
				parseCommentMarkdown: true,
				parseInnerMarkdown: true,
			}),
		);
		const result = await renderer.render('<!-- <div>*test*</div> -->');
		expect(result.html).toEqual('<!--<p> <div><i>test</i></div> </p>-->');
	});

	it('should not parse comments when stripHtmlComments=true regardless of parseCommentMarkdown', async () => {
		const renderer = new EzalMarkdown();
		renderer.set(
			...plugins.html({
				stripHtmlComments: true,
				parseCommentMarkdown: true,
			}),
		);
		const result = await renderer.render('<!-- **bold** -->');
		expect(result.html).not.toContain('bold');
		expect(result.html).not.toContain('<!--');
		expect(result.html).not.toContain('-->');
	});
});
