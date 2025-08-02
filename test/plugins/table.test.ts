import { describe, expect, it } from 'vitest';
import { EzalMarkdown } from '../../src';

describe('Plugin: table', () => {
	it('default', async () => {
		const result = await EzalMarkdown.render(`| Syntax      | Description |
| ----------- | ----------- |
| Header      | Title       |
| Paragraph   | Text        |`);
		expect(result.html).toEqual(
			'<table><thead><tr><th>Syntax</th><th>Description</th></tr></thead><tbody><tr><td>Header</td><td>Title</td></tr><tr><td>Paragraph</td><td>Text</td></tr></tbody></table>',
		);
	});

	it('escape', async () => {
		const result =
			await EzalMarkdown.render(`| Column A       | Column B (with \\|) |
| -----------     | ------------------ |
| Normal text     | Pipe: \\|           |
| Another row     | More \\| examples   |`);
		expect(result.html).toEqual(
			'<table><thead><tr><th>Column A</th><th>Column B (with |)</th></tr></thead><tbody><tr><td>Normal text</td><td>Pipe: |</td></tr><tr><td>Another row</td><td>More | examples</td></tr></tbody></table>',
		);
	});

	it('align', async () => {
		const result = await EzalMarkdown.render(`
| Left Align      | Center Align    | Right Align |
|:----------------|:---------------:|------------:|
| Content A       | Content B       | Content C   |
| Longer content  | Centered item   | 123456      |`);

		expect(result.html).toEqual(
			'<table>' +
				'<thead>' +
				'<tr>' +
				'<th style="text-align:left;">Left Align</th>' +
				'<th style="text-align:center;">Center Align</th>' +
				'<th style="text-align:right;">Right Align</th>' +
				'</tr>' +
				'</thead>' +
				'<tbody>' +
				'<tr>' +
				'<td style="text-align:left;">Content A</td>' +
				'<td style="text-align:center;">Content B</td>' +
				'<td style="text-align:right;">Content C</td>' +
				'</tr>' +
				'<tr>' +
				'<td style="text-align:left;">Longer content</td>' +
				'<td style="text-align:center;">Centered item</td>' +
				'<td style="text-align:right;">123456</td>' +
				'</tr>' +
				'</tbody>' +
				'</table>',
		);
	});
});
