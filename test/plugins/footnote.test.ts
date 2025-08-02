import { describe, expect, it } from 'vitest';
import { EzalMarkdown, plugins } from '../../src';

describe('Plugin: footnote', () => {
	it('default', async () => {
		const result =
			await EzalMarkdown.render(`Here's a sentence with a footnote.[^note]

[^note]: This is the footnote content.`);
		expect(result.html).toEqual(
			`<p>Here's a sentence with a footnote.<a href="#note">note</a></p><dl><dt id="note">note</dt><dd>This is the footnote content.</dd></dl>`,
		);
	});

	it('custom className', async () => {
		const renderer = new EzalMarkdown();
		renderer.set(...plugins.footnote('custom-footnote'));
		const result =
			await renderer.render(`Here's a sentence with a footnote.[^note]

[^note]: This is the footnote content.`);
		expect(result.html).toEqual(
			`<p>Here's a sentence with a footnote.<a href="#note" class="custom-footnote">note</a></p><dl><dt id="note">note</dt><dd>This is the footnote content.</dd></dl>`,
		);
	});

	it('custom idPrefix', async () => {
		const renderer = new EzalMarkdown();
		renderer.set(...plugins.footnote(undefined, 'fn-'));
		const result =
			await renderer.render(`Here's a sentence with a footnote.[^note]

[^note]: This is the footnote content.`);
		expect(result.html).toEqual(
			`<p>Here's a sentence with a footnote.<a href="#fn-note">note</a></p><dl><dt id="fn-note">note</dt><dd>This is the footnote content.</dd></dl>`,
		);
	});

	it('custom className, idPrefix', async () => {
		const renderer = new EzalMarkdown();
		renderer.set(...plugins.footnote('custom-notes', 'note-'));
		const result =
			await renderer.render(`Here's a sentence with a footnote.[^note]

[^note]: This is the footnote content.`);
		expect(result.html).toEqual(
			`<p>Here's a sentence with a footnote.<a href="#note-note" class="custom-notes">note</a></p><dl><dt id="note-note">note</dt><dd>This is the footnote content.</dd></dl>`,
		);
	});

	it('multiple footnotes with custom settings', async () => {
		const renderer = new EzalMarkdown();
		renderer.set(...plugins.footnote('footnote-style', 'ref-'));
		const result =
			await renderer.render(`First footnote[^note1], second footnote[^note2]

[^note1]: First content
[^note2]: Second content`);
		expect(result.html).toEqual(
			`<p>First footnote<a href="#ref-note1" class="footnote-style">note1</a>, second footnote<a href="#ref-note2" class="footnote-style">note2</a></p><dl><dt id="ref-note1">note1</dt><dd>First content</dd><dt id="ref-note2">note2</dt><dd>Second content</dd></dl>`,
		);
	});
});
