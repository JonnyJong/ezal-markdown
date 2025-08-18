/** @see https://github.github.com/gfm/#task-list-items-extension- */

import { describe, expect, it } from 'vitest';
import { EzalMarkdown } from '../../src';
import { ASTLikeNode, initAstMatcher } from '../ast';

initAstMatcher();

describe('GFM: Task list item', () => {
	it('Example 279', async () => {
		const md = '- [ ] foo\n- [x] bar';
		const ast: ASTLikeNode = [
			'document',
			[
				['list', { tasks: [false, true] }],
				['item', 'foo'],
				['item', 'bar'],
			],
		];
		const html =
			'<ul><li><input type="checkbox" disabled>foo</li><li><input type="checkbox" disabled checked>bar</li></ul>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 280', async () => {
		const md = '- [x] foo\n  - [ ] bar\n  - [x] baz\n- [ ] bim';
		const ast: ASTLikeNode = [
			'document',
			[
				['list', { tasks: [true, false] }],
				[
					'item',
					'foo',
					[
						['list', { tasks: [false, true] }],
						['item', 'bar'],
						['item', 'baz'],
					],
				],
				['item', 'bim'],
			],
		];
		const html =
			'<ul><li><input type="checkbox" disabled checked>foo<ul><li><input type="checkbox" disabled>bar</li><li><input type="checkbox" disabled checked>baz</li></ul></li><li><input type="checkbox" disabled>bim</li></ul>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});
});
