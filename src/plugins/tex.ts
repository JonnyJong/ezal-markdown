import { BlockParseResult, InlineParseResult, Plugin } from '../plugin';
import { $ } from '../utils';

type TexPlugins = [
	Plugin<'block', BlockParseResult & TexParsed>,
	Plugin<'inline', InlineParseResult & TexParsed>,
	Plugin<'block', BlockParseResult & TexParsed>,
	Plugin<'inline', InlineParseResult & TexParsed>,
];

export interface TexParsed {
	raw: string;
	tex: string;
}

export interface TexOptions {
	/**
	 * TeX 渲染器
	 * @description
	 * 若未指定，将原样输出
	 */
	renderer?(tex: string, display: boolean): string | Promise<string>;
	/**
	 * 禁用 `$...$` 和 `$$...$$` 语法
	 * @default false
	 */
	disableDollarWrapping?: boolean;
	/**
	 * 启用 `\[...\]` 和 `\(...\)` 语法
	 * @default false
	 */
	enableBracketWrapping?: boolean;
}

const PATTERN_BLOCK_DOLLAR = /(?<=^|\n)\$\$.*?\$\$(?=$|\n)/s;
const PATTERN_INLINE_DOLLAR = /\$.*?\$/;
const PATTERN_BLOCK_BRACKET = /(?<=^|\n)\\\[.*?\\\](?=$|\n)/s;
const PATTERN_INLINE_BRACKET = /\\\(.*?\\\)/;

export function tex(options?: TexOptions | TexOptions['renderer']): TexPlugins {
	let renderer: TexOptions['renderer'] = undefined;
	let disableDollarWrapping = false;
	let enableBracketWrapping = false;
	if (typeof options === 'function') {
		renderer = options;
	} else {
		renderer = options?.renderer;
		disableDollarWrapping = !!options?.disableDollarWrapping;
		enableBracketWrapping = !!options?.enableBracketWrapping;
	}

	const renderBlock = ({ raw, tex }: TexParsed) => {
		if (!renderer) return $('p', { content: raw });
		return renderer(tex, true);
	};
	const renderInline = ({ raw, tex }: TexParsed) => {
		if (!renderer) return $('span', { content: raw });
		return renderer(tex, false);
	};

	return [
		{
			name: 'tex-dollar',
			type: 'block',
			priority: 0,
			start: PATTERN_BLOCK_DOLLAR,
			parse(source: string) {
				if (disableDollarWrapping) return;
				const raw = source.match(PATTERN_BLOCK_DOLLAR)?.[0];
				if (!raw) return;
				return { raw, tex: raw.slice(2, -2) };
			},
			render: renderBlock,
		},
		{
			name: 'tex-dollar',
			type: 'inline',
			priority: 0,
			start: PATTERN_INLINE_DOLLAR,
			parse(source: string) {
				if (disableDollarWrapping) return;
				const raw = source.match(PATTERN_INLINE_DOLLAR)?.[0];
				if (!raw) return;
				return { raw, tex: raw.slice(1, -1) };
			},
			render: renderInline,
		},
		{
			name: 'tex-bracket',
			type: 'block',
			priority: 0,
			start: PATTERN_BLOCK_BRACKET,
			parse(source: string) {
				if (!enableBracketWrapping) return;
				const raw = source.match(PATTERN_BLOCK_BRACKET)?.[0];
				if (!raw) return;
				return { raw, tex: raw.slice(2, -2) };
			},
			render: renderBlock,
		},
		{
			name: 'tex-bracket',
			type: 'inline',
			priority: 0,
			start: PATTERN_INLINE_BRACKET,
			parse(source: string) {
				if (!enableBracketWrapping) return;
				const raw = source.match(PATTERN_INLINE_BRACKET)?.[0];
				if (!raw) return;
				return { raw, tex: raw.slice(2, -2) };
			},
			render: renderInline,
		},
	];
}
