import { CommonPlugin, Parsed } from '../types';
import { $ } from '../utils';

export interface CodeParsed extends Parsed {
	code: string;
}

const PATTERN = /(?<!`)(`+)([^`]|[^`].*?[^`])\1(?!`)/s;
const PATTERN_WRAP = /^ +(.*[^ ]|[^ ].*) +$/;

/** @see https://spec.commonmark.org/0.31.2/#code-spans */
export const code: CommonPlugin<'inline', CodeParsed> = {
	name: 'code',
	type: 'inline',
	order: 0,
	priority: 0,
	start: PATTERN,
	parse(source) {
		const matched = source.match(PATTERN);
		if (!matched) return;
		const raw = matched[0];
		let code = raw.slice(matched[1].length, -matched[1].length);
		code = code.replaceAll('\n', ' ');
		if (PATTERN_WRAP.test(code)) code = code.slice(1, -1);
		return { raw, code };
	},
	render({ code }) {
		return $('code', { content: code });
	},
};
