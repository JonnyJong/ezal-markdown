import { BlockParseResult, ParseChild, Plugin, md } from '../plugin';
import { $, normalizeIndent } from '../utils';

export interface ListParsed extends BlockParseResult {
	children: ParseChild[];
}

//#region ol

const PATTERN_OL_START = /(?:^|(?<=\n))1\. /;
const PATTERN_OL =
	/^(?:[^\S\n]*\d+\. .*(?:\n[^\S\n]*(?:\d+\. | |\t).*)*)+(?=\n\n|\n\S|$)/m;
const PATTERN_OL_SPLIT = /\n\d+\. /g;

export const orderedList: Plugin<'block', ListParsed> = {
	name: 'list-ordered',
	type: 'block',
	priority: 0,
	start: PATTERN_OL_START,
	parse(source) {
		const raw = source.match(PATTERN_OL)?.[0];
		if (!raw) return;
		const children = raw
			.slice(3)
			.split(PATTERN_OL_SPLIT)
			.map((item) => normalizeIndent(item))
			.map((item) => md(item, { skipParagraphWrapping: true }));
		return { raw, children };
	},
	render(source) {
		return $(
			'ol',
			source.children.map((v) => $('li', v)),
		);
	},
};

//#region ul

const PATTERN_UL_START = /(?:^|(?<=\n))[-*+] /;
const PATTERN_UL =
	/^(?:[^\S\n]*[-*+] .*(?:\n[^\S\n]*(?:[-*+] | |\t).*)*)+(?=\n\n|\n\S|$)/m;
const PATTERN_UL_SPLIT = /\n[-*+] /g;

export const unorderedList: Plugin<'block', ListParsed> = {
	name: 'list-unordered',
	type: 'block',
	priority: 0,
	start: PATTERN_UL_START,
	parse(source) {
		const raw = source.match(PATTERN_UL)?.[0];
		if (!raw) return;
		const children = raw
			.slice(2)
			.split(PATTERN_UL_SPLIT)
			.map((item) => normalizeIndent(item))
			.map((item) => md(item, { skipParagraphWrapping: true }));
		return { raw, children };
	},
	render(source) {
		return $(
			'ul',
			source.children.map((v) => $('li', v)),
		);
	},
};

//#region task

export interface TaskListParsed extends BlockParseResult {
	children: ParseChild[];
	status: boolean[];
}

const PATTERN_TASK_START = /(?:^|(?<=\n))[-*+] \[( |x)\]/;
const PATTERN_TASK =
	/^(?:[^\S\n]*[-*+] \[( |x)\].*(?:\n[^\S\n]*(?:[-*+] \[( |x)\]| |\t).*)*)+(?=\n\n|\n\S|$)/;
const PATTERN_TASK_STATUS = /\[( |x)\]/;

export function taskList(className?: string): Plugin<'block', TaskListParsed> {
	return {
		name: 'list-task',
		type: 'block',
		priority: 1,
		start: PATTERN_TASK_START,
		parse(source) {
			const raw = source.match(PATTERN_TASK)?.[0];
			if (!raw) return;
			const status: boolean[] = [];
			const children = raw
				.slice(2)
				.split(PATTERN_UL_SPLIT)
				.map((item) => {
					const stat = item.match(PATTERN_TASK_STATUS)!;
					status.push(stat[1] === 'x');
					return normalizeIndent(item.slice(stat[0].length));
				})
				.map((item) => md(item, { skipParagraphWrapping: true }));
			return { raw, children, status };
		},
		render({ children, status }) {
			return $('ul', {
				class: className,
				html: children.map((html, i) =>
					$('li', {
						html: [
							$('input', { attr: { type: 'checkbox', checked: status[i] } }),
							html,
						],
					}),
				),
			});
		},
	};
}
