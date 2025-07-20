import { BlockParseResult, ParseChild, Plugin, md } from '../plugin';
import { $ } from '../utils';

export interface TableParsed extends BlockParseResult {
	children: ParseChild[][];
	align: ('left' | 'center' | 'right' | undefined)[];
}

const PATTERN_START = /(?<=^|\n)\|.*?[^\\]?\|\n\|( *?:?-+?:? *?\|)+(?=$|\n)/;
const PATTERN =
	/(?<=^|\n)\|.*?[^\\]?\|\n\|( *?:?-+?:? *?\|)+\n(\|.*?[^\\]\|?(\n|$))*?(?=$|\n)/;
const PATTERN_SPLIT = /(?<!\\)\|/;

function split(line: string) {
	return line
		.slice(1, -1)
		.split(PATTERN_SPLIT)
		.map((v) => v.trim());
}

function getAlign(cell: string): 'left' | 'center' | 'right' | undefined {
	const left = cell.startsWith(':');
	const right = cell.endsWith(':');
	if (left && right) return 'center';
	if (left) return 'left';
	if (right) return 'right';
	return undefined;
}

function toMd(cell: string) {
	return md(cell, { maxLevel: 'inline' });
}

export const table: Plugin<'block', TableParsed> = {
	name: 'table',
	type: 'block',
	priority: 0,
	start: PATTERN_START,
	parse(source) {
		const raw = source.match(PATTERN)?.[0].trim();
		if (!raw) return;
		const lines = raw.trim().split('\n');
		const head = split(lines[0]).map(toMd);
		const align = split(lines[1]).map(getAlign);
		const body = lines
			.slice(2)
			.map(split)
			.map((line) => line.map(toMd));
		return { raw, children: [head, ...body], align };
	},
	render({ children, align }) {
		return $('table', [
			$(
				'thead',
				$(
					'tr',
					children[0].map((th, i) =>
						$('th', { style: { textAlign: align[i] }, html: th }),
					),
				),
			),
			$(
				'tbody',
				children.slice(1).map((tr) =>
					$(
						'tr',
						tr.map((td, i) => $('td', { style: { textAlign: align[i] }, html: td })),
					),
				),
			),
		]);
	},
};
