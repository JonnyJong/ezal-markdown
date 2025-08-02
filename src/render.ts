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
import { RenderHook, execHooks, omit } from './utils';

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

/** 渲染钩子 */
export interface RenderHooks {
	/** 预处理前 */
	prePreprocessing?: RenderHook<string>;
	/** 预处理后 */
	postPreprocessing?: RenderHook<string>;
	/** 读取 frontmatter 前 */
	preFrontmatter?: RenderHook<string>;
	/** 读取 frontmatter 后 */
	postFrontmatter?: RenderHook<string>;
	/** 分词前 */
	preTokenize?: RenderHook<string>;
	/** 规范会前 */
	preNormalize?: RenderHook<Node[]>;
	/** 规范会后 */
	postNormalize?: RenderHook<Node[]>;
	/** 分词后 */
	postTokenize?: RenderHook<Node[]>;
	/** 转换前 */
	preTransform?: RenderHook<Node[]>;
	/** 转换后 */
	postTransform?: RenderHook<string>;
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
	/** 钩子 */
	hooks?: RenderHooks;
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
const HOOKS_NAME: (keyof RenderHooks)[] = [
	'prePreprocessing',
	'postPreprocessing',
	'preFrontmatter',
	'postFrontmatter',
	'preTokenize',
	'preNormalize',
	'postNormalize',
	'postTokenize',
	'preTransform',
	'postTransform',
];

function resolveOptions(options?: RenderOptions): ResolvedRenderOptions {
	const result: ResolvedRenderOptions = {
		maxLevel: 'block',
		skipParagraphWrapping: false,
		enableFrontmatter: false,
		lineBreak: 'common-mark',
		slugifyStrategy: 'github',
		context: {},
		pluginsContext: {},
		hooks: {},
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
	if (options?.hooks && typeof options.hooks === 'object') {
		for (const type of HOOKS_NAME) {
			if (typeof options.hooks[type] === 'function') {
				result.hooks[type] = options.hooks[type] as any;
			}
			if (Array.isArray(options.hooks[type])) {
				result.hooks[type] = options.hooks[type].filter(
					(v) => typeof v === 'function',
				) as any;
			}
		}
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
	const resolvedOptions = resolveOptions(options);
	const context = await createRenderContext(plugins, resolvedOptions);
	const hooks = resolvedOptions.hooks;

	source = await execHooks(source, hooks.prePreprocessing);
	source = source.replace(PATTERN_WRAP, '\n');
	source = await execHooks(source, hooks.postPreprocessing);

	let frontmatter: FrontmatterExtractResult | undefined = undefined;
	if (resolvedOptions.enableFrontmatter) {
		source = await execHooks(source, hooks.preFrontmatter);
		frontmatter = await extractFrontmatter(
			source,
			resolvedOptions.enableFrontmatter === true
				? undefined
				: resolvedOptions.enableFrontmatter,
		);
		if (frontmatter) {
			source = source.slice(frontmatter.raw.length + 1);
		}
		source = await execHooks(source, hooks.postFrontmatter);
	}

	let tokens = await tokenize(source, context, resolvedOptions, hooks);

	tokens = await execHooks(tokens, hooks.preTransform);
	let html = await transform(tokens, context);
	html = await execHooks(html, hooks.postTransform);

	return { ...omit(context, ['plugins']), frontmatter, tokens, html };
}
