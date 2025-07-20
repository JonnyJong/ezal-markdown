import {
	BlockParseResult,
	InlineParseResult,
	ParseChild,
	Plugin,
	md,
} from '../plugin';
import { $, normalizeIndent } from '../utils';

export interface CodeParsed extends InlineParseResult {
	code: string;
}

const PATTERN_CODE = /(?<!\\)(`{1,2})(.+?)\1/;

export const code: Plugin<'inline', CodeParsed> = {
	name: 'code',
	type: 'inline',
	priority: 0,
	start: PATTERN_CODE,
	parse(source) {
		const matched = source.match(PATTERN_CODE);
		if (!matched) return;
		return { raw: matched[0], code: matched[2] };
	},
	render(source, { counter }) {
		counter.count(source.raw);
		return $('code', { content: source.code });
	},
};

export interface CodeblockParsed extends BlockParseResult {
	children?: ParseChild;
	code: string;
	lang?: string;
}

const PATTERN_CODEBLOCK = /(^|(?<=\n))( {4}|\t)(.*)(\n(\2)(.*))*/;
const PATTERN_CODEBLOCK_FENCED = /(?<=^|\n)(```|~~~)(.*?)\n(.*?)\n\1/s;

type CodeHighlighter = (
	code: string,
	lang?: string,
) =>
	| { html: string; className?: string }
	| Promise<{ html: string; className?: string }>;

const DEFAULT_HIGHLIGHTER: CodeHighlighter = (code) => {
	return { html: code };
};

export function codeblock(
	highlighter: CodeHighlighter = DEFAULT_HIGHLIGHTER,
): Plugin<'block', CodeblockParsed>[] {
	return [
		{
			name: 'codeblock',
			type: 'block',
			priority: 0,
			start: PATTERN_CODEBLOCK,
			parse(source) {
				const raw = source.match(PATTERN_CODEBLOCK)?.[0];
				if (!raw) return;
				const code = normalizeIndent(raw.trimStart());
				return { raw, code };
			},
			async render(source, { counter }) {
				counter.count(source.code);
				const { html, className } = await highlighter(source.code, source.lang);
				return $('pre', { class: className, html: $('code', html) });
			},
		},
		{
			name: 'codeblock-fenced',
			type: 'block',
			priority: 0,
			start: PATTERN_CODEBLOCK_FENCED,
			parse(source) {
				const matched = source.match(PATTERN_CODEBLOCK_FENCED);
				if (!matched) return;
				let lang: string | undefined = matched[2];
				let info: string | undefined = undefined;
				const index = lang.indexOf(' ');
				if (index !== -1) {
					info = lang.slice(index + 1);
					lang = lang.slice(0, index);
				}
				if (!lang) lang = undefined;
				return {
					raw: matched[0],
					code: matched[3],
					lang,
					children: info ? md(info, { maxLevel: 'inline' }) : undefined,
				};
			},
			async render(source, { counter }) {
				counter.count(source.code);
				const { html, className } = await highlighter(source.code, source.lang);
				return $('pre', { class: className, html: $('code', html) });
			},
		},
	];
}
