/** @see https://spec.commonmark.org/0.31.2/#emphasis-and-strong-emphasis */

import { describe, expect, it } from 'vitest';
import { EzalMarkdown } from '../../src';
import { ASTLikeNode, initAstMatcher } from '../ast';

initAstMatcher();

describe('CommonMark: Emphasis and strong emphasis', () => {
	it('Example 350', async () => {
		const md = '*foo bar*';
		const ast: ASTLikeNode = ['document', ['paragraph', ['#emph', 'foo bar']]];
		const html = '<p><em>foo bar</em></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 351', async () => {
		const md = 'a * foo bar*';
		const ast: ASTLikeNode = ['document', ['paragraph', 'a * foo bar*']];
		const html = '<p>a * foo bar*</p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 352', async () => {
		const md = 'a*"foo"*';
		const ast: ASTLikeNode = ['document', ['paragraph', 'a*"foo"*']];
		const html = '<p>a*&quot;foo&quot;*</p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 353', async () => {
		const md = '*\u00A0a\u00A0*';
		const ast: ASTLikeNode = ['document', ['paragraph', '*\u00A0a\u00A0*']];
		const html = '<p>*\u00A0a\u00A0*</p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 354', async () => {
		const md = '*$*alpha.\n\n*£*bravo.\n\n*€*charlie.';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', '*$*alpha.'],
			['paragraph', '*£*bravo.'],
			['paragraph', '*€*charlie.'],
		];
		const html = '<p>*$*alpha.</p><p>*£*bravo.</p><p>*€*charlie.</p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 355', async () => {
		const md = 'foo*bar*';
		const ast: ASTLikeNode = ['document', ['paragraph', 'foo', ['#emph', 'bar']]];
		const html = '<p>foo<em>bar</em></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 356', async () => {
		const md = '5*6*78';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', '5', ['#emph', '6'], '78'],
		];
		const html = '<p>5<em>6</em>78</p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 357', async () => {
		const md = '_foo bar_';
		const ast: ASTLikeNode = ['document', ['paragraph', ['#emph', 'foo bar']]];
		const html = '<p><em>foo bar</em></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 358', async () => {
		const md = '_ foo bar_';
		const ast: ASTLikeNode = ['document', ['paragraph', '_ foo bar_']];
		const html = '<p>_ foo bar_</p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 359', async () => {
		const md = 'a_"foo"_';
		const ast: ASTLikeNode = ['document', ['paragraph', 'a_"foo"_']];
		const html = '<p>a_&quot;foo&quot;_</p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 360', async () => {
		const md = 'foo_bar_';
		const ast: ASTLikeNode = ['document', ['paragraph', 'foo_bar_']];
		const html = '<p>foo_bar_</p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 361', async () => {
		const md = '5_6_78';
		const ast: ASTLikeNode = ['document', ['paragraph', '5_6_78']];
		const html = '<p>5_6_78</p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 362', async () => {
		const md = 'пристаням_стремятся_';
		const ast: ASTLikeNode = ['document', ['paragraph', 'пристаням_стремятся_']];
		const html = '<p>пристаням_стремятся_</p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 363', async () => {
		const md = 'aa_"bb"_cc';
		const ast: ASTLikeNode = ['document', ['paragraph', 'aa_"bb"_cc']];
		const html = '<p>aa_&quot;bb&quot;_cc</p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 364', async () => {
		const md = 'foo-_(bar)_';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', 'foo-', ['#emph', '(bar)']],
		];
		const html = '<p>foo-<em>(bar)</em></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 365', async () => {
		const md = '_foo*';
		const ast: ASTLikeNode = ['document', ['paragraph', '_foo*']];
		const html = '<p>_foo*</p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 366', async () => {
		const md = '*foo bar *';
		const ast: ASTLikeNode = ['document', ['paragraph', '*foo bar *']];
		const html = '<p>*foo bar *</p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 367', async () => {
		const md = '*foo bar\n*';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', '*foo bar', ['#softbreak'], '*'],
		];
		const html = `<p>*foo bar
*</p>`;
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 368', async () => {
		const md = '*(*foo)';
		const ast: ASTLikeNode = ['document', ['paragraph', '*(*foo)']];
		const html = '<p>*(*foo)</p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 369', async () => {
		const md = '*(*foo*)*';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', ['#emph', '(', ['#emph', 'foo'], ')']],
		];
		const html = '<p><em>(<em>foo</em>)</em></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 370', async () => {
		const md = '*foo*bar';
		const ast: ASTLikeNode = ['document', ['paragraph', ['#emph', 'foo'], 'bar']];
		const html = '<p><em>foo</em>bar</p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 371', async () => {
		const md = '_foo bar _';
		const ast: ASTLikeNode = ['document', ['paragraph', '_foo bar _']];
		const html = '<p>_foo bar _</p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 372', async () => {
		const md = '_(_foo)';
		const ast: ASTLikeNode = ['document', ['paragraph', '_(_foo)']];
		const html = '<p>_(_foo)</p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 373', async () => {
		const md = '_(_foo_)_';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', ['#emph', '(', ['#emph', 'foo'], ')']],
		];
		const html = '<p><em>(<em>foo</em>)</em></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 374', async () => {
		const md = '_foo_bar';
		const ast: ASTLikeNode = ['document', ['paragraph', '_foo_bar']];
		const html = '<p>_foo_bar</p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 375', async () => {
		const md = '_пристаням_стремятся';
		const ast: ASTLikeNode = ['document', ['paragraph', '_пристаням_стремятся']];
		const html = '<p>_пристаням_стремятся</p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 376', async () => {
		const md = '_foo_bar_baz_';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', ['#emph', 'foo_bar_baz']],
		];
		const html = '<p><em>foo_bar_baz</em></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 377', async () => {
		const md = '_(bar)_.';
		const ast: ASTLikeNode = ['document', ['paragraph', ['#emph', '(bar)'], '.']];
		const html = '<p><em>(bar)</em>.</p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 378', async () => {
		const md = '**foo bar**';
		const ast: ASTLikeNode = ['document', ['paragraph', ['#strong', 'foo bar']]];
		const html = '<p><strong>foo bar</strong></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 379', async () => {
		const md = '** foo bar**';
		const ast: ASTLikeNode = ['document', ['paragraph', '** foo bar**']];
		const html = '<p>** foo bar**</p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 380', async () => {
		const md = 'a**"foo"**';
		const ast: ASTLikeNode = ['document', ['paragraph', 'a**"foo"**']];
		const html = '<p>a**&quot;foo&quot;**</p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 381', async () => {
		const md = 'foo**bar**';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', 'foo', ['#strong', 'bar']],
		];
		const html = '<p>foo<strong>bar</strong></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 382', async () => {
		const md = '__foo bar__';
		const ast: ASTLikeNode = ['document', ['paragraph', ['#strong', 'foo bar']]];
		const html = '<p><strong>foo bar</strong></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 383', async () => {
		const md = '__ foo bar__';
		const ast: ASTLikeNode = ['document', ['paragraph', '__ foo bar__']];
		const html = '<p>__ foo bar__</p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 384', async () => {
		const md = '__\nfoo bar__';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', '__', ['#softbreak'], 'foo bar__'],
		];
		const html = `<p>__
foo bar__</p>`;
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 385', async () => {
		const md = 'a__"foo"__';
		const ast: ASTLikeNode = ['document', ['paragraph', 'a__"foo"__']];
		const html = '<p>a__&quot;foo&quot;__</p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 386', async () => {
		const md = 'foo__bar__';
		const ast: ASTLikeNode = ['document', ['paragraph', 'foo__bar__']];
		const html = '<p>foo__bar__</p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 387', async () => {
		const md = '5__6__78';
		const ast: ASTLikeNode = ['document', ['paragraph', '5__6__78']];
		const html = '<p>5__6__78</p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 388', async () => {
		const md = 'пристаням__стремятся__';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', 'пристаням__стремятся__'],
		];
		const html = '<p>пристаням__стремятся__</p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 389', async () => {
		const md = '__foo, __bar__, baz__';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', ['#strong', 'foo, ', ['#strong', 'bar'], ', baz']],
		];
		const html = '<p><strong>foo, <strong>bar</strong>, baz</strong></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 390', async () => {
		const md = 'foo-__(bar)__';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', 'foo-', ['#strong', '(bar)']],
		];
		const html = '<p>foo-<strong>(bar)</strong></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 391', async () => {
		const md = '**foo bar **';
		const ast: ASTLikeNode = ['document', ['paragraph', '**foo bar **']];
		const html = '<p>**foo bar **</p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 392', async () => {
		const md = '**(**foo)';
		const ast: ASTLikeNode = ['document', ['paragraph', '**(**foo)']];
		const html = '<p>**(**foo)</p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 393', async () => {
		const md = '*(**foo**)*';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', ['#emph', '(', ['#strong', 'foo'], ')']],
		];
		const html = '<p><em>(<strong>foo</strong>)</em></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 394', async () => {
		const md =
			'**Gomphocarpus (*Gomphocarpus physocarpus*, syn.\n*Asclepias physocarpa*)**';
		const ast: ASTLikeNode = [
			'document',
			[
				'paragraph',
				[
					'#strong',
					'Gomphocarpus (',
					['#emph', 'Gomphocarpus physocarpus'],
					', syn.',
					['#softbreak'],
					['#emph', 'Asclepias physocarpa'],
					')',
				],
			],
		];
		const html = `<p><strong>Gomphocarpus (<em>Gomphocarpus physocarpus</em>, syn.
<em>Asclepias physocarpa</em>)</strong></p>`;
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 395', async () => {
		const md = '**foo "*bar*" foo**';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', ['#strong', 'foo "', ['#emph', 'bar'], '" foo']],
		];
		const html = '<p><strong>foo &quot;<em>bar</em>&quot; foo</strong></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 396', async () => {
		const md = '**foo**bar';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', ['#strong', 'foo'], 'bar'],
		];
		const html = '<p><strong>foo</strong>bar</p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 397', async () => {
		const md = '__foo bar __';
		const ast: ASTLikeNode = ['document', ['paragraph', '__foo bar __']];
		const html = '<p>__foo bar __</p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 398', async () => {
		const md = '__(__foo)';
		const ast: ASTLikeNode = ['document', ['paragraph', '__(__foo)']];
		const html = '<p>__(__foo)</p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 399', async () => {
		const md = '_(__foo__)_';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', ['#emph', '(', ['#strong', 'foo'], ')']],
		];
		const html = '<p><em>(<strong>foo</strong>)</em></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 400', async () => {
		const md = '__foo__bar';
		const ast: ASTLikeNode = ['document', ['paragraph', '__foo__bar']];
		const html = '<p>__foo__bar</p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 401', async () => {
		const md = '__пристаням__стремятся';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', '__пристаням__стремятся'],
		];
		const html = '<p>__пристаням__стремятся</p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 402', async () => {
		const md = '__foo__bar__baz__';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', ['#strong', 'foo__bar__baz']],
		];
		const html = '<p><strong>foo__bar__baz</strong></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 403', async () => {
		const md = '__(bar)__.';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', ['#strong', '(bar)'], '.'],
		];
		const html = '<p><strong>(bar)</strong>.</p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 404', async () => {
		const md = '*foo [bar](/url)*';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', ['#emph', 'foo ', ['#link', 'bar']]],
		];
		const html = '<p><em>foo <a href="/url">bar</a></em></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 405', async () => {
		const md = '*foo\nbar*';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', ['#emph', 'foo', ['#softbreak'], 'bar']],
		];
		const html = `<p><em>foo
bar</em></p>`;
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 406', async () => {
		const md = '_foo __bar__ baz_';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', ['#emph', 'foo ', ['#strong', 'bar'], ' baz']],
		];
		const html = '<p><em>foo <strong>bar</strong> baz</em></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 407', async () => {
		const md = '_foo _bar_ baz_';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', ['#emph', 'foo ', ['#emph', 'bar'], ' baz']],
		];
		const html = '<p><em>foo <em>bar</em> baz</em></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 408', async () => {
		const md = '__foo_ bar_';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', ['#emph', ['#emph', 'foo'], ' bar']],
		];
		const html = '<p><em><em>foo</em> bar</em></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 409', async () => {
		const md = '*foo *bar**';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', ['#emph', 'foo ', ['#emph', 'bar']]],
		];
		const html = '<p><em>foo <em>bar</em></em></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 410', async () => {
		const md = '*foo **bar** baz*';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', ['#emph', 'foo ', ['#strong', 'bar'], ' baz']],
		];
		const html = '<p><em>foo <strong>bar</strong> baz</em></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 411', async () => {
		const md = '*foo**bar**baz*';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', ['#emph', 'foo', ['#strong', 'bar'], 'baz']],
		];
		const html = '<p><em>foo<strong>bar</strong>baz</em></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 412', async () => {
		const md = '*foo**bar*';
		const ast: ASTLikeNode = ['document', ['paragraph', ['#emph', 'foo**bar']]];
		const html = '<p><em>foo**bar</em></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 413', async () => {
		const md = '***foo** bar*';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', ['#emph', ['#strong', 'foo'], ' bar']],
		];
		const html = '<p><em><strong>foo</strong> bar</em></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 414', async () => {
		const md = '*foo **bar***';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', ['#emph', 'foo ', ['#strong', 'bar']]],
		];
		const html = '<p><em>foo <strong>bar</strong></em></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 415', async () => {
		const md = '*foo**bar***';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', ['#emph', 'foo', ['#strong', 'bar']]],
		];
		const html = '<p><em>foo<strong>bar</strong></em></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 416', async () => {
		const md = 'foo***bar***baz';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', 'foo', ['#emph', ['#strong', 'bar']], 'baz'],
		];
		const html = '<p>foo<em><strong>bar</strong></em>baz</p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 417', async () => {
		const md = 'foo******bar*********baz';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', 'foo', ['#strong', ['#strong', ['#strong', 'bar']]], '***baz'],
		];
		const html =
			'<p>foo<strong><strong><strong>bar</strong></strong></strong>***baz</p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 418', async () => {
		const md = '*foo **bar *baz* bim** bop*';
		const ast: ASTLikeNode = [
			'document',
			[
				'paragraph',
				['#emph', 'foo ', ['#strong', 'bar ', ['#emph', 'baz'], ' bim'], ' bop'],
			],
		];
		const html = '<p><em>foo <strong>bar <em>baz</em> bim</strong> bop</em></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 419', async () => {
		const md = '*foo [*bar*](/url)*';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', ['#emph', 'foo ', ['#link', ['#emph', 'bar']]]],
		];
		const html = '<p><em>foo <a href="/url"><em>bar</em></a></em></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 420', async () => {
		const md = '** is not an empty emphasis';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', '** is not an empty emphasis'],
		];
		const html = '<p>** is not an empty emphasis</p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 421', async () => {
		const md = '**** is not an empty strong emphasis';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', '**** is not an empty strong emphasis'],
		];
		const html = '<p>**** is not an empty strong emphasis</p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 422', async () => {
		const md = '**foo [bar](/url)**';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', ['#strong', 'foo ', ['#link', 'bar']]],
		];
		const html = '<p><strong>foo <a href="/url">bar</a></strong></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 423', async () => {
		const md = '**foo\nbar**';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', ['#strong', 'foo', ['#softbreak'], 'bar']],
		];
		const html = `<p><strong>foo
bar</strong></p>`;
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 424', async () => {
		const md = '__foo _bar_ baz__';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', ['#strong', 'foo ', ['#emph', 'bar'], ' baz']],
		];
		const html = '<p><strong>foo <em>bar</em> baz</strong></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 425', async () => {
		const md = '__foo __bar__ baz__';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', ['#strong', 'foo ', ['#strong', 'bar'], ' baz']],
		];
		const html = '<p><strong>foo <strong>bar</strong> baz</strong></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 426', async () => {
		const md = '____foo__ bar__';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', ['#strong', ['#strong', 'foo'], ' bar']],
		];
		const html = '<p><strong><strong>foo</strong> bar</strong></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 427', async () => {
		const md = '**foo **bar****';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', ['#strong', 'foo ', ['#strong', 'bar']]],
		];
		const html = '<p><strong>foo <strong>bar</strong></strong></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 428', async () => {
		const md = '**foo *bar* baz**';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', ['#strong', 'foo ', ['#emph', 'bar'], ' baz']],
		];
		const html = '<p><strong>foo <em>bar</em> baz</strong></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 429', async () => {
		const md = '**foo*bar*baz**';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', ['#strong', 'foo', ['#emph', 'bar'], 'baz']],
		];
		const html = '<p><strong>foo<em>bar</em>baz</strong></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 430', async () => {
		const md = '***foo* bar**';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', ['#strong', ['#emph', 'foo'], ' bar']],
		];
		const html = '<p><strong><em>foo</em> bar</strong></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 431', async () => {
		const md = '**foo *bar***';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', ['#strong', 'foo ', ['#emph', 'bar']]],
		];
		const html = '<p><strong>foo <em>bar</em></strong></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 432', async () => {
		const md = '**foo *bar **baz**\nbim* bop**';
		const ast: ASTLikeNode = [
			'document',
			[
				'paragraph',
				[
					'#strong',
					'foo ',
					['#emph', 'bar ', ['#strong', 'baz'], ['#softbreak'], 'bim'],
					' bop',
				],
			],
		];
		const html = `<p><strong>foo <em>bar <strong>baz</strong>
bim</em> bop</strong></p>`;
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 433', async () => {
		const md = '**foo [*bar*](/url)**';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', ['#strong', 'foo ', ['#link', ['#emph', 'bar']]]],
		];
		const html = '<p><strong>foo <a href="/url"><em>bar</em></a></strong></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 434', async () => {
		const md = '__ is not an empty emphasis';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', '__ is not an empty emphasis'],
		];
		const html = '<p>__ is not an empty emphasis</p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 435', async () => {
		const md = '____ is not an empty strong emphasis';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', '____ is not an empty strong emphasis'],
		];
		const html = '<p>____ is not an empty strong emphasis</p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 436', async () => {
		const md = 'foo ***';
		const ast: ASTLikeNode = ['document', ['paragraph', 'foo ***']];
		const html = '<p>foo ***</p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 437', async () => {
		const md = 'foo *\\**';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', 'foo ', ['#emph', [['#escape', { char: '*' }]]]],
		];
		const html = '<p>foo <em>*</em></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 438', async () => {
		const md = 'foo *_*';
		const ast: ASTLikeNode = ['document', ['paragraph', 'foo ', ['#emph', '_']]];
		const html = '<p>foo <em>_</em></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 439', async () => {
		const md = 'foo *****';
		const ast: ASTLikeNode = ['document', ['paragraph', 'foo *****']];
		const html = '<p>foo *****</p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 440', async () => {
		const md = 'foo **\\***';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', 'foo ', ['#strong', [['#escape', { char: '*' }]]]],
		];
		const html = '<p>foo <strong>*</strong></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 441', async () => {
		const md = 'foo **_**';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', 'foo ', ['#strong', '_']],
		];
		const html = '<p>foo <strong>_</strong></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 442', async () => {
		const md = '**foo*';
		const ast: ASTLikeNode = ['document', ['paragraph', '*', ['#emph', 'foo']]];
		const html = '<p>*<em>foo</em></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 443', async () => {
		const md = '*foo**';
		const ast: ASTLikeNode = ['document', ['paragraph', ['#emph', 'foo'], '*']];
		const html = '<p><em>foo</em>*</p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 444', async () => {
		const md = '***foo**';
		const ast: ASTLikeNode = ['document', ['paragraph', '*', ['#strong', 'foo']]];
		const html = '<p>*<strong>foo</strong></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 445', async () => {
		const md = '****foo*';
		const ast: ASTLikeNode = ['document', ['paragraph', '***', ['#emph', 'foo']]];
		const html = '<p>***<em>foo</em></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 446', async () => {
		const md = '**foo***';
		const ast: ASTLikeNode = ['document', ['paragraph', ['#strong', 'foo'], '*']];
		const html = '<p><strong>foo</strong>*</p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 447', async () => {
		const md = '*foo****';
		const ast: ASTLikeNode = ['document', ['paragraph', ['#emph', 'foo'], '***']];
		const html = '<p><em>foo</em>***</p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 448', async () => {
		const md = 'foo ___';
		const ast: ASTLikeNode = ['document', ['paragraph', 'foo ___']];
		const html = '<p>foo ___</p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 449', async () => {
		const md = 'foo _\\__';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', 'foo ', ['#emph', [['#escape', { char: '_' }]]]],
		];
		const html = '<p>foo <em>_</em></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 450', async () => {
		const md = 'foo _*_';
		const ast: ASTLikeNode = ['document', ['paragraph', 'foo ', ['#emph', '*']]];
		const html = '<p>foo <em>*</em></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 451', async () => {
		const md = 'foo _____';
		const ast: ASTLikeNode = ['document', ['paragraph', 'foo _____']];
		const html = '<p>foo _____</p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 452', async () => {
		const md = 'foo __\\___';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', 'foo ', ['#strong', [['#escape', { char: '_' }]]]],
		];
		const html = '<p>foo <strong>_</strong></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 453', async () => {
		const md = 'foo __*__';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', 'foo ', ['#strong', '*']],
		];
		const html = '<p>foo <strong>*</strong></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 454', async () => {
		const md = '__foo_';
		const ast: ASTLikeNode = ['document', ['paragraph', '_', ['#emph', 'foo']]];
		const html = '<p>_<em>foo</em></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 455', async () => {
		const md = '_foo__';
		const ast: ASTLikeNode = ['document', ['paragraph', ['#emph', 'foo'], '_']];
		const html = '<p><em>foo</em>_</p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 456', async () => {
		const md = '___foo__';
		const ast: ASTLikeNode = ['document', ['paragraph', '_', ['#strong', 'foo']]];
		const html = '<p>_<strong>foo</strong></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 457', async () => {
		const md = '____foo_';
		const ast: ASTLikeNode = ['document', ['paragraph', '___', ['#emph', 'foo']]];
		const html = '<p>___<em>foo</em></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 458', async () => {
		const md = '__foo___';
		const ast: ASTLikeNode = ['document', ['paragraph', ['#strong', 'foo'], '_']];
		const html = '<p><strong>foo</strong>_</p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 459', async () => {
		const md = '_foo____';
		const ast: ASTLikeNode = ['document', ['paragraph', ['#emph', 'foo'], '___']];
		const html = '<p><em>foo</em>___</p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 460', async () => {
		const md = '**foo**';
		const ast: ASTLikeNode = ['document', ['paragraph', ['#strong', 'foo']]];
		const html = '<p><strong>foo</strong></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 461', async () => {
		const md = '*_foo_*';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', ['#emph', ['#emph', 'foo']]],
		];
		const html = '<p><em><em>foo</em></em></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 462', async () => {
		const md = '__foo__';
		const ast: ASTLikeNode = ['document', ['paragraph', ['#strong', 'foo']]];
		const html = '<p><strong>foo</strong></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 463', async () => {
		const md = '_*foo*_';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', ['#emph', ['#emph', 'foo']]],
		];
		const html = '<p><em><em>foo</em></em></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 464', async () => {
		const md = '****foo****';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', ['#strong', ['#strong', 'foo']]],
		];
		const html = '<p><strong><strong>foo</strong></strong></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 465', async () => {
		const md = '____foo____';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', ['#strong', ['#strong', 'foo']]],
		];
		const html = '<p><strong><strong>foo</strong></strong></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 466', async () => {
		const md = '******foo******';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', ['#strong', ['#strong', ['#strong', 'foo']]]],
		];
		const html = '<p><strong><strong><strong>foo</strong></strong></strong></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 467', async () => {
		const md = '***foo***';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', ['#emph', ['#strong', 'foo']]],
		];
		const html = '<p><em><strong>foo</strong></em></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 468', async () => {
		const md = '_____foo_____';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', ['#emph', ['#strong', ['#strong', 'foo']]]],
		];
		const html = '<p><em><strong><strong>foo</strong></strong></em></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 469', async () => {
		const md = '*foo _bar* baz_';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', ['#emph', 'foo _bar'], ' baz_'],
		];
		const html = '<p><em>foo _bar</em> baz_</p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 470', async () => {
		const md = '*foo __bar *baz bim__ bam*';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', ['#emph', 'foo ', ['#strong', 'bar *baz bim'], ' bam']],
		];
		const html = '<p><em>foo <strong>bar *baz bim</strong> bam</em></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 471', async () => {
		const md = '**foo **bar baz**';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', '**foo ', ['#strong', 'bar baz']],
		];
		const html = '<p>**foo <strong>bar baz</strong></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 472', async () => {
		const md = '*foo *bar baz*';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', '*foo ', ['#emph', 'bar baz']],
		];
		const html = '<p>*foo <em>bar baz</em></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 473', async () => {
		const md = '*[bar*](/url)';
		const ast: ASTLikeNode = ['document', ['paragraph', '*', ['#link', 'bar*']]];
		const html = '<p>*<a href="/url">bar*</a></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 474', async () => {
		const md = '_foo [bar_](/url)';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', '_foo ', ['#link', 'bar_']],
		];
		const html = '<p>_foo <a href="/url">bar_</a></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 475', async () => {
		const md = '*<img src="foo" title="*"/>';
		const ast: ASTLikeNode = ['document', ['paragraph', '*', ['#html']]];
		const html = '<p>*<img src="foo" title="*"/></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 476', async () => {
		const md = '**<a href="**">';
		const ast: ASTLikeNode = ['document', ['paragraph', '**', ['#html']]];
		const html = '<p>**<a href="**"></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 477', async () => {
		const md = '__<a href="__">';
		const ast: ASTLikeNode = ['document', ['paragraph', '__', ['#html']]];
		const html = '<p>__<a href="__"></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 478', async () => {
		const md = '*a `*`*';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', ['#emph', 'a ', ['#code']]],
		];
		const html = '<p><em>a <code>*</code></em></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 479', async () => {
		const md = '_a `_`_';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', ['#emph', 'a ', ['#code']]],
		];
		const html = '<p><em>a <code>_</code></em></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 480', async () => {
		const md = '**a<https://foo.bar/?q=**>';
		const ast: ASTLikeNode = ['document', ['paragraph', '**a', ['#autolink']]];
		const html =
			'<p>**a<a href="https://foo.bar/?q=**" target="_blank">https://foo.bar/?q=**</a></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 481', async () => {
		const md = '__a<https://foo.bar/?q=__>';
		const ast: ASTLikeNode = ['document', ['paragraph', '__a', ['#autolink']]];
		const html =
			'<p>__a<a href="https://foo.bar/?q=__" target="_blank">https://foo.bar/?q=__</a></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});
});
