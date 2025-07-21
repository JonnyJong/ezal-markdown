import { Anchors, AnchorsInit } from './anchor';
import { Counter } from './counter';
import {
	FrontmatterExtractOptions,
	FrontmatterExtractResult,
	extractFrontmatter,
} from './frontmatter';
import { PluginContextMap, PluginsContextData, PluginsMap } from './plugin';
import { Toc } from './toc';
import { NODE_TYPES, Node, NodeType, TokenizeOptions, tokenize } from './token';
import { transform } from './transform';
import { omit } from './utils';

//#region Define

export interface LogInfo {
	type: NodeType;
	name: string;
	message: string;
	errObj?: unknown;
}

export interface Logger {
	debug(info: LogInfo): void;
	info(info: LogInfo): void;
	warn(info: LogInfo): void;
	error(info: LogInfo): void;
}

/** 渲染上下文 */
export interface RenderContext {
	/** 插件及上下文 */
	readonly plugins: PluginContextMap;
	/** 插件间共享上下文 */
	readonly shared: Record<string, unknown>;
	/** 锚 */
	readonly anchors: Anchors;
	/** 目录 */
	readonly toc: Toc;
	/** 字数统计 */
	readonly counter: Counter;
	readonly logger: Logger;
}

/** Markdown 格式参数 */
export interface MarkdownFormatOptions extends TokenizeOptions {
	/** 启用 Frontmatter */
	enableFrontmatter: boolean | FrontmatterExtractOptions;
}

/** 渲染上下文参数 */
export interface RenderContextOptions {
	/**
	 * Slug 生成策略
	 * @description 若已有 `context.anchors`，则忽略该选项
	 * @default `github`
	 */
	slugifyStrategy?: AnchorsInit['slugifyStrategy'];
	/** 渲染上下文 */
	context?: Partial<Omit<RenderContext, 'plugins' | 'pluginsContext'>>;
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

/** 渲染参数 */
export interface RenderOptions
	extends Partial<MarkdownFormatOptions>,
		RenderContextOptions {}

/** 已解析的渲染参数 */
export type ResolvedRenderOptions = Required<RenderOptions>;

export interface RenderResult {
	/** 渲染结果（HTML） */
	html: string;
	/** Frontmatter */
	frontmatter: FrontmatterExtractResult | undefined;
	/** 目录 */
	toc: Toc;
	/** 字数统计 */
	counter: Counter;
	/** 插件间共享上下文 */
	shared: Record<string, unknown>;
	/** 锚 */
	anchors: Anchors;
	/** AST */
	tokens: Node[];
}

//#region Prepare

const PATTERN_WRAP = /\r\n?/g;

function resolveOptions(options?: RenderOptions): ResolvedRenderOptions {
	const result: ResolvedRenderOptions = {
		maxLevel: 'block',
		skipParagraphWrapping: false,
		enableFrontmatter: false,
		lineBreak: 'common-mark',
		slugifyStrategy: 'github',
		context: {},
		pluginsContext: {},
	};
	if (NODE_TYPES.includes(options?.maxLevel!)) {
		result.maxLevel = options?.maxLevel!;
	}
	if (options?.skipParagraphWrapping === true) {
		result.skipParagraphWrapping = true;
	}
	if (
		options?.enableFrontmatter === true ||
		(options?.enableFrontmatter && typeof options?.enableFrontmatter === 'object')
	) {
		result.enableFrontmatter = options.enableFrontmatter;
	}
	if (['common-mark', 'soft'].includes(options?.lineBreak!)) {
		result.lineBreak = options?.lineBreak!;
	}
	if (
		['github', 'aggressive'].includes(options?.slugifyStrategy as any) ||
		typeof options?.slugifyStrategy === 'function'
	) {
		result.slugifyStrategy = options?.slugifyStrategy as any;
	}
	if (options?.context && typeof options.context === 'object') {
		result.context = options.context;
	}
	if (options?.pluginsContext && typeof options.pluginsContext === 'object') {
		result.pluginsContext = options.pluginsContext;
	}
	return result;
}

async function createRenderContext(
	plugins: PluginsMap,
	options: ResolvedRenderOptions,
): Promise<RenderContext> {
	let shared = {};
	if (options.context.shared && typeof options.context.shared === 'object') {
		shared = { ...options.context.shared };
	}
	let anchors: Anchors;
	if (options.context.anchors instanceof Anchors) {
		anchors = options.context.anchors;
	} else {
		anchors = new Anchors({ slugifyStrategy: options.slugifyStrategy });
	}
	let toc: Toc;
	if (
		options.context.toc instanceof Anchors &&
		options.context.toc.anchors === anchors
	) {
		toc = options.context.toc;
	} else {
		toc = new Toc(anchors, options.context.toc);
	}
	let counter: Counter;
	if (options.context.counter instanceof Counter) {
		counter = options.context.counter;
	} else {
		counter = new Counter();
	}
	const logger: Logger = options.context.logger ?? console;
	const context = {
		shared,
		anchors,
		toc,
		counter,
		logger,
	} as unknown as RenderContext;
	(context as any).plugins = new PluginContextMap(plugins, context);
	await context.plugins.init(options.pluginsContext);
	return context;
}

//#region Main

export async function render(
	source: string,
	plugins: PluginsMap,
	options?: RenderOptions,
): Promise<RenderResult> {
	source = source.replace(PATTERN_WRAP, '\n');
	const resolvedOptions = resolveOptions(options);
	const context = await createRenderContext(plugins, resolvedOptions);

	let frontmatter: FrontmatterExtractResult | undefined = undefined;
	if (resolvedOptions.enableFrontmatter) {
		frontmatter = extractFrontmatter(
			source,
			resolvedOptions.enableFrontmatter === true
				? undefined
				: resolvedOptions.enableFrontmatter,
		);
		if (frontmatter) {
			source = source.slice(frontmatter.raw.length + 1);
		}
	}

	const tokens = await tokenize(source, context, resolvedOptions);

	const html = await transform(tokens, context);

	return { ...omit(context, ['plugins']), frontmatter, tokens, html };
}
