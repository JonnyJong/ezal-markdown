import type { ParsedChild } from '../node';
import type { Toc } from '../toc';
import type { CommonPlugin, Parsed } from '../types';
import { $ } from '../utils';
import { PATTERN_BLOCKQUOTE_START } from './blockquote';
import { PATTERN_LINK_REF_DEFINE_START } from './link-ref-define';
import { PATTERN_LIST_START } from './list';

export interface HeadingParsed extends Parsed {
	children: ParsedChild;
	/** 标题等级 */
	level: number;
	/** 标题锚 */
	anchor: string;
	/** 标题文本 */
	text: string;
}

export interface HeadingOptions {
	/**
	 * @description
	 * 启用后，`<h1>`~`<h6>` 将渲染为更低一级的标题，具体如下：
	 * - h1 -> h2
	 * - h2 -> h3
	 * - h3 -> h4
	 * - h4 -> h5
	 * - h5 -> h6
	 * - h6 -> h6
	 */
	shiftLevels?: boolean;
	/** 标题锚前缀 */
	anchorPrefix?: string;
	/** 启用自定义锚 */
	enableCustomId?: boolean;
	/** 锚前缀是否应用于自定义 ID 的标题 */
	applyAnchorPrefixToCustomId?: boolean;
	/**
	 * 用于检测可中断懒继行的容器块起始正则，
	 * 避免 Setext 标题匹配过多
	 * @description
	 * 例如：其他 blockquote/list/table 或自定义容器块
	 */
	containerInterruptPatterns?: RegExp[];
}

export const PATTERN_ATX_START = /(?<=^|\n) {0,3}#{1,6}([ \t\n]|$)/;
const PATTERN_ATX_PREFIX = /^( {0,3})(#*)(?=$| |\t)/;
const PATTERN_ATX_END = /([ \t]#*[ \t]*)?(\n|$)/;
const PATTERN_SETEXT =
	/(?<=^|\n)( {0,3}\S.*\n((\t{0,0}| {0,3})\S.*\n)*?) {0,3}(=+|-+)[ \t]*(\n|$)/;
const PATTERN_CUSTOM_ID = /(?<= ){#([A-Za-z0-9|_|-]+)}/;

export function createHeadingRegister(options?: HeadingOptions) {
	return (
		toc: Toc,
		level: number,
		content: string,
	): { text: string; anchor: string } => {
		let { text, anchor } = options?.enableCustomId
			? getCustomAnchor(content)
			: { text: content };
		if (options?.anchorPrefix) {
			if (anchor && options.applyAnchorPrefixToCustomId) {
				anchor = options.anchorPrefix + anchor;
			} else if (!anchor) {
				anchor = options.anchorPrefix + toc.anchors.slugify(text);
			}
		}
		anchor = toc.register(text, level, anchor);
		return { text, anchor };
	};
}

function getCustomAnchor(text: string) {
	const anchor = text.match(PATTERN_CUSTOM_ID)?.[1];
	if (!anchor) return { text };
	return {
		text: text.slice(0, -anchor.length - 4).trim(),
		anchor,
	};
}

export function heading(options?: HeadingOptions) {
	const containerInterruptPatterns = options?.containerInterruptPatterns ?? [
		PATTERN_BLOCKQUOTE_START,
		PATTERN_LIST_START,
		PATTERN_LINK_REF_DEFINE_START,
	];
	const register = createHeadingRegister(options);

	function render(source: HeadingParsed) {
		let { children, level, anchor } = source;
		if (options?.shiftLevels) level = Math.min(level + 1, 6);
		return $(`h${level}`, { id: anchor, html: children.html });
	}

	/**
	 * ATX 标题
	 * @see https://spec.commonmark.org/0.31.2/#atx-headings
	 */
	const atx: CommonPlugin<'block', HeadingParsed> = {
		name: 'atx-heading',
		type: 'block',
		order: 0,
		priority: 0,
		start: PATTERN_ATX_START,
		parse(source, { toc, md }) {
			const prefix = source.match(PATTERN_ATX_PREFIX);
			if (prefix?.index === undefined) return;
			const level = prefix[2].length;
			const end = source.match(PATTERN_ATX_END);
			if (!end?.index) return;
			const raw = source.slice(0, end.index + end[0].length);
			const content = raw.slice(prefix.index + prefix[0].length, end.index).trim();
			const { text, anchor } = register(toc, level, content);
			return {
				raw,
				level,
				anchor,
				children: md(text, 'inline'),
				text,
			};
		},
		render,
	};

	/**
	 * Setext 标题
	 * @see https://spec.commonmark.org/0.31.2/#setext-headings
	 */
	const setext: CommonPlugin<'block', HeadingParsed> = {
		name: 'setext-heading',
		type: 'block',
		order: 0,
		priority: 0,
		start: PATTERN_SETEXT,
		parse(source, { toc, md }) {
			const matched = source.match(PATTERN_SETEXT);
			if (!matched) return;
			const level = matched[4][0] === '=' ? 1 : 2;
			const raw = matched[0];
			for (const pattern of containerInterruptPatterns) {
				if (pattern.test(raw)) return;
			}
			const content = matched[1].trim();
			const { text, anchor } = register(toc, level, content);
			return {
				raw,
				level,
				anchor,
				children: md(text, 'inline'),
				text,
			};
		},
		render,
	};

	return {
		/**
		 * ATX 标题
		 * @see https://spec.commonmark.org/0.31.2/#atx-headings
		 */
		atx,
		/**
		 * Setext 标题
		 * @see https://spec.commonmark.org/0.31.2/#setext-headings
		 */
		setext,
	};
}
