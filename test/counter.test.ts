import { describe, expect, it } from 'vitest';
import { EzalMarkdown } from '../src';

describe('Counter', () => {
	it('Empty', async () => {
		const md = '';
		const result = await EzalMarkdown.renderHTML(md);
		expect(result.context.counter.latin).toBe(0);
		expect(result.context.counter.cjk).toBe(0);
		expect(result.context.counter.value).toBe(0);
		expect(result.context.counter.minute2read()).toBe(0);
	});
	it('Latin only', async () => {
		const md = 'foo bar baz bim!';
		const result = await EzalMarkdown.renderHTML(md);
		expect(result.context.counter.latin).toBe(4);
		expect(result.context.counter.cjk).toBe(0);
		expect(result.context.counter.value).toBe(4);
		expect(result.context.counter.minute2read()).not.toBe(0);
	});
	it('CJK only', async () => {
		const md = '你好世界！';
		const result = await EzalMarkdown.renderHTML(md);
		expect(result.context.counter.latin).toBe(0);
		expect(result.context.counter.cjk).toBe(4);
		expect(result.context.counter.value).toBe(4);
		expect(result.context.counter.minute2read()).not.toBe(0);
	});
	it('Mixed', async () => {
		const md = '你好世界！\\\nHello World';
		const result = await EzalMarkdown.renderHTML(md);
		expect(result.context.counter.latin).toBe(2);
		expect(result.context.counter.cjk).toBe(4);
		expect(result.context.counter.value).toBe(6);
		expect(result.context.counter.minute2read()).not.toBe(0);
	});
});
