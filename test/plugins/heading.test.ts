/** @see https://spec.commonmark.org/0.31.2/#atx-headings */

import { describe, expect, it } from 'vitest';
import { EzalMarkdown } from '../../src';
import { heading } from '../../src/plugins/heading';
import { ASTLikeNode, initAstMatcher } from '../ast';

initAstMatcher();

describe('Plugin: atx-heading', () => {
	it('shiftLevels', async () => {
		const md = `# foo
## foo
### foo
#### foo
##### foo
###### foo`;
		const ast: ASTLikeNode = [
			'document',
			[
				['atx-heading', { level: 2 }],
				['#item', 'foo'],
			],
			[
				['atx-heading', { level: 3 }],
				['#item', 'foo'],
			],
			[
				['atx-heading', { level: 4 }],
				['#item', 'foo'],
			],
			[
				['atx-heading', { level: 5 }],
				['#item', 'foo'],
			],
			[
				['atx-heading', { level: 6 }],
				['#item', 'foo'],
			],
			[
				['atx-heading', { level: 6 }],
				['#item', 'foo'],
			],
		];
		const renderer = new EzalMarkdown();
		renderer.set(heading({ shiftLevels: true }));
		const result = await renderer.parse(md);
		expect(result.document).toLikeAst(ast);
	});

	it('anchorPrefix', async () => {
		const md = '# bar';
		const ast: ASTLikeNode = [
			'document',
			[
				['atx-heading', { anchor: 'foo-bar' }],
				['#item', 'bar'],
			],
		];
		const renderer = new EzalMarkdown();
		renderer.set(heading({ anchorPrefix: 'foo-' }));
		const result = await renderer.parse(md);
		expect(result.document).toLikeAst(ast);
	});

	it('enableCustomId', async () => {
		const md = `# foo
## bar {#bar-baz}`;
		const ast: ASTLikeNode = [
			'document',
			[
				['atx-heading', { anchor: 'foo' }],
				['#item', 'foo'],
			],
			[
				['atx-heading', { anchor: 'bar-baz' }],
				['#item', 'bar'],
			],
		];
		const renderer = new EzalMarkdown();
		renderer.set(heading({ enableCustomId: true }));
		const result = await renderer.parse(md);
		expect(result.document).toLikeAst(ast);
	});

	it('applyAnchorPrefixToCustomId', async () => {
		const md = `# foo
## bar {#bar-baz}`;
		const ast: ASTLikeNode = [
			'document',
			[
				['atx-heading', { anchor: 'foo-foo' }],
				['#item', 'foo'],
			],
			[
				['atx-heading', { anchor: 'foo-bar-baz' }],
				['#item', 'bar'],
			],
		];
		const renderer = new EzalMarkdown();
		renderer.set(
			heading({
				enableCustomId: true,
				applyAnchorPrefixToCustomId: true,
				anchorPrefix: 'foo-',
			}),
		);
		const result = await renderer.parse(md);
		expect(result.document).toLikeAst(ast);
	});
});
