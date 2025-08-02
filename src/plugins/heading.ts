import { BlockParseResult, ParseChild, Plugin, md } from '../plugin';
import { Toc } from '../toc';
import { $ } from '../utils';

export interface HeadingRenderOptions {
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
	/**
	 * 锚前缀是否应用于自定义 ID 的标题
	 */
	applyAnchorPrefixToCustomId?: boolean;
}

interface HeadingParsed extends BlockParseResult {
	level: number;
	anchor: string;
	children: ParseChild;
	text: string;
}

const PATTERN_HEADING = /(?:^|(?<=\n))(#{1,6}) (.*)/;
const PATTERN_HEADING_UNDERSCORE = /(^|(?<=\n))(.+?)\n([-]{3,}|[=]{3,})/;
const PATTERN_HEADING_UNDERSCORE_MISS = /^([-]+|[=]+)$/;
const PATTERN_CUSTOM_ID = /(?<= ){#([A-Za-z0-9|_|-]+)}/;

function getCustomAnchor(text: string) {
	const anchor = text.match(PATTERN_CUSTOM_ID)?.[1];
	if (!anchor) return { text };
	return {
		text: text.slice(0, -anchor.length - 4).trim(),
		anchor,
	};
}

export function createHeadingRegister(options?: HeadingRenderOptions) {
	return (toc: Toc, level: number, text: string, anchor?: string): string => {
		if (!options?.anchorPrefix) {
			return toc.register(text, level, anchor);
		}
		if (!anchor) {
			return toc.register(
				text,
				level,
				options.anchorPrefix + toc.anchors.slugify(text),
			);
		}
		if (options.applyAnchorPrefixToCustomId) {
			return toc.register(text, level, options.anchorPrefix + anchor);
		}
		return toc.register(text, level, anchor);
	};
}

export function heading(options?: HeadingRenderOptions) {
	const register = createHeadingRegister(options);
	function render(
		source: Omit<HeadingParsed, 'children'> & { children: string },
	): string {
		let { children, level, anchor } = source;
		if (options?.shiftLevels) level = Math.min(level + 1, 6);
		return $(`h${level}`, { id: anchor, html: children });
	}
	const heading: Plugin<'block', HeadingParsed> = {
		name: 'heading',
		type: 'block',
		priority: 0,
		start: PATTERN_HEADING,
		parse(source, { toc }) {
			const matched = source.match(PATTERN_HEADING);
			if (!matched) return;
			const level = matched[1].length;
			let content = matched[2].trim();
			if (content.match(new RegExp(`#{${level}}$`))) {
				content = content.slice(0, -level).trimEnd();
			}
			let { text, anchor } = getCustomAnchor(content);
			anchor = register(toc, level, text, anchor);
			return {
				raw: matched[0],
				level,
				anchor,
				children: md(text, { maxLevel: 'inline' }),
				text,
			};
		},
		render,
	};
	const headingUnderscore: Plugin<'block', HeadingParsed> = {
		name: 'heading-underscore',
		type: 'block',
		priority: 0,
		start: PATTERN_HEADING_UNDERSCORE,
		parse(source, { toc }) {
			const matched = source.match(PATTERN_HEADING_UNDERSCORE);
			if (!matched) return;
			if (PATTERN_HEADING_UNDERSCORE_MISS.test(matched[2])) return;
			const level = matched[3][0] === '=' ? 1 : 2;
			let { anchor, text } = getCustomAnchor(matched[2]);
			anchor = register(toc, level, text, anchor);
			return {
				raw: matched[0],
				level,
				anchor,
				children: md(text, { maxLevel: 'inline' }),
				text,
			};
		},
		render,
	};
	return [heading, headingUnderscore];
}
