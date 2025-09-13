import { ParsedChild } from '../node';
import { CommonPlugin, Parsed } from '../types';
import { $, eachLine, isEmpty } from '../utils';
import { PATTERN_BLOCKQUOTE_START } from './blockquote';
import { PATTERN_LIST_START } from './list';

type Align = 'left' | 'center' | 'right' | undefined;

export interface TableParsed extends Parsed {
	children: {
		/** 表头 */
		head: ParsedChild[];
		/** 表格内容 */
		body: ParsedChild[][];
	};
	/** 对齐 */
	align: Align[];
}

export const PATTERN_TABLE_START =
	/^ {0,3}[\S|].*\n( {0,3}\|[ \t]*| {0,3}):?-+:?[ \t]*(\|[ \t]*:?-+:?[ \t]*)*\|?(?=$|\n)/;
const PATTERN_START =
	/(?<=^|\n) {0,3}[\S|].*\n( {0,3}\|[ \t]*| {0,3}):?-+:?[ \t]*(\|[ \t]*:?-+:?[ \t]*)*\|?(?=$|\n)/;
const PATTERN_DELIMITER = /(\\)*\|/;
const PATTERN_ALIGN = /^:?-+:?$/;

/** 获取单元格 */
function getCells(line: string): string[] {
	line = line.trim();
	const cells: string[] = [];
	let cell = '';
	let firstCell = true;
	while (true) {
		const matched = line.match(PATTERN_DELIMITER);
		if (matched?.index === undefined) {
			cell += line;
			cell = cell.trim();
			if (cell) cells.push(cell);
			break;
		}
		if (matched[1] && matched[1].length % 2) {
			cell += line.slice(0, matched.index + matched[0].length);
			line = line.slice(matched.index + matched[0].length);
			continue;
		}
		cell += line.slice(0, matched.index + matched[0].length - 1);
		cell = cell.trim();
		if (cell || !firstCell) cells.push(cell);
		firstCell = false;
		cell = '';
		line = line.slice(matched.index + matched[0].length);
	}
	return cells;
}

/** 获取对齐信息 */
function getAlign(cells: string[]): Align[] | undefined {
	const align: Align[] = [];
	for (const cell of cells) {
		if (!PATTERN_ALIGN.test(cell)) return;
		const left = cell[0] === ':';
		const right = cell.at(-1) === ':';
		if (left && right) align.push('center');
		else if (left) align.push('left');
		else if (right) align.push('right');
		else align.push(undefined);
	}
	return align;
}

/**
 * 表格
 * @param containerInterruptPatterns
 * 用于检测可中断懒继行的容器块起始正则；
 * 例如：其他 blockquote/list 或自定义容器块
 * @see https://github.github.com/gfm/#tables-extension-
 * @example
 * table([
 *   /^ {0,3}>/, // blockquote
 *   /^ {0,3}([-+*]|\d{1,9}[.)])( |\t|\n|$)/, // list
 * ])
 */
export function table(
	containerInterruptPatterns: RegExp[] = [
		PATTERN_LIST_START,
		PATTERN_BLOCKQUOTE_START,
	],
): CommonPlugin<'block', TableParsed> {
	return {
		name: 'table',
		type: 'block',
		order: -1,
		priority: 0,
		start: PATTERN_START,
		parse(source, { md }) {
			const iter = eachLine(source);
			let raw = '';
			// Head
			let line = iter.next().value?.[0];
			if (!line) return;
			const head = getCells(line);
			if (!head.length) return;
			raw += line;
			// Align
			line = iter.next().value?.[0];
			if (!line) return;
			const align = getAlign(getCells(line));
			if (!align) return;
			if (align.length !== head.length) return;
			raw += line;
			// Body
			const body: string[][] = [];
			LS: for (const [line, rest] of iter) {
				if (isEmpty(line)) break;
				for (const pattern of containerInterruptPatterns) {
					if (pattern.test(rest)) break LS;
				}
				body.push(getCells(line));
				raw += line;
			}
			return {
				raw,
				align,
				children: {
					head: head.map((c) => md(c, 'inline')),
					body: body.map((l) => l.map((c) => md(c, 'inline'))),
				},
			};
		},
		render({ align, children }) {
			return $('table', [
				$(
					'thead',
					children.head.map((child, i) =>
						$('th', { style: { textAlign: align[i] }, html: child.html }),
					),
				),
				$(
					'tbody',
					children.body.map((row) =>
						$(
							'tr',
							row.map((child, i) =>
								$('td', { style: { textAlign: align[i] }, html: child.html }),
							),
						),
					),
				),
			]);
		},
	};
}
