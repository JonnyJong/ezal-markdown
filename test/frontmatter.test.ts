import { describe, expect, it } from 'vitest';
import {
	FrontmatterExtractResult,
	extractFrontmatter,
} from '../src/frontmatter';

const DATA_NOTHING = 'No frontmatter';
const DATA_SINGLE = `---
title: Title Here
json: { "json": "data" }
list:
  - A
  - B
  - C
number: 123
---
Markdown main body`;
const RESULT_SINGLE: FrontmatterExtractResult = {
	raw: `---
title: Title Here
json: { "json": "data" }
list:
  - A
  - B
  - C
number: 123
---`,
	data: {
		title: 'Title Here',
		json: { json: 'data' },
		list: ['A', 'B', 'C'],
		number: 123,
	},
	content: [],
	errors: undefined,
};
RESULT_SINGLE.content.push(RESULT_SINGLE.data);
const DATA_MULTI = `-----
title: doc1
---
title: doc2
-----
Markdown main body`;
const RESULT_MULTI: FrontmatterExtractResult = {
	raw: `-----
title: doc1
---
title: doc2
-----`,
	data: { title: 'doc1' },
	content: [{ title: 'doc1' }, { title: 'doc2' }],
	errors: undefined,
};

describe('Frontmatter', () => {
	it('nothing', () => {
		expect(extractFrontmatter(DATA_NOTHING)).toBeUndefined();
	});
	it('single', () => {
		expect(extractFrontmatter(DATA_SINGLE)).toStrictEqual(RESULT_SINGLE);
	});
	it('multi', () => {
		expect(extractFrontmatter(DATA_MULTI)).toStrictEqual(RESULT_MULTI);
	});
});
