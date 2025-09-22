import { CommonPlugin, Parsed } from '../types';
import { $ } from '../utils';

export interface AutoLinkParsed extends Parsed {
	/** 链接目的地 */
	destination: string;
	/** 链接文本 */
	text: string;
}

export type LinkTarget = 'self' | 'blank' | 'parent' | 'top' | undefined;
/** 链接目标解析器 */
export type LinkTargetResolver = (link: string) => LinkTarget;

// biome-ignore lint/suspicious/noControlCharactersInRegex: Need to match control characters in regex
const PATTERN_LINK = /<[A-Za-z][A-Za-z\d+.-]*:[^\u0000-\u001F\u007F <>]*>/;
const PATTERN_EMAIL =
	/<[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*>/;
const PATTERN_ABSOLUTE_LINK = /^[a-z][a-z0-9+.-]*:|^\/\//;

export const DEFAULT_RESOLVER: LinkTargetResolver = (link) =>
	PATTERN_ABSOLUTE_LINK.test(link) ? 'blank' : undefined;

/**
 * 自动链接
 * @see https://spec.commonmark.org/0.31.2/#autolinks
 */
export function autolink(
	targetResolver: LinkTargetResolver = DEFAULT_RESOLVER,
): CommonPlugin<'inline', AutoLinkParsed> {
	return {
		name: 'autolink',
		type: 'inline',
		order: 0,
		priority: 0,
		start: '<',
		parse(source) {
			let raw = source.match(PATTERN_LINK)?.[0];
			if (raw) {
				const text = raw.slice(1, -1);
				return { raw, destination: encodeURI(decodeURI(text)), text };
			}
			raw = source.match(PATTERN_EMAIL)?.[0];
			if (!raw) return;
			const text = raw.slice(1, -1);
			return { raw, destination: `mailto:${encodeURI(decodeURI(text))}`, text };
		},
		render({ destination, text }) {
			const target = targetResolver(destination);
			return $('a', {
				attr: { href: destination, target: target ? `_${target}` : null },
				content: text,
			});
		},
	};
}
