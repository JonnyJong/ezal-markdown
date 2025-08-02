import { BlockParseResult, ParseChild, Plugin } from '../plugin';
import { NodeType } from '../token';
import { $, escapeHTML } from '../utils';

const PATTERN_BREAK_START = /(?<!\n|^)( {2}|\\)\n/;
const PATTERN_BREAK = /^( {2}|\\)\n/;
const PATTERN_ESCAPE =
	/(?<!\\)\\[\u0021-\u002F\u003A-\u0040\u005B-\u0060\u007B-\u007E]/;

export function base(): Plugin<NodeType>[] {
	return [
		{
			name: 'text',
			type: 'atomic',
			priority: -1,
			start: () => null,
			parse: () => null,
			render(source, { counter }) {
				counter.count(source.raw);
				return source.raw;
			},
		},
		{
			name: 'break-hard',
			type: 'atomic',
			priority: 0,
			start: PATTERN_BREAK_START,
			parse(source) {
				const matched = source.match(PATTERN_BREAK);
				if (matched?.index !== 0) return;
				return { raw: matched[0] };
			},
			render() {
				return $('br');
			},
		},
		{
			name: 'break-soft',
			type: 'atomic',
			priority: 0,
			start: '\n',
			parse(source) {
				if (source[0] !== '\n') return;
				return { raw: '\n' };
			},
			render() {
				return $('br');
			},
		},
		{
			name: 'paragraph',
			type: 'block',
			priority: -2,
			start: () => null,
			parse: () => null,
			render(source) {
				return $('p', source.children);
			},
		} satisfies Plugin<'block', BlockParseResult & { children: ParseChild }>,
		{
			name: 'escape',
			type: 'atomic',
			priority: -1,
			start: PATTERN_ESCAPE,
			parse(source) {
				const raw = source.match(PATTERN_ESCAPE)?.[0];
				if (raw?.length !== 2) return;
				return { raw };
			},
			render(source) {
				return escapeHTML(source.raw[1]);
			},
		},
		{
			name: 'escape',
			type: 'inline',
			priority: -1,
			start: PATTERN_ESCAPE,
			parse(source) {
				const raw = source.match(PATTERN_ESCAPE)?.[0];
				if (raw?.length !== 2) return;
				return { raw };
			},
			render(source) {
				return escapeHTML(source.raw[1]);
			},
		},
	];
}
