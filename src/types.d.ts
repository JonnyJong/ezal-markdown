import { Anchors, AnchorsInit } from './anchor';
import { Counter } from './counter';
import { FrontmatterExtractOptions } from './frontmatter';
import { Logger } from './logger';
import { Node, NodeType, ParsedChild } from './node';
import { PluginContext, PluginContextMap, PluginsContextData } from './plugin';
import { RefMap } from './ref-map';
import { Toc } from './toc';

//#region Utils

export type PromiseOr<T> = T | Promise<T>;
export type ArrayOr<T> = T | T[];
export type SafeAny =
	| { [k: string | number | symbol]: SafeAny }
	| string
	| number
	| bigint
	| boolean
	| symbol
	| null
	| undefined;

export type Nested<T> = T | Nested<T>[] | { [key: string]: Nested<T> };
export type MappedNested<T, A, B> = T extends A
	? B
	: T extends Nested<A>[]
		? MappedNested<T[number], A, B>[]
		: T extends Record<string, Nested<A>>
			? { [K in keyof T]: MappedNested<T[K], A, B> }
			: T;

//#region Plugin

/** 解析结果 */
export interface Parsed {
	/** 原始文本片段 */
	raw: string;
	/** 子内容 */
	children?: Nested<ParsedChild>;
}

/** 解析结果转换为渲染源 */
// export type ParsedToRenderSource<T extends Parsed> = Omit<T, 'children'> & {
// 	children: T['children'] extends infer C
// 		? C extends Nested<ParsedChild>
// 			? MappedNested<C, ParsedChild, string>
// 			: C
// 		: never;
// };

/**
 * 插件基本
 * @template T 插件类型
 * @template C 插件内上下文类型
 */
export interface PluginBase<T extends NodeType, C = never> {
	/**
	 * 插件名
	 * @description
	 * 注册插件时，新注册的插件会覆盖相同名称的插件；
	 * 建议只使用小写字母、数字、连字符 `-` 作为插件名称
	 */
	name: string;
	/**
	 * 插件类型
	 * @description
	 * - `block`：块级插件
	 * - `inline`：行级插件
	 */
	type: T;
	/** 初始化插件内上下文 */
	context?: C extends never ? undefined : () => PromiseOr<C>;
}

/**
 * 渲染插件
 * @template T 插件类型
 * @template P 解析结果
 * @template C 插件内上下文类型
 */
export interface RendererPlugin<
	T extends NodeType,
	P extends Parsed = Parsed,
	C = never,
> extends PluginBase<T, C> {
	/**
	 * 渲染
	 * @param source 渲染源
	 * @param context 上下文
	 * @param options 解析选项
	 */
	render(
		source: P,
		context: PluginContext<T, C>,
		options: Partial<TokenizeOptions>,
	): PromiseOr<string>;
}

/**
 * 一般插件
 * @template T 插件类型
 * @template P 解析结果
 * @template C 插件内上下文类型
 */
export interface CommonPlugin<
	T extends NodeType,
	P extends Parsed = Parsed,
	C = never,
> extends RendererPlugin<T, P, C> {
	/**
	 * 解析顺序
	 * @description
	 * 数值越大，越早解析
	 * @default 0
	 */
	order?: number;
	/**
	 * 优先级
	 * @description
	 * 匹配起始位置相同时，按优先级从大到小尝试解析
	 * @default 0
	 */
	priority?: number;
	/**
	 * 匹配起始位置
	 * @description
	 * - `StartMatcher`：使用函数匹配，返回 `-1 | null | undefined` 表示未匹配
	 * - `string`：匹配字符串所在位置
	 * - `RegExp`：匹配正则表达式所在位置
	 */
	start:
		| string
		| RegExp
		| ((
				source: string,
				context: PluginContext<T, C>,
				options: Partial<TokenizeOptions>,
		  ) => PromiseOr<number | RegExpMatchArray | null | undefined>);
	/**
	 * 解析
	 * @param source 从匹配起始位置开始的源文本
	 * @param context 上下文
	 * @param options 解析选项
	 */
	parse(
		source: string,
		context: PluginContext<T, C>,
		options: Partial<TokenizeOptions>,
	): PromiseOr<P | null | undefined>;
}

/**
 * AST 插件
 * @template T 插件类型
 * @template N 节点类型
 * @template C 插件内上下文类型
 */
export interface ASTPlugin<T extends NodeType, N extends Node, C = never>
	extends PluginBase<T, C> {
	/**
	 * 解析时机
	 * @description
	 * - `pre`：在 `CommonPlugin` 前解析
	 * - `post`：在 `CommonPlugin` 后解析
	 */
	phase: 'pre' | 'post';
	/**
	 * 优先级
	 * @description
	 * 优先级越高越先解析
	 * @default 0
	 */
	priority?: number;
	/**
	 * 解析
	 * @param node 待解析的根节点
	 * @param context 上下文
	 */
	parse(node: Node, context: PluginContext<T, C>): PromiseOr<any>;
	/**
	 * 检查节点是否由该插件渲染
	 * @param node 待检查的节点
	 * @param context 上下文
	 */
	verifyNode(node: Node, context: PluginContext<T, C>): node is N;
	/**
	 * 渲染
	 * @param node 节点
	 * @param context 上下文
	 */
	render(node: N, context: PluginContext<T, C>): PromiseOr<string>;
}

/**
 * 插件
 * @template T 插件类型
 * @template P 解析结果
 * @template C 插件内上下文类型
 */
export type Plugin<
	T extends NodeType = NodeType,
	P extends Parsed = Parsed,
	N extends Node = Node,
	C = never,
> = CommonPlugin<T, P, C> | RendererPlugin<T, P, C> | ASTPlugin<T, N, C>;

//#region Context

/** 上下文 */
export interface Context {
	/** 插件及上下文 */
	readonly plugins: PluginContextMap;
	/** 插件间共享上下文 */
	readonly shared: Record<string, SafeAny>;
	/** 锚 */
	readonly anchors: Anchors;
	/** 目录 */
	readonly toc: Toc;
	/** 字数统计 */
	readonly counter: Counter;
	/** 日志记录器 */
	readonly logger: Logger;
	/** 链接引用图 */
	readonly refMap: RefMap;
}

//#region Options

/** 上下文参数 */
export interface ContextOptions extends Partial<Omit<Context, 'plugins'>> {
	/**
	 * Slug 生成策略
	 * @description 若已有 `context.anchors`，则忽略该选项
	 * @default `github`
	 */
	slugifyStrategy?: AnchorsInit['slugifyStrategy'];
	/**
	 * 插件内上下文
	 * @description
	 * 允许预先设置特定插件的上下文值，跳过插件自身的上下文初始化逻辑。
	 *
	 * 注意事项:
	 * 1. 手动预设插件上下文时需确保数据结构与插件预期完全一致
	 * 2. 一旦设置，对应插件的 `context` 初始化方法将不会执行
	 * 3. 不正确的预设可能导致插件功能异常
	 */
	pluginsContext?: PluginsContextData;
}

/** 分词参数 */
export interface TokenizeOptions {
	/**
	 * 最大级别
	 * @default `block`
	 */
	maxLevel: NodeType;
	/** 跳过段落包裹 */
	skipParagraphWrapping: boolean;
	/**
	 * 换行规则
	 * @description
	 * - `common-mark`：CommonMark 规范，行尾 2+ 空格渲染为换行
	 * - `soft`：软换行，换行符 `\n` 渲染为换行
	 * @default `common-mark`
	 */
	lineBreak: 'common-mark' | 'soft';
}

/** 解析参数 */
export interface ParseOptions extends Partial<TokenizeOptions>, ContextOptions {
	/**
	 * Frontmatter 解析选项
	 * @description
	 * - false（默认）：不解析
	 * - true：使用默认参数解析
	 * - object：使用自定义参数解析
	 */
	frontmatter?: boolean | FrontmatterExtractOptions;
}

/** 已解析的参数参数 */
export type ResolvedOptions = Omit<
	Required<ParseOptions>,
	keyof ContextOptions
> & {
	/** 上下文 */
	context: Context;
};
