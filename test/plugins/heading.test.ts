import { describe, expect, it } from 'vitest';
import { EzalMarkdown, plugins } from '../../src';

describe('Plugin: heading', () => {
	it('default', async () => {
		const result = await EzalMarkdown.render('### My Great Heading');
		expect(result.html).toEqual(
			'<h3 id="my-great-heading">My Great Heading</h3>',
		);
	});

	it('custom id', async () => {
		const result = await EzalMarkdown.render('### My Great Heading {#custom-id}');
		expect(result.html).toEqual('<h3 id="custom-id">My Great Heading</h3>');
	});

	it('with shiftLevels', async () => {
		const renderer = new EzalMarkdown();
		renderer.set(...plugins.heading({ shiftLevels: true }));
		const result = await renderer.render('# Level 1\n## Level 2\n### Level 3');
		expect(result.html).toEqual(
			'<h2 id="level-1">Level 1</h2><h3 id="level-2">Level 2</h3><h4 id="level-3">Level 3</h4>',
		);
	});

	it('with anchorPrefix only', async () => {
		const renderer = new EzalMarkdown();
		renderer.set(...plugins.heading({ anchorPrefix: 'heading-' }));
		const result = await renderer.render('# Title\n## Subtitle');
		expect(result.html).toEqual(
			'<h1 id="heading-title">Title</h1><h2 id="heading-subtitle">Subtitle</h2>',
		);
	});

	it('with anchorPrefix and applyAnchorPrefixToCustomId=false', async () => {
		const renderer = new EzalMarkdown();
		renderer.set(
			...plugins.heading({
				anchorPrefix: 'prefix-',
				applyAnchorPrefixToCustomId: false,
			}),
		);
		const result = await renderer.render('# Title\n## Subtitle {#custom-sub}');
		expect(result.html).toEqual(
			'<h1 id="prefix-title">Title</h1><h2 id="custom-sub">Subtitle</h2>',
		);
	});

	it('with anchorPrefix and applyAnchorPrefixToCustomId=true', async () => {
		const renderer = new EzalMarkdown();
		renderer.set(
			...plugins.heading({
				anchorPrefix: 'prefix-',
				applyAnchorPrefixToCustomId: true,
			}),
		);
		const result = await renderer.render('# Title\n## Subtitle {#custom-sub}');
		expect(result.html).toEqual(
			'<h1 id="prefix-title">Title</h1><h2 id="prefix-custom-sub">Subtitle</h2>',
		);
	});

	it('with all options', async () => {
		const renderer = new EzalMarkdown();
		renderer.set(
			...plugins.heading({
				shiftLevels: true,
				anchorPrefix: 'sec-',
				applyAnchorPrefixToCustomId: true,
			}),
		);
		const result = await renderer.render(
			'# Main\n## Section {#s1}\n### Subsection',
		);
		expect(result.html).toEqual(
			'<h2 id="sec-main">Main</h2><h3 id="sec-s1">Section</h3><h4 id="sec-subsection">Subsection</h4>',
		);
	});
});
