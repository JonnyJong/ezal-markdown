/** biome-ignore-all lint/performance/noBarrelFile: Entry File */

import { Anchors } from './anchor';
import { Counter } from './counter';
import { defaultLogger, type Logger } from './logger';
import { NODE_TYPES, type Node, type NodeType } from './node';
import { type ParseResult, parse } from './parse';
import { PluginContextMap, PluginsManager, type PluginsMap } from './plugin';
import { autolink } from './plugins/autolink';
import { text } from './plugins/base';
import { blockquote } from './plugins/blockquote';
import { code } from './plugins/code';
import { codeblock } from './plugins/codeblock';
import { emphasisAndLink } from './plugins/emphasis-links';
import {
	decimalCharReference,
	entityReference,
	hexadecimalCharReference,
} from './plugins/entity';
import { charEscape } from './plugins/escape';
import { heading } from './plugins/heading';
import { htmlBlock, rawHtml } from './plugins/html';
import { linebreak, softbreak } from './plugins/line-break';
import { linkRefDefine } from './plugins/link-ref-define';
import { list } from './plugins/list';
import { paragraph } from './plugins/paragraph';
import { table } from './plugins/table';
import { thematicBreak } from './plugins/thematic-break';
import { RefMap } from './ref-map';
import { type HTMLRenderResult, renderHTML } from './render';
import { Toc } from './toc';
import type {
	Context,
	Nested,
	ParseOptions,
	Plugin,
	ResolvedOptions,
} from './types';
import { isObject } from './utils';

async function resolveOptions(
	plugins: PluginsMap,
	options?: ParseOptions,
): Promise<ResolvedOptions> {
	// Context
	let shared = {};
	if (isObject(options?.shared)) shared = { ...options.shared };
	let anchors: Anchors;
	if (options?.anchors instanceof Anchors) {
		anchors = options.anchors;
	} else {
		anchors = new Anchors(options);
	}
	let toc: Toc;
	if (options?.toc instanceof Toc && options.toc.anchors === anchors) {
		toc = options.toc;
	} else {
		toc = new Toc(anchors, options?.toc);
	}
	let counter: Counter;
	if (options?.counter instanceof Counter) {
		counter = options.counter;
	} else {
		counter = new Counter();
	}
	let refMap: RefMap;
	if (options?.refMap instanceof RefMap) {
		refMap = options.refMap;
	} else {
		refMap = new RefMap();
	}
	const logger: Logger = options?.logger ?? defaultLogger;
	const context = { shared, anchors, toc, counter, logger, refMap } as Context;
	(context as any).plugins = new PluginContextMap(plugins, context);
	await context.plugins.init(options?.pluginsContext);
	// Options
	const result: ResolvedOptions = {
		maxLevel: 'block',
		skipParagraphWrapping: false,
		frontmatter: false,
		lineBreak: 'common-mark',
		context,
	};
	if (NODE_TYPES.includes(options!.maxLevel!)) {
		result.maxLevel = options!.maxLevel!;
	}
	if (options?.skipParagraphWrapping === true) {
		result.skipParagraphWrapping = true;
	}
	if (
		options?.frontmatter === true ||
		(options?.frontmatter && typeof options.frontmatter === 'object')
	) {
		result.frontmatter = options.frontmatter;
	}
	if (['common-mark', 'soft'].includes(options!.lineBreak!)) {
		result.lineBreak = options!.lineBreak!;
	}
	return result;
}

function isResolved(
	options?: ParseOptions | ResolvedOptions,
): options is ResolvedOptions {
	if (!options) return false;
	if (!('context' in options)) return false;
	if (!isObject(options.context)) return false;
	if (!(options.context.plugins instanceof PluginContextMap)) return false;
	if (!isObject(options.context.shared)) return false;
	if (!(options.context.toc instanceof Toc)) return false;
	if (!(options.context.counter instanceof Counter)) return false;
	if (!isObject(options.context.logger)) return false;
	if (!(options.context.refMap instanceof RefMap)) return false;
	if (
		!isObject(options.frontmatter) &&
		typeof options.frontmatter !== 'boolean'
	) {
		return false;
	}
	if (!['common-mark', 'soft'].includes(options.lineBreak)) return false;
	if (!NODE_TYPES.includes(options.maxLevel)) return false;
	if (typeof options.skipParagraphWrapping !== 'boolean') return false;
	return true;
}

const globalPlugins = new PluginsManager();
globalPlugins.set(
	charEscape,
	entityReference,
	decimalCharReference,
	hexadecimalCharReference,
	thematicBreak,
	heading(),
	codeblock(),
	htmlBlock,
	linkRefDefine,
	paragraph,
	table(),
	blockquote(),
	list(),
	code,
	emphasisAndLink(),
	autolink(),
	rawHtml,
	linebreak,
	softbreak,
	text,
);

export class EzalMarkdown {
	#plugins = new PluginsManager();
	/** 日志记录器 */
	logger?: Logger;
	/**
	 * 设置插件
	 * @throws 当存在校验失败的插件时，抛出错误，且不会设置任何插件
	 * @returns 是否存在插件覆盖
	 */
	set(...plugins: Nested<Plugin<NodeType>>[]): boolean {
		return this.#plugins.set(...plugins);
	}
	/**
	 * 移除插件
	 * @param type 插件类型
	 * @param name 插件名称
	 * @returns 插件是否被移除
	 */
	rm(name: NodeType, type: string): boolean;
	/**
	 * 移除插件
	 * @returns 是否有插件被移除
	 */
	rm(...plugins: Plugin<NodeType>[]): boolean;
	rm(
		arg0: NodeType | Plugin<NodeType>,
		arg1?: string | Plugin<NodeType>,
		...plugins: Plugin<NodeType>[]
	): boolean {
		return this.#plugins.rm(arg0 as any, arg1 as any, ...plugins);
	}
	/** 解析参数 */
	async resolve(
		options?: ParseOptions | ResolvedOptions,
	): Promise<ResolvedOptions> {
		if (isResolved(options)) return options;
		return await resolveOptions(globalPlugins.getPluginsMap(this.#plugins), {
			logger: this.logger ?? EzalMarkdown.logger,
			...options,
		});
	}
	/**
	 * 解析 Markdown 文档
	 * @param source Markdown 源文本
	 * @param options 解析参数
	 */
	async parse(
		source: string,
		options?: ParseOptions | ResolvedOptions,
	): Promise<ParseResult> {
		return parse(source, await this.resolve(options));
	}
	/**
	 * 渲染为 HTML
	 * @param source Markdown 源文本/已解析的 AST 节点
	 * @param options 解析参数
	 */
	async renderHTML(
		source: string,
		options?: ParseOptions | ResolvedOptions,
	): Promise<HTMLRenderResult & ParseResult>;
	async renderHTML(
		source: Node,
		options?: ParseOptions | ResolvedOptions,
	): Promise<HTMLRenderResult>;
	async renderHTML(
		source: string | Node,
		options?: ParseOptions | ResolvedOptions,
	): Promise<HTMLRenderResult | (HTMLRenderResult & ParseResult)> {
		const resolvedOptions = await this.resolve(options);
		let parsed: ParseResult | null = null;
		if (typeof source === 'string') {
			parsed = await parse(source, resolvedOptions);
			source = parsed.document;
		}
		const rendered = await renderHTML(source, resolvedOptions);
		return Object.assign(rendered, parsed);
	}
	/** 日志记录器 */
	static logger?: Logger;
	/**
	 * 设置插件
	 * @throws 当存在校验失败的插件时，抛出错误，且不会设置任何插件
	 * @returns 是否存在插件覆盖
	 */
	static set(...plugins: Nested<Plugin<NodeType>>[]): boolean {
		return globalPlugins.set(...plugins);
	}
	/**
	 * 移除插件
	 * @param type 插件类型
	 * @param name 插件名称
	 * @returns 插件是否被移除
	 */
	static rm(name: NodeType, type: string): boolean;
	/**
	 * 移除插件
	 * @returns 是否有插件被移除
	 */
	static rm(...plugins: Plugin<NodeType>[]): boolean;
	static rm(
		arg0: NodeType | Plugin<NodeType>,
		arg1?: string | Plugin<NodeType>,
		...plugins: Plugin<NodeType>[]
	): boolean {
		return globalPlugins.rm(arg0 as any, arg1 as any, ...plugins);
	}
	/** 解析参数 */
	static async resolve(
		options?: ParseOptions | ResolvedOptions,
	): Promise<ResolvedOptions> {
		if (isResolved(options)) return options;
		return await resolveOptions(globalPlugins.getPluginsMap(), {
			logger: EzalMarkdown.logger,
			...options,
		});
	}
	/**
	 * 解析 Markdown 文档
	 * @param source Markdown 源文本
	 * @param options 解析参数
	 */
	static async parse(
		source: string,
		options?: ParseOptions | ResolvedOptions,
	): Promise<ParseResult> {
		return parse(source, await EzalMarkdown.resolve(options));
	}
	/**
	 * 渲染为 HTML
	 * @param source Markdown 源文本/已解析的 AST 节点
	 * @param options 解析参数
	 */
	static async renderHTML(
		source: string,
		options?: ParseOptions | ResolvedOptions,
	): Promise<HTMLRenderResult & ParseResult>;
	static async renderHTML(
		source: Node,
		options?: ParseOptions | ResolvedOptions,
	): Promise<HTMLRenderResult>;
	static async renderHTML(
		source: string | Node,
		options?: ParseOptions | ResolvedOptions,
	): Promise<HTMLRenderResult | (HTMLRenderResult & ParseResult)> {
		const resolvedOptions = await EzalMarkdown.resolve(options);
		let parsed: ParseResult | null = null;
		if (typeof source === 'string') {
			parsed = await parse(source, resolvedOptions);
			source = parsed.document;
		}
		const rendered = await renderHTML(source, resolvedOptions);
		return Object.assign(rendered, parsed);
	}
}

export const plugins = {
	/**
	 * 字符转义
	 * @see https://spec.commonmark.org/0.31.2/#backslash-escapes
	 */
	charEscape,
	/**
	 * 实体引用
	 * @see https://spec.commonmark.org/0.31.2/#entity-references
	 */
	entityReference,
	/**
	 * 十进制字符引用
	 * @see https://spec.commonmark.org/0.31.2/#decimal-numeric-character-references
	 */
	decimalCharReference,
	/**
	 * 十六进制字符引用
	 * @see https://spec.commonmark.org/0.31.2/#hexadecimal-numeric-character-references
	 */
	hexadecimalCharReference,
	/**
	 * 主题分隔符
	 * @see https://spec.commonmark.org/0.31.2/#thematic-breaks
	 */
	thematicBreak,
	/**
	 * ATX 标题、Setext 标题
	 * @see https://spec.commonmark.org/0.31.2/#atx-headings
	 * @see https://spec.commonmark.org/0.31.2/#setext-headings
	 */
	heading,
	/**
	 * 缩进代码块、围栏代码块
	 * @see https://spec.commonmark.org/0.31.2/#indented-code-blocks
	 * @see https://spec.commonmark.org/0.31.2/#fenced-code-blocks
	 */
	codeblock,
	/**
	 * HTML 块
	 * @see https://spec.commonmark.org/0.31.2/#html-block
	 */
	htmlBlock,
	/**
	 * 链接引用定义
	 * @see https://spec.commonmark.org/0.31.2/#link-reference-definitions
	 */
	linkRefDefine,
	/**
	 * 段落
	 * @see https://spec.commonmark.org/0.31.2/#paragraphs
	 */
	paragraph,
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
	table,
	/**
	 * 块引用
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
	blockquote,
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
	list,
	/**
	 * 行内代码
	 * @see https://spec.commonmark.org/0.31.2/#code-spans
	 */
	code,
	/**
	 * 强调、删除线、链接、图像
	 * @see https://spec.commonmark.org/0.31.2/#emphasis-and-strong-emphasis
	 * @see https://spec.commonmark.org/0.31.2/#links
	 * @see https://spec.commonmark.org/0.31.2/#images
	 * @see https://github.github.com/gfm/#strikethrough-extension-
	 */
	emphasisAndLink,
	/**
	 * 自动链接
	 * @see https://spec.commonmark.org/0.31.2/#autolinks
	 */
	autolink,
	/**
	 * 原始 HTML
	 * @see https://spec.commonmark.org/0.31.2/#raw-html
	 */
	rawHtml,
	/**
	 * 硬换行
	 * @see https://spec.commonmark.org/0.31.2/#hard-line-breaks
	 */
	linebreak,
	/**
	 * 软换行
	 * @see https://spec.commonmark.org/0.31.2/#soft-line-breaks
	 */
	softbreak,
	/**
	 * Text 节点渲染器
	 * @see https://spec.commonmark.org/0.31.2/#blank-lines
	 */
	text,
};

export * from './anchor';
export * from './counter';
export * from './frontmatter';
export type { LogData, Logger } from './logger';
export * from './node';
export type { PluginContext, PluginLogger } from './plugin';
export type {
	AutoLinkParsed,
	LinkTarget,
	LinkTargetResolver,
} from './plugins/autolink';
export {
	type BlockquoteParsed,
	PATTERN_BLOCKQUOTE_START,
} from './plugins/blockquote';
export type { CodeParsed } from './plugins/code';
export {
	type CodeblockOptions,
	type CodeblockParsed,
	type CodeHighlighter,
	PATTERN_FENCE_START,
} from './plugins/codeblock';
export {
	DelNode,
	type EmphasisAndLinkOption,
	EmphNode,
	ImageNode,
	LinkNode,
	StrongNode,
} from './plugins/emphasis-links';
export type { CharReferenceParsed } from './plugins/entity';
export type { EscapeParsed } from './plugins/escape';
export {
	type HeadingOptions,
	type HeadingParsed,
	PATTERN_ATX_START,
} from './plugins/heading';
export type { HTMLBlockParsed } from './plugins/html';
export {
	type ListOptions,
	type ListParsed,
	PATTERN_LIST_START,
} from './plugins/list';
export { Paragraph } from './plugins/paragraph';
export { PATTERN_TABLE_START, type TableParsed } from './plugins/table';
export { PATTERN_THEMATIC_BREAK } from './plugins/thematic-break';
export * from './ref-map';
export * from './toc';
export type * from './types';
export * as utils from './utils';
