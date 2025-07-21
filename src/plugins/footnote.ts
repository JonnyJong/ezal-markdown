import {
	BlockParseResult,
	InlineParseResult,
	ParseChild,
	Plugin,
	md,
} from '../plugin';
import { $, normalizeIndent } from '../utils';

interface FootnoteRefParsed extends InlineParseResult {
	id: string;
}

interface FootnoteSourceParsed extends BlockParseResult {
	children: ParseChild[];
	ids: string[];
}

const PATTERN_REF = /(?<!\\)\[\^(.*?[^\\]?)\]/;
const PATTERN_SOURCE_START = /(?<=^|\n)\[\^(.*?[^\\]?)\]: /;
const PATTERN_SOURCE =
	/(?<=^|\n)\[\^(.*?[^\\]?)\]: .*($|\n)((( {1,4}|\t)|\[.*?[^\\]?\]: ).*($|\n))*?(?=$|\n)/;
const PATTERN_TRAILING = /\n+$/;
const PATTERN_SOURCE_SPLIT = /(?<=^|\n)(?=\[\^.*?[^\\]?\]: )/g;
const PATTERN_SOURCE_ID = /^\[\^(.*?[^\\]?)\]: /;

export function footnote(
	className?: string,
	idPrefix?: string,
): [
	Plugin<'inline', FootnoteRefParsed>,
	Plugin<'block', FootnoteSourceParsed>,
] {
	return [
		{
			name: 'footnote',
			type: 'inline',
			priority: 0,
			start: PATTERN_REF,
			parse(source) {
				const matched = source.match(PATTERN_REF);
				if (!matched) return;
				return { raw: matched[0], id: matched[1] };
			},
			render({ id }, { shared, logger }) {
				const anchor = (shared.footnote as any)?.[id];
				if (!anchor) {
					logger.warn(`Could not found footnote source of id "${id}"`);
				}
				return $('a', {
					class: className,
					attr: { href: `#${anchor ?? ''}` },
					content: id,
				});
			},
		},
		{
			name: 'footnote',
			type: 'block',
			priority: 0,
			start: PATTERN_SOURCE_START,
			parse(source, { shared, anchors, logger }) {
				let raw = source.match(PATTERN_SOURCE)?.[0];
				if (!raw) return;
				raw = raw.replace(PATTERN_TRAILING, '');
				const children: ParseChild[] = [];
				const ids: string[] = [];
				for (const item of raw.split(PATTERN_SOURCE_SPLIT)) {
					const [head, id] = item.match(PATTERN_SOURCE_ID)!;
					ids.push(id);
					const text = normalizeIndent(item.slice(head.length));
					children.push(md(text, { skipParagraphWrapping: true }));
				}
				let footnote: Record<string, string> = shared.footnote as any;
				if (!footnote) {
					footnote = {};
					shared.footnote = footnote;
				}
				for (const id of ids) {
					if (footnote[id]) {
						logger.warn(`Duplicate footnote id "${id}"`);
						continue;
					}
					footnote[id] = anchors.register((idPrefix ?? '') + id);
				}
				return { raw, children, ids };
			},
			render({ children, ids }, { shared }) {
				return $(
					'dl',
					children.flatMap((html, i) => [
						$('dt', { id: (shared.footnote as any)?.[ids[i]], html: ids[i] }),
						$('dd', html),
					]),
				);
			},
		},
	];
}
