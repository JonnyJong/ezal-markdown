import { describe, expect, it } from 'vitest';
import { EzalMarkdown } from '../../src';

describe('Plugin: link', () => {
	it('default', async () => {
		const result = await EzalMarkdown.render(
			`这是一个链接 [Jonnys' Blog](https://jonnys.top)。`,
		);
		expect(result.html).toEqual(
			`<p>这是一个链接 <a href="https://jonnys.top" target="_blank">Jonnys' Blog</a>。</p>`,
		);
	});

	it('with title', async () => {
		const result = await EzalMarkdown.render(
			`这是一个链接 [Jonnys' Blog](https://jonnys.top "欢迎光临小站")。`,
		);
		expect(result.html).toEqual(
			`<p>这是一个链接 <a href="https://jonnys.top" title="欢迎光临小站" target="_blank">Jonnys' Blog</a>。</p>`,
		);
	});

	it('bracket', async () => {
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

	it('reference', async () => {
		const result =
			await EzalMarkdown.render(`This is [an example][id] reference-style link.

[id]: https://example.com/  "Optional Title Here"`);
		expect(result.html).toEqual(
			`<p>This is <a href="https://example.com/" title="Optional Title Here" target="_blank">an example</a> reference-style link.</p>`,
		);
	});
});
