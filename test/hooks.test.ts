import { describe, expect, it } from 'vitest';
import { EzalMarkdown } from '../src';

describe('Hooks', () => {
	it('execution order', async () => {
		const order: string[] = [];
		const hook = (name: string) => {
			return <T>(data: T): T => {
				order.push(name);
				return data;
			};
		};
		await EzalMarkdown.render('# heading\n**bold**', {
			hooks: {
				prePreprocessing: hook('prePreprocessing'),
				postPreprocessing: hook('postPreprocessing'),
				preFrontmatter: hook('preFrontmatter'),
				postFrontmatter: hook('postFrontmatter'),
				preTokenize: hook('preTokenize'),
				preNormalize: hook('preNormalize'),
				postNormalize: hook('postNormalize'),
				postTokenize: hook('postTokenize'),
				preTransform: hook('preTransform'),
				postTransform: hook('postTransform'),
			},
		});
		expect(order).toEqual([
			'prePreprocessing',
			'postPreprocessing',
			'preTokenize',
			'preTokenize',
			'preNormalize',
			'postNormalize',
			'postTokenize',
			'preTokenize',
			'preNormalize',
			'postNormalize',
			'postTokenize',
			'preNormalize',
			'postNormalize',
			'postTokenize',
			'preTransform',
			'postTransform',
		]);
	});
});
