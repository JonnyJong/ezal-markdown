import { Plugin } from '../plugin';
import { $ } from '../utils';

const PATTERN = /(?<=^|\n)([*\-_])\1{2,}(?=$|\n)/;

export const hr: Plugin<'block'> = {
	name: 'hr',
	type: 'block',
	priority: 0,
	start: PATTERN,
	parse(source) {
		const raw = source.match(PATTERN)?.[0];
		if (!raw) return;
		return { raw };
	},
	render() {
		return $('hr');
	},
};
