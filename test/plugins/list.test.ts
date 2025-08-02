import { describe, expect, it } from 'vitest';
import { EzalMarkdown, plugins } from '../../src';

describe('Plugin: list-ordered', () => {
	it('default', async () => {
		const result = await EzalMarkdown.render(`1. First item
2. Second item
3. Third item`);
		expect(result.html).toEqual(
			'<ol><li>First item</li><li>Second item</li><li>Third item</li></ol>',
		);
	});
});

describe('Plugin: list-unordered', () => {
	it('default', async () => {
		const result = await EzalMarkdown.render(`- First item
- Second item
- Third item`);
		expect(result.html).toEqual(
			'<ul><li>First item</li><li>Second item</li><li>Third item</li></ul>',
		);
	});
});

describe('Plugin: list-task', () => {
	it('default', async () => {
		const result = await EzalMarkdown.render(`- [x] Write the press release
- [ ] Update the website
- [ ] Contact the media`);
		expect(result.html).toEqual(
			'<ul><li><input type="checkbox" checked>Write the press release</li><li><input type="checkbox">Update the website</li><li><input type="checkbox">Contact the media</li></ul>',
		);
	});

	it('with custom className', async () => {
		const renderer = new EzalMarkdown();
		renderer.set(plugins.taskList('task-list'));
		const result = await renderer.render(`- [x] Completed task
- [ ] Pending task`);
		expect(result.html).toEqual(
			'<ul class="task-list"><li><input type="checkbox" checked>Completed task</li><li><input type="checkbox">Pending task</li></ul>',
		);
	});
});
