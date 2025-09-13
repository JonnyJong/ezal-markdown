import { Node, ParsedChild, ParsedNode, Text } from '../node';
import { ASTPlugin, CommonPlugin, Parsed } from '../types';
import { $, eachLine, indentSizeOf, isEmpty, reduceIndent } from '../utils';
import { PATTERN_BLOCKQUOTE_START } from './blockquote';
import { PATTERN_FENCE_START } from './codeblock';
import { PATTERN_ATX_START } from './heading';
import { PATTERN_THEMATIC_BREAK } from './thematic-break';

export interface ListParsed extends Parsed {
	children: ParsedChild[];
	/** 是否有序 */
	ordered: boolean;
	/** 起始值 */
	start: number;
	/** 分隔符类型 */
	delimiter: '-' | '+' | '*' | '.' | ')';
	/** 紧凑性 */
	tight?: boolean;
	/** 任务列表项状态 */
	tasks: (boolean | null)[];
}

export interface ListOptions {
	/**
	 * 用于检测可中断懒继行的容器块起始正则
	 * @description 例如：其他 thematic-break/blockquote 或自定义容器块
	 * @example
	 * [
	 *   /(?<=^|\n) {0,3}([*\-_])[ \t]*(\1[ \t]*){2,}(?=$|\n)/, // thematic-break
	 *   /^ {0,3}>/, // blockquote
	 *   /(?<=^|\n) {0,3}#{1,6}([ \t\n]|$)/, // atx-heading
	 *   /(?<=^|\n)( {0,3})(`{3,}[^`\n]*|~{3,}.*)(?=$|\n)/, fenced-codeblock
	 * ]
	 */
	containerInterruptPatterns?: RegExp[];
	/**
	 * 禁用 GFM 任务列表项
	 * @see https://github.github.com/gfm/#task-list-items-extension-
	 */
	disableTaskItem?: boolean;
}

export const PATTERN_LIST_START = /^ {0,3}([-+*]|\d{1,9}[.)])( |\t|\n|$)/;
const PATTERN_START = /(?<=^|\n) {0,3}([-+*]|\d{1,9}[.)])( |\t|\n|$)/;
const PATTERN_TASK = /^\[[Xx ]\][ \t]/;
const PATTERN_LIST = /^[ \t]*([-+*]|\d{1,9}[.)])( |\t|$)/;
const PATTERN_BLANK_LINES = /(^|\n)[ \t\n]*(\n|$)/;

/**
 * 列表
 * @param containerInterruptPatterns
 * 用于检测可中断懒继行的容器块起始正则；
 * 例如：其他 table/list 或自定义容器块
 * @see https://spec.commonmark.org/0.31.2/#lists
 * @see https://spec.commonmark.org/0.31.2/#list-items
 * @see https://github.github.com/gfm/#task-list-items-extension-
 * @example
 * list([
 *   /(?<=^|\n) {0,3}([*\-_])[ \t]*(\1[ \t]*){2,}(?=$|\n)/, // thematic-break
 *   /^ {0,3}>/, // blockquote
 *   /(?<=^|\n) {0,3}#{1,6}([ \t\n]|$)/, // atx-heading
 *   /(?<=^|\n)( {0,3})(`{3,}[^`\n]*|~{3,}.*)(?=$|\n)/, fenced-codeblock
 * ])
 */
export function list(options?: ListOptions) {
	const containerInterruptPatterns = options?.containerInterruptPatterns ?? [
		PATTERN_THEMATIC_BREAK,
		PATTERN_BLOCKQUOTE_START,
		PATTERN_ATX_START,
		PATTERN_FENCE_START,
	];
	const list: CommonPlugin<'block', ListParsed> = {
		name: 'list',
		type: 'block',
		order: 0,
		priority: 0,
		start(source) {
			let i = 0;
			while (i < source.length) {
				const matched = source.slice(i).match(PATTERN_START);
				if (matched?.index === undefined) return;
				i += matched.index;
				// 检查段落
				if (i <= 2) return i;
				let j = source.lastIndexOf('\n', i - 2);
				if (j === -1) j = 0;
				const prev = source.slice(j, i);
				if (isEmpty(prev)) return i;
				for (const pattern of containerInterruptPatterns) {
					if (pattern.test(prev)) return i;
				}
				// 检查是否为空
				let lineEnd = source.indexOf('\n', i + matched[0].length);
				if (lineEnd === -1) lineEnd = source.length;
				if (isEmpty(source.slice(i + matched[0].length, lineEnd))) {
					i = source.indexOf('\n', i) + 1;
					if (!i) return;
					continue;
				}
				// 检查有序列表
				if (matched[1].length === 1) return i;
				if (parseInt(matched[1]) === 1) return i;
				i = source.indexOf('\n', i) + 1;
				if (!i) return;
			}
			return;
		},
		parse(source, { md }) {
			// Basic Info
			const matched = source.match(PATTERN_START);
			if (!matched) return;
			const start = parseInt(matched[1]);
			const ordered = !Number.isNaN(start);
			const delimiter = (
				ordered ? matched[1].at(-1) : matched[1]
			) as ListParsed['delimiter'];
			// Content
			const pattern = new RegExp(
				`^( {0,3}${ordered ? '\\d{1,9}' : ''}\\${delimiter})( |\\t|\\n|$)`,
			);
			const raw: string[] = [];
			const items: string[][] = [];
			const tasks: ListParsed['tasks'] = [];
			let item: string[] = [];
			let indent = Infinity;
			let positive = false;
			let prevIsEmpty = false;
			EACH_LINE: for (const [line] of eachLine(source)) {
				const matched = line.match(pattern);
				// Bs
				if (
					matched &&
					indentSizeOf(line) < indent &&
					!PATTERN_THEMATIC_BREAK.test(line)
				) {
					raw.push(line);
					item = [];
					items.push(item);
					indent = matched[1].length;
					const inside = line.slice(indent);
					positive = !isEmpty(inside);
					let insideIndent = indentSizeOf(inside);
					if (insideIndent > 4 || !positive) insideIndent = 1;
					indent += insideIndent;
					if (!positive) {
						item.push('');
						tasks.push(null);
						continue;
					}
					// Task Item
					const content = reduceIndent(inside, insideIndent, true);
					if (options?.disableTaskItem) {
						item.push(content);
						tasks.push(null);
						continue;
					}
					const taskState = content.match(PATTERN_TASK)?.[0][1];
					item.push(taskState ? content.slice(4).trimStart() : content);
					tasks.push(taskState ? taskState !== ' ' : null);
					continue;
				}
				// Ls
				if (indentSizeOf(line) >= indent) {
					positive = true;
					prevIsEmpty = false;
					item.push(reduceIndent(line, indent, true));
					raw.push(line);
					continue;
				}
				if (isEmpty(line)) {
					if (!positive) {
						indent = Infinity;
						if (item.length === 1) item[0] = '\n';
					}
					prevIsEmpty = true;
					item.push(line);
					raw.push(line);
					continue;
				}
				if (!positive) break;
				if (prevIsEmpty) break;
				if (PATTERN_LIST.test(line)) {
					if (indentSizeOf(line) < 4) break;
					item.push(line);
					raw.push(line);
					prevIsEmpty = false;
					continue;
				}
				for (const pattern of containerInterruptPatterns) {
					if (pattern.test(line)) break EACH_LINE;
				}
				if (indentSizeOf(line) > 3 && prevIsEmpty) {
					item.push(line);
				} else {
					item.push(line.trimStart());
				}
				raw.push(line);
				prevIsEmpty = false;
			}
			const lastItem = items.at(-1)!;
			for (let i = lastItem.length - 1; i > 0; i--) {
				if (!isEmpty(lastItem[i])) break;
				lastItem.pop();
				raw.pop();
			}
			// End
			return {
				raw: raw.join(''),
				children: items.map((item) => md(item.join(''))),
				ordered,
				start,
				delimiter,
				// tight,
				tasks,
			};
		},
		render({ children, ordered, start, tasks }) {
			return $(ordered ? 'ol' : 'ul', {
				attr: {
					start: ordered ? start : false,
				},
				html: children.map((item, i) => {
					let html = '';
					if (typeof tasks[i] === 'boolean') {
						html += $('input', {
							attr: { type: 'checkbox', disabled: true, checked: tasks[i] },
						});
					}
					html += item.html;
					return $('li', html);
				}),
			});
		},
	};

	const listPost: ASTPlugin<'block', Node> = {
		name: 'list-post',
		type: 'block',
		phase: 'post',
		priority: 1,
		parse(node) {
			if (!(node instanceof ParsedNode)) return;
			if (node.name !== 'list' || node.type !== 'block') return;
			if (typeof node.data.tight === 'boolean') return;
			let tight = true;
			EACH_ITEM: for (const item of node.entires()) {
				if (!item.next()) Text.normalize(item, { trimEnd: true });
				let firstNode = true;
				for (const text of item.entires()) {
					if (!(text instanceof Text)) {
						firstNode = false;
						continue;
					}
					if (firstNode && !text.next() && !text.raw) break;
					const trim = text.next()?.type !== 'inline' && text.raw.at(-1) === '\n';
					if (PATTERN_BLANK_LINES.test(trim ? text.raw.slice(0, -1) : text.raw)) {
						tight = false;
						break EACH_ITEM;
					}
					firstNode = false;
				}
				Text.normalize(item, {
					trimEnd: true,
					trimEndBeforeBlock: true,
					trimStart: true,
				});
			}
			node.data.tight = tight;
			for (const item of node.entires()) {
				item.skipParagraphWrapping = tight;
			}
		},
		verifyNode: (_): _ is Node => false,
		render: () => '',
	};

	return { list, listTightnessMarker: listPost };
}
