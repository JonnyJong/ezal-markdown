/** @see https://spec.commonmark.org/0.31.2/#raw-html */

import { describe, expect, it } from 'vitest';
import { EzalMarkdown } from '../../src';
import { ASTLikeNode, initAstMatcher } from '../ast';

initAstMatcher();

describe('CommonMark: Raw HTML', () => {
	it('Example 613', async () => {
		const md = '<a><bab><c2c>';
		const ast: ASTLikeNode = [
			'document',
			[
				'paragraph',
				[['#html', { raw: '<a>' }]],
				[['#html', { raw: '<bab>' }]],
				[['#html', { raw: '<c2c>' }]],
			],
		];
		const html = '<p><a><bab><c2c></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 614', async () => {
		const md = '<a/><b2/>';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', [['#html', { raw: '<a/>' }]], [['#html', { raw: '<b2/>' }]]],
		];
		const html = '<p><a/><b2/></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 615', async () => {
		const md = '<a  /><b2\ndata="foo" >';
		const ast: ASTLikeNode = [
			'document',
			[
				'paragraph',
				[['#html', { raw: '<a  />' }]],
				[['#html', { raw: '<b2\ndata="foo" >' }]],
			],
		];
		const html = `<p><a  /><b2
data="foo" ></p>`;
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it.todo('Example 616', async () => {
		const md = `<a foo="bar" bam = 'baz <em>"</em>'\n_boolean zoop:33=zoop:33 />`;
		const ast: ASTLikeNode = ['document', ['#html']];
		const html = `<a foo="bar" bam = 'baz <em>"</em>'\n_boolean zoop:33=zoop:33 />`;
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 617', async () => {
		const md = 'Foo <responsive-image src="foo.jpg" />';
		const ast: ASTLikeNode = [
			'document',
			[
				'paragraph',
				'Foo ',
				[['#html', { raw: '<responsive-image src="foo.jpg" />' }]],
			],
		];
		const html = '<p>Foo <responsive-image src="foo.jpg" /></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 618', async () => {
		const md = '<33> <__>';
		const ast: ASTLikeNode = ['document', ['paragraph', '<33> <__>']];
		const html = '<p>&lt;33&gt; &lt;__&gt;</p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 619', async () => {
		const md = '<a h*#ref="hi">';
		const ast: ASTLikeNode = ['document', ['paragraph', '<a h*#ref="hi">']];
		const html = '<p>&lt;a h*#ref=&quot;hi&quot;&gt;</p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 620', async () => {
		const md = `<a href="hi'> <a href=hi'>`;
		const ast: ASTLikeNode = [
			'document',
			['paragraph', "<a href=\"hi'> <a href=hi'>"],
		];
		const html = '<p>&lt;a href=&quot;hi&#39;&gt; &lt;a href=hi&#39;&gt;</p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 621', async () => {
		const md = '< a><\nfoo><bar/ >\n<foo bar=baz\nbim!bop />';
		const ast: ASTLikeNode = [
			'document',
			[
				'paragraph',
				'< a><',
				['#softbreak'],
				'foo><bar/ >',
				['#softbreak'],
				'<foo bar=baz',
				['#softbreak'],
				'bim!bop />',
			],
		];
		const html = `<p>&lt; a&gt;&lt;
foo&gt;&lt;bar/ &gt;
&lt;foo bar=baz
bim!bop /&gt;</p>`;
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 622', async () => {
		const md = `<a href='bar'title=title>`;
		const ast: ASTLikeNode = ['document', ['html']];
		const html = `<a href='bar'title=title>`;
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 623', async () => {
		const md = '</a></foo >';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', [['#html', { raw: '</a>' }]], [['#html', { raw: '</foo >' }]]],
		];
		const html = '<p></a></foo ></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 624', async () => {
		const md = '</a href="foo">';
		const ast: ASTLikeNode = ['document', ['paragraph', '</a href="foo">']];
		const html = '<p>&lt;/a href=&quot;foo&quot;&gt;</p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 625', async () => {
		const md = 'foo <!-- this is a --\ncomment - with hyphens -->';
		const ast: ASTLikeNode = [
			'document',
			[
				'paragraph',
				'foo ',
				[['#html', { raw: '<!-- this is a --\ncomment - with hyphens -->' }]],
			],
		];
		const html = `<p>foo <!-- this is a --
comment - with hyphens --></p>`;
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 626', async () => {
		const md = 'foo <!--> foo -->\n\nfoo <!---> foo -->';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', 'foo ', [['#html', { raw: '<!-->' }]], ' foo -->'],
			['paragraph', 'foo ', [['#html', { raw: '<!--->' }]], ' foo -->'],
		];
		const html = '<p>foo <!--> foo --&gt;</p><p>foo <!---> foo --&gt;</p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 627', async () => {
		const md = 'foo <?php echo $a; ?>';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', 'foo ', [['#html', { raw: '<?php echo $a; ?>' }]]],
		];
		const html = '<p>foo <?php echo $a; ?></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 628', async () => {
		const md = 'foo <!ELEMENT br EMPTY>';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', 'foo ', [['#html', { raw: '<!ELEMENT br EMPTY>' }]]],
		];
		const html = '<p>foo <!ELEMENT br EMPTY></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 629', async () => {
		const md = 'foo <![CDATA[>&<]]>';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', 'foo ', [['#html', { raw: '<![CDATA[>&<]]>' }]]],
		];
		const html = '<p>foo <![CDATA[>&<]]></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 630', async () => {
		const md = 'foo <a href="&ouml;">';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', 'foo ', [['#html', { raw: '<a href="&ouml;">' }]]],
		];
		const html = '<p>foo <a href="&ouml;"></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 631', async () => {
		const md = 'foo <a href="\\*">';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', 'foo ', [['#html', { raw: '<a href="\\*">' }]]],
		];
		const html = '<p>foo <a href="\\*"></p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});

	it('Example 632', async () => {
		const md = '<a href="\\"">';
		const ast: ASTLikeNode = [
			'document',
			['paragraph', '<a href="', ['#escape'], '">'],
		];
		const html = '<p>&lt;a href=&quot;&quot;&quot;&gt;</p>';
		const result = await EzalMarkdown.parse(md);
		expect(result.document).toLikeAst(ast);
		const rendered = await EzalMarkdown.renderHTML(
			result.document,
			result.options,
		);
		expect(rendered.html).toBe(html);
	});
});
