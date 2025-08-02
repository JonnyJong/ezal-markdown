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
