import { ParseChild, Plugin, PluginContext, md } from '../plugin';
import { Toc } from '../toc';
import { VOID_ELEMENTS } from '../utils';
import { HeadingRenderOptions, createHeadingRegister } from './heading';

export interface HTMLRenderOptions extends HeadingRenderOptions {
	/**
	 * 禁用 HTML 标题标签的语义化处理
	 * @description
	 * 当为 `true` 时，`<h1>` ~ `<h6>` 标签将被视为普通 HTML 元素，
	 * 而不会影响文档的标题结构或生成对应的 Markdown 标题
	 */
	disableHeadingSemantics?: boolean;
	/**
	 * 将 HTML 标签内部内容作为 Markdown 进行二次解析
	 * @description
	 * 当为 `true` 时，HTML 元素内的文本内容会经过 Markdown 解析器处理，
	 * 允许嵌套 Markdown 语法；为 `false` 时则保持原样渲染
	 *
	 * @example
	 * `<div>*italic* **bold**</div>`
	 * 设置为 true 时会渲染为斜体和粗体，false 时则原样输出星号
	 */
	parseInnerMarkdown?: boolean;
	/**
	 * 是否严格匹配标签名大小写
	 * @description
	 * - `true`：`<MyTag>` 必须对应 `</MyTag>`（严格匹配）
	 * - `false`：不区分大小写（HTML 标准行为）
	 */
	strictTagCase?: boolean;
}

export interface HTMLParsed {
	raw: string;
	children?: ParseChild;
	start: string;
	content?: string;
	end?: string;
}

const PATTERN_BLOCK_START = /(?<=^|\n)<[A-Za-z][A-Za-z\d:._-]*?( .*?)?>/s;
const PATTERN_INLINE_START = /(?<!\\)<[A-Za-z][A-Za-z\d:._-]*?( .*?)?>/s;
const PATTERN_TAG_NAME = /(?<=^<)[A-Za-z][A-Za-z\d:._-]*/;
// biome-ignore lint/suspicious/noControlCharactersInRegex: Explicitly match the character range allowed for attribute names
const PATTERN_ATTR_START = /(?<=[^\s"'<>=/\u007F\u0000-\u001F]+?=)["']/;
const PATTERN_ATTR_SINGLE_END = /\\*?'/;
const PATTERN_ATTR_DOUBLE_END = /\\*?"/;
const PATTERN_START_TAG = /<([A-Za-z][A-Za-z\d:._-]*?)( .*?)?>/s;
const PATTERN_END_TAG = /<\/([A-Za-z][A-Za-z\d:._-]*?)>/;
const PATTERN_HEADING = /[Hh][1-6]/;
// biome-ignore lint/suspicious/noControlCharactersInRegex: Explicitly match the character range allowed for attribute names
const PATTERN_ATTR = /([^\s"'<>=/\u007F\u0000-\u001F]+?)(=["'])?/;

function getTagLength(html: string): number {
	let state: 'INIT' | 'ATTR_SINGLE' | 'ATTR_DOUBLE' = 'INIT';
	let offset = 0;
	while (offset < html.length) {
		switch (state) {
			case 'INIT': {
				const tagEnd = html.indexOf('>', offset);
				if (tagEnd === -1) return 0;
				const attrStart = html.slice(offset).match(PATTERN_ATTR_START)?.index ?? -1;
				if (attrStart === -1) return tagEnd + 1;
				if (attrStart > tagEnd) return tagEnd + 1;
				offset += attrStart;
				state = html[offset] === '"' ? 'ATTR_DOUBLE' : 'ATTR_SINGLE';
				offset++;
				break;
			}
			case 'ATTR_SINGLE': {
				const matched = html.slice(offset).match(PATTERN_ATTR_SINGLE_END);
				if (!matched) return 0;
				offset += matched.index! + matched[0].length;
				if (matched[0].length % 2 === 1) state = 'INIT';
				break;
			}
			case 'ATTR_DOUBLE': {
				const matched = html.slice(offset).match(PATTERN_ATTR_DOUBLE_END);
				if (!matched) return 0;
				offset += matched.index! + matched[0].length;
				if (matched[0].length % 2 === 1) state = 'INIT';
				break;
			}
		}
	}
	return 0;
}

function matchTagName(a: string, b: string, strict?: boolean): boolean {
	if (strict) return a === b;
	return a.toLowerCase() === b.toLowerCase();
}

/** 查找闭合标签的结束位置下标 */
function findEndTag(html: string, tagName: string, strict?: boolean): number {
	let depth = 0;
	let offset = 0;
	while (offset < html.length) {
		const start = html.slice(offset).match(PATTERN_START_TAG);
		const end = html.slice(offset).match(PATTERN_END_TAG);
		if (!end) return -1;
		if (
			start &&
			start.index! < end.index! &&
			matchTagName(start[1], tagName, strict)
		) {
			depth++;
			offset += start.index! + start[0].length;
			continue;
		}
		offset += end.index! + end[0].length;
		if (end[1].length !== tagName.length) continue;
		if (matchTagName(end[1], tagName, strict)) depth--;
		if (depth < 0) return offset;
	}
	return -1;
}

function getIdPosition(html: string): [start: number, end: number] | undefined {
	let state: '' | '"' | "'" = '';
	let offset = 0;
	let name: string | undefined = undefined;
	let start = 0;
	while (offset < html.length) {
		switch (state) {
			case '': {
				const matched = html.slice(offset).match(PATTERN_ATTR);
				if (!matched) return;
				name = matched[1];
				start = offset + matched.index!;
				offset = start + matched[0].length;
				if (!matched[2]) {
					if (name === 'id') return [start, start + 2];
					continue;
				}
				state = matched[2][1] === '"' ? '"' : "'";
				break;
			}
			case '"': {
				const matched = html.slice(offset).match(PATTERN_ATTR_DOUBLE_END);
				if (!matched) return;
				offset += matched.index! + matched[0].length;
				if (matched[0].length % 2 === 0) continue;
				state = '';
				if (name !== 'id') break;
				return [start, offset];
			}
			case "'": {
				const matched = html.slice(offset).match(PATTERN_ATTR_SINGLE_END);
				if (!matched) return;
				offset += matched.index! + matched[0].length;
				if (matched[0].length % 2 === 0) continue;
				state = '';
				if (name !== 'id') break;
				return [start, offset];
			}
		}
	}
	return undefined;
}

function processHeading(
	start: string,
	end: string,
	tagName: string,
	content: string,
	toc: Toc,
	options?: HTMLRenderOptions,
): [start: string, end: string] {
	if (options?.disableHeadingSemantics) return [start, end];
	if (!PATTERN_HEADING.test(tagName)) return [start, end];
	const register = createHeadingRegister(options);
	const level = parseInt(start[1]);
	const idRange = getIdPosition(start);
	let anchor: string | undefined = undefined;
	if (idRange && (idRange?.[1] ?? 0) > 2) {
		anchor = start.slice(idRange[0] + 4, idRange[1] - 1);
	}
	anchor = register(toc, level, content, anchor);
	if (idRange) {
		start = `${start.slice(0, idRange[0])}id="${anchor}"${start.slice(idRange[1])}`;
	} else {
		start = `${start.slice(0, -1)} id="${anchor}">`;
	}
	if (options?.shiftLevels) {
		const shiftedLevel = Math.min(level + 1, 6);
		start = start.slice(0, 2) + shiftedLevel + start.slice(3);
		end = end.slice(0, 3) + shiftedLevel + start.slice(4);
	}
	return [start, end];
}

function render(
	source: Omit<HTMLParsed, 'children'> & { children?: string },
): string {
	let result = source.start;
	if (source.end) {
		result += source.content ?? source.children ?? '';
		result += source.end;
	}
	return result;
}

export function html(
	options?: HTMLRenderOptions,
): Plugin<'block' | 'inline', HTMLParsed>[] {
	function parse(
		source: string,
		{ logger, toc }: PluginContext,
	): HTMLParsed | undefined {
		const tagName = source.match(PATTERN_TAG_NAME)?.[0];
		if (!tagName) return;
		const length = getTagLength(source);
		if (length === 0) {
			logger.warn(
				`Detected malformed HTML tag: "${source.slice(0, 32)}${source.length > 32 ? '...' : ''}`,
			);
			return;
		}
		let start = source.slice(0, length);
		// Void Element
		if (VOID_ELEMENTS.includes(tagName)) {
			return { raw: start, start };
		}
		// Non-Void Element
		let content = source.slice(length);
		const endIndex = findEndTag(content, tagName, options?.strictTagCase);
		let raw: string;
		let end: string;
		if (endIndex === -1) {
			logger.warn(
				`Missing closing tag for HTML element: "${source.slice(0, 32)}${source.length > 32 ? '...' : ''}"`,
			);
			raw = source;
			end = '';
		} else {
			raw = source.slice(0, length + endIndex);
			end = content.slice(endIndex - tagName.length - 3, endIndex);
			content = content.slice(0, endIndex - tagName.length - 3);
		}
		// Heading
		[start, end] = processHeading(start, end, tagName, content, toc, options);
		return {
			raw,
			children: options?.parseInnerMarkdown
				? md(content, { skipParagraphWrapping: true })
				: undefined,
			start,
			end,
			content: options?.parseInnerMarkdown ? undefined : content,
		};
	}
	return [
		{
			name: 'html',
			type: 'block',
			priority: 0,
			start: PATTERN_BLOCK_START,
			parse,
			render,
		},
		{
			name: 'html',
			type: 'inline',
			priority: 0,
			start: PATTERN_INLINE_START,
			parse,
			render,
		},
	];
}
