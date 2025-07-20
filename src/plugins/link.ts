import {
	BlockParseResult,
	InlineParseResult,
	ParseChild,
	Plugin,
	md,
} from '../plugin';
import { $ } from '../utils';

export interface LinkParsed extends InlineParseResult {
	children?: ParseChild;
	link: string;
	title?: string;
}

export interface LinkRefParsed extends InlineParseResult {
	children: ParseChild;
	ref: string;
}

export interface LinkSourceParsed extends BlockParseResult {
	id: string;
	url: string;
	title?: string;
}

const PATTERN_ABSOLUTE_LINK = /^[a-z][a-z0-9+.-]*:|^\/\//;
const PATTERN_LINK = /(?<!\\)\[(.*?[^\\])\]\((.+?)\)/;
const PATTERN_LINK_BRACKET = /(?<!\\)<[A-Za-z]+:[^\s<>]+>/;
const PATTERN_EMAIL_BRACKET =
	/(?<!\\)<[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?>/;
const PATTERN_LINK_REF = /(?<!\\)\[(.*[^\\]?)\][ ]?\[([^^].*[^\\]?)\]/;
const PATTERN_LINK_SOURCE = /(?<=^|\n)\[([^^].*[^\\]?)\]: (.*)(?=$|\n)/;

const BRACKET_PAIRS = [
	['"', '"'],
	["'", "'"],
	['(', ')'],
] as const;

export function normalizeTitle(title?: string): string | undefined {
	if (!title) return;
	title = title.trim();
	for (const [l, r] of BRACKET_PAIRS) {
		if (title.startsWith(l) && title.endsWith(r)) return title.slice(1, -1);
	}
	return title;
}

const DEFAULT_RESOLVER: (
	link: string,
) => 'self' | 'blank' | 'parent' | 'top' | undefined = (link) => {
	return PATTERN_ABSOLUTE_LINK.test(link) ? 'blank' : undefined;
};

export function link(
	targetResolver: (
		link: string,
	) => 'self' | 'blank' | 'parent' | 'top' | undefined = DEFAULT_RESOLVER,
): [
	Plugin<'inline', LinkParsed>,
	Plugin<'inline', LinkParsed>,
	Plugin<'inline', LinkParsed>,
	Plugin<'inline', LinkRefParsed>,
	Plugin<'block', LinkSourceParsed>,
] {
	return [
		{
			name: 'link-bracket',
			type: 'inline',
			priority: 0,
			start: PATTERN_LINK_BRACKET,
			parse(source) {
				const raw = source.match(PATTERN_LINK_BRACKET)?.[0];
				if (!raw) return;
				const link = raw.slice(1, -1);
				return { raw, link };
			},
			render(source) {
				const target = targetResolver(source.link);
				return $('a', {
					attr: {
						href: source.link,
						target: target ? `_${target}` : null,
					},
					content: source.link,
				});
			},
		},
		{
			name: 'email-bracket',
			type: 'inline',
			priority: 0,
			start: PATTERN_EMAIL_BRACKET,
			parse(source) {
				const raw = source.match(PATTERN_EMAIL_BRACKET)?.[0];
				if (!raw) return;
				const link = raw.slice(1, -1);
				return { raw, link };
			},
			render(source) {
				return $('a', {
					attr: { href: `mailto:${source.link}` },
					content: source.link,
				});
			},
		},
		{
			name: 'link',
			type: 'inline',
			priority: 0,
			start: PATTERN_LINK,
			parse(source) {
				const matched = source.match(PATTERN_LINK);
				if (!matched) return;
				let link = matched[2];
				let title: string | undefined = undefined;
				const index = link.indexOf(' ');
				if (index !== -1) {
					title = normalizeTitle(link.slice(index + 1));
					link = link.slice(0, index);
				}
				return { raw: matched[0], children: md(matched[1]), link, title };
			},
			render(source) {
				const target = targetResolver(source.link);
				return $('a', {
					attr: {
						href: source.link,
						title: source.title,
						target: target ? `_${target}` : null,
					},
					html: (source as any).children,
					content: (source as any).children ? undefined : source.link,
				});
			},
		},
		{
			name: 'link-reference',
			type: 'inline',
			priority: 0,
			start: PATTERN_LINK_REF,
			parse(source) {
				const matched = source.match(PATTERN_LINK_REF);
				if (!matched) return;
				return { raw: matched[0], children: md(matched[1]), ref: matched[2] };
			},
			render({ ref, children }, { shared }) {
				let link: { url: string; title?: string } = (shared.links as any)?.[ref];
				if (!link) {
					console.warn(`Can not found reference link's source "${ref}"`);
					link = { url: '#' };
				}
				const target = targetResolver(link.url);
				return $('a', {
					attr: {
						href: link.url,
						title: link.title,
						target: target ? `_${target}` : null,
					},
					html: children,
				});
			},
		},
		{
			name: 'link-source',
			type: 'block',
			priority: 0,
			start: PATTERN_LINK_SOURCE,
			parse(source, { shared }) {
				const matched = source.match(PATTERN_LINK_SOURCE);
				if (!matched) return;
				const id = matched[1];
				let url = matched[2].trim();
				let title: string | undefined = undefined;
				const index = url.indexOf(' ');
				if (index !== -1) {
					title = normalizeTitle(url.slice(index + 1));
					url = url.slice(0, index);
				}
				let links: Record<string, { url: string; title?: string }> =
					shared.links as any;
				if (!links) {
					links = {};
					shared.links = links;
				}
				if (links[id]) {
					console.warn(
						`Duplicate link source id "${id}", old: { url: "${links[id].url}", title: "${links[id].title}" }, new: { url: "${url}", title: "${title}" }`,
					);
				}
				links[id] = { url, title };
				return { raw: matched[0], id, url, title };
			},
			render: () => '',
		},
	];
}
