import type { CommonPlugin } from '../types';
import { $ } from '../utils';

export const PATTERN_THEMATIC_BREAK =
	/(?<=^|\n) {0,3}([*\-_])[ \t]*(\1[ \t]*){2,}(?=$|\n)/;

/**
 * 主题分隔符
 * @see https://spec.commonmark.org/0.31.2/#thematic-breaks
 */
export const thematicBreak: CommonPlugin<'block'> = {
	name: 'thematic-break',
	type: 'block',
	order: 0,
	priority: 0,
	start: PATTERN_THEMATIC_BREAK,
	parse(source) {
		const index = source.indexOf('\n');
		if (index === -1) return { raw: source };
		return { raw: source.slice(0, index + 1) };
	},
	render() {
		return $('hr');
	},
};
