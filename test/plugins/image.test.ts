import { describe, expect, it } from 'vitest';
import { EzalMarkdown } from '../../src';

describe('Plugin: image', () => {
	it('inline', async () => {
		const result = await EzalMarkdown.render(
			`This is a example image: ![alt text](https://example.com/image.jpg "title text")`,
		);
		expect(result.html).toEqual(
			'<p>This is a example image: <img src="https://example.com/image.jpg" alt="alt text" title="title text"></p>',
		);
	});

	it('block', async () => {
		const result = await EzalMarkdown.render(
			`![alt text](https://example.com/image.jpg "title text")`,
		);
		expect(result.html).toEqual(
			'<img src="https://example.com/image.jpg" alt="alt text" title="title text">',
		);
	});

	it('inline reference', async () => {
		const result =
			await EzalMarkdown.render(`This is ![an example][id] reference-style inline image.

[id]: https://example.com/  "Optional Title Here"`);
		expect(result.html).toEqual(
			'<p>This is <img src="https://example.com/" alt="an example" title="Optional Title Here"> reference-style inline image.</p>',
		);
	});

	it('block reference', async () => {
		const result = await EzalMarkdown.render(`![an example][id]

[id]: https://example.com/  "Optional Title Here"`);
		expect(result.html).toEqual(
			'<img src="https://example.com/" alt="an example" title="Optional Title Here">',
		);
	});
});
