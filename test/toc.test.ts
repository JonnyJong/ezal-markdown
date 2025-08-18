import { describe, expect, it } from 'vitest';
import { EzalMarkdown } from '../src';

describe('Toc', () => {
	it('values', async () => {
		const md = '# H1\n## H2\n### H3\n#### H4\n##### H5\n###### H6';
		const result = await EzalMarkdown.parse(md);
		expect([...result.context.toc.values()]).toEqual([
			{ name: 'H1', level: 1, anchor: 'h1' },
			{ name: 'H2', level: 2, anchor: 'h2' },
			{ name: 'H3', level: 3, anchor: 'h3' },
			{ name: 'H4', level: 4, anchor: 'h4' },
			{ name: 'H5', level: 5, anchor: 'h5' },
			{ name: 'H6', level: 6, anchor: 'h6' },
		]);
	});

	it('toMarkdown', async () => {
		const md = '# H1\n## H2\n### H3\n#### H4\n##### H5\n###### H6';
		const result = await EzalMarkdown.parse(md);
		expect(result.context.toc.toMarkdown()).toBe(`- [H1](#h1)
  - [H2](#h2)
    - [H3](#h3)
      - [H4](#h4)
        - [H5](#h5)
          - [H6](#h6)`);
	});
});
