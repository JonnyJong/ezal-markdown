import { CommonPlugin } from '../types';
import { $ } from '../utils';

const PATTERN_HARD = /( {2,}|\\)\n/;
const PATTERN_SOFT = / {0,1}\n/;

/**
 * 硬换行
 * @see https://spec.commonmark.org/0.31.2/#hard-line-breaks
 */
export const linebreak: CommonPlugin<'inline'> = {
	name: 'linebreak',
	type: 'inline',
	priority: 0,
	order: 0,
	start: PATTERN_HARD,
	parse(source) {
		const matched = source.match(PATTERN_HARD);
		if (matched?.index !== 0) return;
		return { raw: matched[0] };
	},
	render() {
		return $('br');
	},
};

/**
 * 软换行
 * @see https://spec.commonmark.org/0.31.2/#soft-line-breaks
 */
export const softbreak: CommonPlugin<'inline'> = {
	name: 'softbreak',
	type: 'inline',
	priority: 0,
	order: 0,
	start: PATTERN_SOFT,
	parse(source) {
		const matched = source.match(PATTERN_SOFT);
		if (matched?.index !== 0) return;
		return { raw: matched[0] };
	},
	render(_, __, { lineBreak }) {
		if (lineBreak === 'soft') return $('br');
		return '\n';
	},
};
