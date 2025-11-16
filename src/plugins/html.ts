import type { CommonPlugin, Parsed } from '../types';

// HTML Block
const HTML_TAG_TYPE_1 = ['pre', 'script', 'style', 'textarea'];
const HTML_TAG_TYPE_6 = [
	'address',
	'article',
	'aside',
	'base',
	'basefont',
	'blockquote',
	'body',
	'caption',
	'center',
	'col',
	'colgroup',
	'dd',
	'details',
	'dialog',
	'dir',
	'div',
	'dl',
	'dt',
	'fieldset',
	'figcaption',
	'figure',
	'footer',
	'form',
	'frame',
	'frameset',
	'h1',
	'h2',
	'h3',
	'h4',
	'h5',
	'h6',
	'head',
	'header',
	'hr',
	'html',
	'iframe',
	'legend',
	'li',
	'link',
	'main',
	'menu',
	'menuitem',
	'nav',
	'noframes',
	'ol',
	'optgroup',
	'option',
	'p',
	'param',
	'search',
	'section',
	'summary',
	'table',
	'tbody',
	'td',
	'tfoot',
	'th',
	'thead',
	'title',
	'tr',
	'track',
	'ul',
];
const PATTERN_HTML_START = /(?<=^|\n) {0,3}<[A-Za-z!?/]/;
const PATTERN_TAG_NAME_1 = /^ {0,3}<([A-Za-z]+)(?= |\t|\n|>|$)/;
const PATTERN_TAG_NAME_6 = /^ {0,3}<\/?([A-Za-z]+)(?= |\t|\n|>|\/>|$)/;
const PATTERN_TAG_START_7 =
	/^ {0,3}<[A-Za-z][A-Za-z\d-]*([ \t\n]*[A-Za-z_:][A-Za-z\d_.:-]*([ \t]*\n?[ \t]*=[ \t]*\n?[ \t]*([^ \t\n"'=<>]+|'[^']*'|"[^"]*"))?)*[ \t]*\n?[ \t]*\/?>[ \t]*(?=\n|$)/;
const PATTERN_TAG_END_7 =
	/^ {0,3}<\/[A-Za-z][A-Za-z\d-]*[ \t]*\n?[ \t]*>[ \t]*(?=\n|$)/;
const PATTERN_END_6_7 = /(?=\n[ \t]*\n)/;
const PATTERN_END_2 = /(?<=^.*-->.*)$/m;
const PATTERN_END_3 = /(?<=^.*?>.*)$/m;
const PATTERN_START_4 = /^<![A-Za-z]/;
const PATTERN_END_4 = /(?<=^.*>.*)$/m;
const PATTERN_END_5 = /(?<=^.*\]\]>.*)$/m;
const PATTERN_FIRST_LINE = /^.*(?=\n|$)/;

// Raw HTML
const PATTERN_HTML_RAW = new RegExp(
	[
		// Open Tag
		String.raw`<[A-Za-z][A-Za-z\d-]*([ \t\n]*[A-Za-z_:][A-Za-z\d_.:-]*([ \t]*\n?[ \t]*=[ \t]*\n?[ \t]*([^ \t\n"'=<>]+|'[^']*'|"[^"]*"))?)*[ \t]*\n?[ \t]*\/?>`,
		// Close Tag
		String.raw`<\/[A-Za-z][A-Za-z\d-]*[ \t]*\n?[ \t]*>`,
		// HTML Comment
		String.raw`<!-->|<!--->|<!--[\s\S]*?-->`,
		// Processing Instruction
		String.raw`<\?>|<\?[\s\S]*?\?>`,
		// Declaration
		'<![A-Za-z][^>]*>',
		// CDATA Section
		String.raw`<!\[CDATA\[[\s\S]*?\]\]>`,
	].join('|'),
);

export interface HTMLBlockParsed extends Parsed {
	/** HTML 块类型 */
	type: number;
}

/**
 * HTML 块
 * @see https://spec.commonmark.org/0.31.2/#html-block
 */
export const htmlBlock: CommonPlugin<'block', HTMLBlockParsed> = {
	name: 'html',
	type: 'block',
	order: 0,
	priority: 0,
	start: PATTERN_HTML_START,
	parse(source) {
		// Type 1
		const tag1 = source.match(PATTERN_TAG_NAME_1)?.[1].toLowerCase();
		if (tag1 && HTML_TAG_TYPE_1.includes(tag1)) {
			const end = source.match(new RegExp(`(?<=^.*</${tag1}>.*)$`, 'im'));
			return { raw: source.slice(0, end?.index), type: 1 };
		}
		// Type 6 & 7 Start
		const tag6 = source.match(PATTERN_TAG_NAME_6)?.[1].toLowerCase();
		const end = source.match(PATTERN_END_6_7);
		if (tag6) {
			// Type 6
			if (HTML_TAG_TYPE_6.includes(tag6)) {
				return { raw: source.slice(0, end?.index), type: 6 };
			}
			// Type 7
			if (HTML_TAG_TYPE_1.includes(tag6)) return;
			if (PATTERN_TAG_START_7.test(source) || PATTERN_TAG_END_7.test(source)) {
				return { raw: source.slice(0, end?.index), type: 7 };
			}
			return;
		}
		const firstLine = source.match(PATTERN_FIRST_LINE)?.[0].trimStart();
		if (!firstLine) return;
		// Type 2
		if (firstLine.startsWith('<!--')) {
			const end = source.match(PATTERN_END_2)?.index;
			return { raw: source.slice(0, end), type: 2 };
		}
		// Type 3
		if (firstLine.startsWith('<?')) {
			const end = source.match(PATTERN_END_3)?.index;
			return { raw: source.slice(0, end), type: 3 };
		}
		// Type 4
		if (firstLine.match(PATTERN_START_4)) {
			const end = source.match(PATTERN_END_4)?.index;
			return { raw: source.slice(0, end), type: 4 };
		}
		// Type 5
		if (firstLine.startsWith('<![CDATA[')) {
			const end = source.match(PATTERN_END_5)?.index;
			return { raw: source.slice(0, end), type: 5 };
		}
		return;
	},
	render({ raw }) {
		return raw;
	},
};

/**
 * 原始 HTML
 * @see https://spec.commonmark.org/0.31.2/#raw-html
 */
export const rawHtml: CommonPlugin<'inline'> = {
	name: 'html',
	type: 'inline',
	priority: 0,
	start: PATTERN_HTML_RAW,
	parse(source) {
		const raw = source.match(PATTERN_HTML_RAW)?.[0];
		return raw ? { raw } : undefined;
	},
	render({ raw }) {
		return raw;
	},
};
