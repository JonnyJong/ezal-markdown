import { BlockParseResult, InlineParseResult, Plugin } from '../plugin';
import { $ } from '../utils';
import { normalizeTitle } from './link';

export interface ImageParsed {
	src: string;
	alt: string;
	title?: string;
}

const PATTERN_BLOCK = /(?<=^|\n)!\[(.*[^\\])\]\((.*)\)(?=$|\n)/;
const PATTERN_INLINE = /!\[(.*[^\\])\]\((.*)\)/;

function parse(matched: RegExpMatchArray): ImageParsed {
	const alt = matched[1];
	let src = matched[2];
	let title: string | undefined = undefined;
	const index = src.indexOf(' ');
	if (index !== -1) {
		title = normalizeTitle(src.slice(index + 1));
		src = src.slice(0, index);
	}
	return { alt, src, title };
}

function render({ src, alt, title }: ImageParsed): string {
	return $('img', { attr: { src, alt, title } });
}

export const imageBlock: Plugin<'block', BlockParseResult & ImageParsed> = {
	name: 'image',
	type: 'block',
	priority: 0,
	start: PATTERN_BLOCK,
	parse(source) {
		const matched = source.match(PATTERN_BLOCK);
		if (!matched) return;
		return { raw: matched[0], ...parse(matched) };
	},
	render,
};

export const imageInline: Plugin<'inline', InlineParseResult & ImageParsed> = {
	name: 'image',
	type: 'inline',
	priority: 0,
	start: PATTERN_INLINE,
	parse(source) {
		const matched = source.match(PATTERN_INLINE);
		if (!matched) return;
		return { raw: matched[0], ...parse(matched) };
	},
	render,
};

export interface ImageRefParsed {
	ref: string;
	alt: string;
}

const PATTERN_BLOCK_REF =
	/(?<=^|\n)!\[(.*[^\\]?)\][ ]?\[([^^].*[^\\]?)\](?=$|\n)/;
const PATTERN_INLINE_REF = /!\[(.*[^\\]?)\][ ]?\[([^^].*[^\\]?)\]/;

export const imageBlockRef: Plugin<'block', BlockParseResult & ImageRefParsed> =
	{
		name: 'image-reference',
		type: 'block',
		priority: 0,
		start: PATTERN_BLOCK_REF,
		parse(source) {
			const matched = source.match(PATTERN_BLOCK_REF);
			if (!matched) return;
			return { raw: matched[0], alt: matched[1], ref: matched[2] };
		},
		render({ ref, alt }, { shared, logger }) {
			let link: { url: string; title?: string } = (shared.links as any)?.[ref];
			if (!link) {
				logger.warn(`Can not found reference link's source "${ref}"`);
				link = { url: '#' };
			}
			return $('img', { attr: { src: link.url, alt, title: link.title } });
		},
	};
export const imageInlineRef: Plugin<
	'inline',
	InlineParseResult & ImageRefParsed
> = {
	name: 'image-reference',
	type: 'inline',
	priority: 0,
	start: PATTERN_INLINE_REF,
	parse(source) {
		const matched = source.match(PATTERN_INLINE_REF);
		if (!matched) return;
		return { raw: matched[0], alt: matched[1], ref: matched[2] };
	},
	render({ ref, alt }, { shared, logger }) {
		let link: { url: string; title?: string } = (shared.links as any)?.[ref];
		if (!link) {
			logger.warn(`Can not found reference link's source "${ref}"`);
			link = { url: '#' };
		}
		return $('img', { attr: { src: link.url, alt, title: link.title } });
	},
};
