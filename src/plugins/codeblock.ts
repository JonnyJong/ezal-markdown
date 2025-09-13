import { ParsedChild } from '../node';
import { CommonPlugin, Parsed, PromiseOr } from '../types';
import {
	$,
	eachLine,
	escapeMarkdown,
	indentSizeOf,
	isEmpty,
	reduceIndent,
} from '../utils';

export interface CodeblockParsed extends Parsed {
	children?: ParsedChild;
	/** 代码内容 */
	code: string;
	/** 语言 */
	lang?: string;
}

/**
 * 代码高亮器
 * @param code 代码
 * @param lang 语言
 * @returns
 * - 单值：高亮的 HTML 字符串
 * - 多值：
 *   0. 高亮的 HTML 字符串
 *   1. HTML 标签类名
 */
export type CodeHighlighter = (
	code: string,
	lang?: string,
) => PromiseOr<string | [html: string, className?: string]>;

const PATTERN_INDENT_START = /(?<=^|^\s*\n|\n\s*\n)[ \t]+\S/;
export const PATTERN_FENCE_START =
	/(?<=^|\n)( {0,3})(`{3,}[^`\n]*|~{3,}.*)(?=$|\n)/;
const PATTERN_FENCE_HEAD = /(?<=^|\n)( {0,3})(`{3,}|~{3,}).*(?=$|\n)/;
const PATTERN_FENCE_INFO_SPLIT = /[ \t]/;

export function codeblock(highlighter?: CodeHighlighter) {
	async function render({ code, lang }: CodeblockParsed) {
		if (!highlighter) return $('pre', $('code', { content: code }));
		const result = await highlighter(code, lang);
		let html: string;
		let className: string | undefined = undefined;
		if (typeof result === 'string') {
			html = result;
		} else {
			[html, className] = result;
		}
		return $('pre', $('code', { class: className, html }));
	}

	/**
	 * 缩进代码块
	 * @see https://spec.commonmark.org/0.31.2/#indented-code-blocks
	 */
	const indentedCodeblock: CommonPlugin<'block', CodeblockParsed> = {
		name: 'indented-codeblock',
		type: 'block',
		order: -2,
		priority: 0,
		start: PATTERN_INDENT_START,
		parse(source) {
			const rawLines: string[] = [];
			const lines: string[] = [];
			for (const [line] of eachLine(source)) {
				if (indentSizeOf(line) < 4 && !isEmpty(line)) break;
				rawLines.push(line);
				lines.push(reduceIndent(line, 4));
			}
			while (true) {
				const line = lines.pop();
				if (line === undefined) return;
				if (isEmpty(line)) continue;
				lines.push(line);
				break;
			}
			if (rawLines.length === 0) return;
			return { raw: rawLines.join(''), code: lines.join('') };
		},
		render,
	};

	/**
	 * 围栏代码块
	 * @see https://spec.commonmark.org/0.31.2/#fenced-code-blocks
	 */
	const fencedCodeblock: CommonPlugin<'block', CodeblockParsed> = {
		name: 'fenced-codeblock',
		type: 'block',
		order: 0,
		priority: 0,
		start: PATTERN_FENCE_START,
		parse(source, { md }) {
			const start = source.match(PATTERN_FENCE_HEAD);
			if (!start) return;
			const removeSpaces = start[1].length;
			const fenceLength = start[2].length;
			const fenceType = start[2][0];
			const startOffset = start[0].length;
			const end = source
				.slice(startOffset)
				.match(
					new RegExp(`(?<=\n)( {0,3})${fenceType}{${fenceLength},}[ \t]*(\n|$)`),
				);
			const raw = source.slice(
				0,
				end?.index ? startOffset + end.index + end[0].length : undefined,
			);
			const info = escapeMarkdown(
				raw.slice(removeSpaces + fenceLength, startOffset).trim(),
			);
			const index = info.match(PATTERN_FENCE_INFO_SPLIT)?.index;
			let lang = info;
			let text: string | undefined = undefined;
			if (index) {
				lang = info.slice(0, index);
				text = info.slice(index).trimStart();
			}
			const code = raw
				.slice(startOffset + 1, end?.index ? startOffset + end.index : undefined)
				.replace(new RegExp(`^ {0,${removeSpaces}}`, 'gm'), '');
			return {
				raw,
				code,
				lang,
				children: text ? md(text, 'inline') : undefined,
			};
		},
		render,
	};

	return {
		/**
		 * 缩进代码块
		 * @see https://spec.commonmark.org/0.31.2/#indented-code-blocks
		 */
		indentedCodeblock,
		/**
		 * 围栏代码块
		 * @see https://spec.commonmark.org/0.31.2/#fenced-code-blocks
		 */
		fencedCodeblock,
	};
}
