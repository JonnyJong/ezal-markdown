import { describe, expect, it } from 'vitest';
import { EzalMarkdown } from '../../src';

describe('Plugin: bold', () => {
	it('default', async () => {
		const result = await EzalMarkdown.render('This is **bold** text.');
		expect(result.html).toEqual('<p>This is <b>bold</b> text.</p>');
	});
});

describe('Plugin: italic', () => {
	it('default', async () => {
		const result = await EzalMarkdown.render('This is *italic* text.');
		expect(result.html).toEqual('<p>This is <i>italic</i> text.</p>');
	});
});

describe('Plugin: bold-italic', () => {
	it('default', async () => {
		const result = await EzalMarkdown.render(
			'This is ***bold and italic*** text.',
		);
		expect(result.html).toEqual(
			'<p>This is <b><i>bold and italic</i></b> text.</p>',
		);
	});
});

describe('Plugin: strikethrough', () => {
	it('default', async () => {
		const result = await EzalMarkdown.render('This is ~~strikethrough~~ text.');
		expect(result.html).toEqual('<p>This is <del>strikethrough</del> text.</p>');
	});
});
