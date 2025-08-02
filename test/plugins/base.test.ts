import { describe, expect, it } from 'vitest';
import { EzalMarkdown } from '../../src';

describe('Plugin: escape', () => {
	it('default', async () => {
		const result = await EzalMarkdown.render(
			'\\*escaped asterisk\\* \\`backtick\\` \\#hash \\!bang',
		);
		expect(result.html).toEqual(
			'<p>*escaped asterisk* `backtick` #hash !bang</p>',
		);
	});

	it('escapes special Markdown characters', async () => {
		const result = await EzalMarkdown.render(
			'\\> blockquote \\[link\\]\\(url\\) \\*\\*bold\\*\\* \\_underscore\\_',
		);
		expect(result.html).toEqual(
			'<p>&gt; blockquote [link](url) **bold** _underscore_</p>',
		);
	});

	it('does not escape regular backslashes', async () => {
		const result = await EzalMarkdown.render(
			'C:\\Windows\\Path and Unix/Linux/Path',
		);
		expect(result.html).toEqual('<p>C:\\Windows\\Path and Unix/Linux/Path</p>');
	});

	it('handles escaped backslash at end of line', async () => {
		const result = await EzalMarkdown.render('End with backslash \\');
		expect(result.html).toEqual('<p>End with backslash \\</p>');
	});

	it('does not escape in inline code', async () => {
		const result = await EzalMarkdown.render('`code \\*with\\* escapes`');
		expect(result.html).toEqual('<p><code>code \\*with\\* escapes</code></p>');
	});

	it('does not escape in code blocks', async () => {
		const result = await EzalMarkdown.render('    \\*literal\\* backslashes');
		expect(result.html).toEqual(
			'<pre><code>\\*literal\\* backslashes</code></pre>',
		);
	});

	it('escapes at beginning of line', async () => {
		const result = await EzalMarkdown.render('\\# Not a heading');
		expect(result.html).toEqual('<p># Not a heading</p>');
	});

	it('multiple consecutive escapes', async () => {
		const result = await EzalMarkdown.render('\\\\\\*triple escaped\\*\\\\\\*');
		expect(result.html).toEqual('<p>\\*triple escaped*\\*</p>');
	});
});
