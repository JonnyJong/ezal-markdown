import { CommonPlugin, Parsed } from '../types';
import { escapeHTML } from '../utils';

export interface EscapeParsed extends Parsed {
	char: string;
}

const PATTERN_ESCAPE =
	/(?<!\\)\\[\u0021-\u002F\u003A-\u0040\u005B-\u0060\u007B-\u007E]/;

/** @see https://spec.commonmark.org/0.31.2/#backslash-escapes */
export const charEscape: CommonPlugin<'inline', EscapeParsed> = {
	name: 'escape',
	type: 'inline',
	order: 0,
	priority: 0,
	start: PATTERN_ESCAPE,
	parse(source) {
		if (source.length < 2) return;
		if (source[0] !== '\\') return;
		return { raw: source.slice(0, 2), char: source[1] };
	},
	render({ char }) {
		return escapeHTML(char);
	},
};
