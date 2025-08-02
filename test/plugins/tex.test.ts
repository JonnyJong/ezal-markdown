import { describe, expect, it } from 'vitest';
import { EzalMarkdown, plugins } from '../../src';

describe('Plugin: tex', () => {
	it('default', async () => {
		const result = await EzalMarkdown.render(
			'This is inline $\\LaTeX$.\n$$\\text{This is block }\\LaTeX\\text{.}$$',
		);
		expect(result.html).toEqual(
			'<p>This is inline <span>$\\LaTeX$</span>.</p><p>$$\\text{This is block }\\LaTeX\\text{.}$$</p>',
		);
	});

	it('with custom renderer', async () => {
		const renderer = new EzalMarkdown();
		renderer.set(
			...plugins.tex({
				renderer: (tex, display) =>
					`<tex-${display ? 'block' : 'inline'}>${tex}</tex-${display ? 'block' : 'inline'}>`,
			}),
		);
		const result = await renderer.render(
			'Euler: $e^{i\\pi}+1=0$\n$$\\int_a^b f(x)dx$$',
		);
		expect(result.html).toEqual(
			'<p>Euler: <tex-inline>e^{i\\pi}+1=0</tex-inline></p><tex-block>\\int_a^b f(x)dx</tex-block>',
		);
	});

	it('block tex must start at line beginning', async () => {
		const result = await EzalMarkdown.render(
			'Not block $$x^2$$ because not at start\n$$y^2$$ is block',
		);
		expect(result.html).toEqual(
			'<p>Not block <span>$$</span>x^2<span>$$</span> because not at start\n<span>$$</span>y^2<span>$$</span> is block</p>',
		);
	});

	it('with disableDollarWrapping=true', async () => {
		const renderer = new EzalMarkdown();
		renderer.set(...plugins.tex({ disableDollarWrapping: true }));
		const result = await renderer.render('$x^2$ $$y^2$$');
		expect(result.html).toEqual('<p>$x^2$ $$y^2$$</p>');
	});

	it('with enableBracketWrapping=true', async () => {
		const renderer = new EzalMarkdown();
		renderer.set(...plugins.tex({ enableBracketWrapping: true }));
		const result = await renderer.render('Inline \\(x^2\\) and block \\[y^2\\]');
		expect(result.html).toEqual(
			'<p>Inline <span>\\(x^2\\)</span> and block [y^2]</p>',
		);
	});

	it('with both bracket and dollar wrapping enabled', async () => {
		const renderer = new EzalMarkdown();
		renderer.set(
			...plugins.tex({
				enableBracketWrapping: true,
				renderer: (tex, display) => `[${display ? 'B' : 'b'}:${tex}]`,
			}),
		);
		const result = await renderer.render(
			'Dollar $x$ and bracket \\(y\\)\n$$block$$\n \\[another\\]',
		);
		expect(result.html).toEqual(
			'<p>Dollar [b:x] and bracket [b:y]</p>[B:block]<p> [another]</p>',
		);
	});

	it('escaped dollar signs', async () => {
		const result = await EzalMarkdown.render('Price: \\$100 and math: $x$');
		expect(result.html).toEqual('<p>Price: $100 and math: <span>$x$</span></p>');
	});

	it('multiple inline tex in one paragraph', async () => {
		const result = await EzalMarkdown.render('$a+b$ and $c=d$ are both math');
		expect(result.html).toEqual(
			'<p><span>$a+b$</span> and <span>$c=d$</span> are both math</p>',
		);
	});

	it('block tex with surrounding text', async () => {
		const result = await EzalMarkdown.render('Before\n$$x^2$$\nAfter');
		expect(result.html).toEqual('<p>Before</p><p>$$x^2$$</p><p>After</p>');
	});

	it('function shorthand syntax', async () => {
		const renderer = new EzalMarkdown();
		renderer.set(
			...plugins.tex(
				(tex, display) =>
					`[${display ? 'DISPLAY' : 'INLINE'}]${tex}[/${display ? 'DISPLAY' : 'INLINE'}]`,
			),
		);
		const result = await renderer.render('$x$\n$$y$$');
		expect(result.html).toEqual('<p>[INLINE]x[/INLINE]</p>[DISPLAY]y[/DISPLAY]');
	});
});
