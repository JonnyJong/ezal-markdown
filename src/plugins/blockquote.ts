import { BlockParseResult, ParseChild, Plugin, md } from '../plugin';
import { $, normalizeIndent } from '../utils';

const PATTERN_START = /(?<=^|\n)>/;
const PATTERN_END = /\n[^>]/;

export const blockquote: Plugin<
	'block',
	BlockParseResult & { children: ParseChild }
> = {
	name: 'blockquote',
	type: 'block',
	priority: 0,
	start: PATTERN_START,
	parse(source) {
		const end = source.match(PATTERN_END)?.index;
		const raw = source.slice(0, end);
		let text = raw
			.split('\n')
			.map((line) => line.slice(1))
			.join('\n');
		text = normalizeIndent(text, 3);
		return { raw, children: md(text, { skipParagraphWrapping: true }) };
	},
	render(source) {
		return $('blockquote', source.children);
	},
};
