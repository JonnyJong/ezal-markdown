import type { ParsedChild } from '../node';
import type { CommonPlugin, Parsed } from '../types';
import { $, eachLine, indentSizeOf, isEmpty } from '../utils';
import { PATTERN_FENCE_START } from './codeblock';
import { PATTERN_LIST_START } from './list';
import { PATTERN_TABLE_START } from './table';

export interface BlockquoteParsed extends Parsed {
	children: ParsedChild;
}

export const PATTERN_BLOCKQUOTE_START = /^ {0,3}>/;
const PATTERN_START = /(?<=^|\n) {0,3}>/;
const PATTERN_BASIC_CASE = /^ {0,3}>/;

/**
 * 引用块
 * @param containerInterruptPatterns
 * 用于检测可中断懒继行的容器块起始正则；
 * 例如：其他 table/list 或自定义容器块
 * @see https://spec.commonmark.org/0.31.2/#block-quotes
 * @example
 * blockquote([
 *   /^ {0,3}([-+*]|\d{1,9}[.)])( |\t|\n|$)/, // list
 *   /^ {0,3}[\S|].*\n {0,3}\|?[ \t]*:?-+:?[ \t]*(\|[ \t]*:?-+:?[ \t]*)?\|?(?=$|\n)/, // table
 * ])
 */
export function blockquote(
	containerInterruptPatterns: RegExp[] = [
		PATTERN_LIST_START,
		PATTERN_TABLE_START,
	],
): CommonPlugin<'block', BlockquoteParsed> {
	return {
		name: 'blockquote',
		type: 'block',
		order: -1,
		priority: 0,
		start: PATTERN_START,
		parse(source, { md }) {
			const raw: string[] = [];
			const content: string[] = [];
			let empty = false;
			let breakLs = false;
			EACH_LINE: for (let [line, rest] of eachLine(source)) {
				// Ls
				if (!PATTERN_BASIC_CASE.test(line)) {
					if (empty || breakLs) break;
					if (isEmpty(line)) break;
					for (const pattern of containerInterruptPatterns) {
						if (pattern.test(rest)) break EACH_LINE;
					}
					raw.push(line);
					content.push(line);
					continue;
				}
				// Bs
				raw.push(line);
				const index = line.indexOf('>');
				line = line.slice(index + 1);
				if (line[0] === ' ') line = line.slice(1);
				else if (line[0] === '\t') line = line.slice(1) + ' '.repeat(3);
				content.push(line);
				empty = isEmpty(line);
				breakLs = indentSizeOf(line) >= 4 || PATTERN_FENCE_START.test(line);
			}
			return { raw: raw.join(''), children: md(content.join('')) };
		},
		render({ children }) {
			return $('blockquote', children.html);
		},
	};
}
