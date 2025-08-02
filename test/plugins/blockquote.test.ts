import { describe, expect, it } from 'vitest';
import { EzalMarkdown } from '../../src';

describe('Plugin: blockquote', () => {
	it('default', async () => {
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

	it('nested', async () => {
		const result = await EzalMarkdown.render(`> First level
> > Second level
> >
> > With multiple lines
> > > Third level
> Back to first level`);
		expect(result.html).toEqual(
			'<blockquote>First level<blockquote>Second level<br>With multiple lines<blockquote>Third level</blockquote></blockquote>Back to first level</blockquote>',
		);
	});
});
