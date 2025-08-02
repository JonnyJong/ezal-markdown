import { describe, expect, it } from 'vitest';
import { EzalMarkdown } from '../../src';

describe('Plugin: hr', () => {
	it('default', async () => {
		const result = await EzalMarkdown.render(`---

Above is a horizontal rule`);
		expect(result.html).toEqual('<hr><p>Above is a horizontal rule</p>');
	});
});
