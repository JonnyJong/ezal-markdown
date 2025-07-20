import { InlineParseResult, ParseChild, Plugin, md } from '../plugin';
import { $ } from '../utils';

const PATTERN_BOLD = /(?<!\\)(\*\*|__)(.*?[^\\])\1/;
const PATTERN_ITALIC = /(?<!\\)(\*|_)(.*?[^\\])\1/;
const PATTERN_BOLD_ITALIC = /(?<!\\)(\*\*\*|___)(.*?[^\\])\1/;
const PATTERN_DEL = /(?<!\\)~~(.*?[^\\])~~/;

export const bold: Plugin<
	'inline',
	InlineParseResult & { children: ParseChild }
> = {
	name: 'bold',
	type: 'inline',
	priority: 0,
	start: PATTERN_BOLD,
	parse(source) {
		const matched = source.match(PATTERN_BOLD);
		if (!matched) return;
		return {
			raw: matched[0],
			children: md(matched[2]),
		};
	},
	render(source) {
		return $('b', source.children);
	},
};

export const italic: Plugin<
	'inline',
	InlineParseResult & { children: ParseChild }
> = {
	name: 'italic',
	type: 'inline',
	priority: 0,
	start: PATTERN_ITALIC,
	parse(source) {
		const matched = source.match(PATTERN_ITALIC);
		if (!matched) return;
		return {
			raw: matched[0],
			children: md(matched[2]),
		};
	},
	render(source) {
		return $('i', source.children);
	},
};

export const boldItalic: Plugin<
	'inline',
	InlineParseResult & { children: ParseChild }
> = {
	name: 'bold-italic',
	type: 'inline',
	priority: 1,
	start: PATTERN_BOLD_ITALIC,
	parse(source) {
		const matched = source.match(PATTERN_BOLD_ITALIC);
		if (!matched) return;
		return {
			raw: matched[0],
			children: md(matched[2]),
		};
	},
	render(source) {
		return $('b', $('i', source.children));
	},
};

export const del: Plugin<
	'inline',
	InlineParseResult & { children: ParseChild }
> = {
	name: 'del',
	type: 'inline',
	priority: 0,
	start: PATTERN_DEL,
	parse(source) {
		const matched = source.match(PATTERN_DEL);
		if (!matched) return;
		return {
			raw: matched[0],
			children: md(matched[1]),
		};
	},
	render(source) {
		return $('del', source.children);
	},
};
