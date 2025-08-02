import { describe, expect, it } from 'vitest';
import { EzalMarkdown, plugins, utils } from '../../src';

describe('Plugin: code', () => {
	it('default', async () => {
		const result = await EzalMarkdown.render('This is `inline code` example.');
		expect(result.html).toEqual(
			'<p>This is <code>inline code</code> example.</p>',
		);
	});

	it('with backtick inside', async () => {
		const result = await EzalMarkdown.render(
			'This contains ``code with ` backtick`` example.',
		);
		expect(result.html).toEqual(
			'<p>This contains <code>code with ` backtick</code> example.</p>',
		);
	});
});

describe('Plugin: codeblock', () => {
	it('default', async () => {
		const result = await EzalMarkdown.render(`    function hello() {
        console.log("Hello, world!");
    }`);
		expect(result.html).toEqual(`<pre><code>function hello() {
    console.log(&quot;Hello, world!&quot;);
}</code></pre>`);
	});

	it('custom highlighter', async () => {
		const renderer = new EzalMarkdown();
		renderer.set(
			...plugins.codeblock((code: string, lang?: string) => {
				return { html: utils.escapeHTML(code), className: `custom-${lang ?? ''}` };
			}),
		);
		const result = await renderer.render(`    function hello() {
        console.log("Hello, world!");
    }`);
		expect(result.html).toEqual(`<pre class="custom-"><code>function hello() {
    console.log(&quot;Hello, world!&quot;);
}</code></pre>`);
	});
});

describe('Plugin: codeblock-fenced', () => {
	it('default', async () => {
		const result = await EzalMarkdown.render(
			'```javascript\nfunction hello() {\n    console.log("Hello, world!");\n}\n```',
		);
		expect(result.html).toEqual(`<pre><code>function hello() {
    console.log(&quot;Hello, world!&quot;);
}</code></pre>`);
	});

	it('more backticks', async () => {
		const result = await EzalMarkdown.render(
			'````\n```js\nnested backticks\n```\n````',
		);
		expect(result.html).toEqual(
			'<pre><code>```js\nnested backticks\n```</code></pre>',
		);
	});

	it('tilde', async () => {
		const result = await EzalMarkdown.render('~~~js\nconsole.log("Tilde");\n~~~');
		expect(result.html).toEqual(
			'<pre><code>console.log(&quot;Tilde&quot;);</code></pre>',
		);
	});

	it('more tildes', async () => {
		const result = await EzalMarkdown.render(
			'~~~~\n~~~\nnested tildes\n~~~\n~~~~',
		);
		expect(result.html).toEqual(
			'<pre><code>~~~\nnested tildes\n~~~</code></pre>',
		);
	});

	it('custom highlighter', async () => {
		const renderer = new EzalMarkdown();
		renderer.set(
			...plugins.codeblock((code: string, lang?: string) => {
				return { html: utils.escapeHTML(code), className: `custom-${lang ?? ''}` };
			}),
		);
		const result = await renderer.render(
			'```javascript\nfunction hello() {\n    console.log("Hello, world!");\n}\n```',
		);
		expect(
			result.html,
		).toEqual(`<pre class="custom-javascript"><code>function hello() {
    console.log(&quot;Hello, world!&quot;);
}</code></pre>`);
	});
});
