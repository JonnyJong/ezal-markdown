import {
	extractFrontmatter,
	type FrontmatterExtractResult,
} from './frontmatter';
import {
	Document,
	NODE_TYPES,
	type Node,
	type NodeType,
	ParsedNode,
	Text,
} from './node';
import {
	type CommonPluginContext,
	comparePriority,
	type PluginContextMap,
} from './plugin';
import type { Context, ResolvedOptions, TokenizeOptions } from './types';
import { isObject, OrderedPositionMap, stackSafeRecursion } from './utils';

export interface ParseResult {
	options: ResolvedOptions;
	frontmatter?: FrontmatterExtractResult;
	document: Document;
	context: Context;
}

function getLevel(node: Node | NodeType) {
	return (
		NODE_TYPES.length -
		NODE_TYPES.indexOf(
			typeof node === 'string' ? node : (node.maxLevel ?? node.type),
		)
	);
}

//#region Tokenize

async function findStart(
	context: CommonPluginContext<any>,
	source: string,
	options: Partial<TokenizeOptions>,
): Promise<number> {
	if (typeof context.plugin.start === 'string') {
		return source.indexOf(context.plugin.start);
	}
	if (context.plugin.start instanceof RegExp) {
		return source.match(context.plugin.start)?.index ?? -1;
	}
	const result = await context.plugin.start(source, context, options);
	if (typeof result === 'number') return result;
	if (Array.isArray(result)) return result.index ?? -1;
	return -1;
}

async function tokenize<T extends NodeType>(
	source: string,
	type: T,
	plugins: CommonPluginContext<T>[],
	options: Partial<TokenizeOptions>,
) {
	const map = new OrderedPositionMap<CommonPluginContext<T>>(comparePriority);
	const nodes: Node[] = [];
	// 初始化各插件起始位置
	for (const context of plugins) {
		const i = await findStart(context, source, options);
		if (i !== -1) map.add(i, context);
	}
	// 循环直到 map 为空
	let offset = 0;
	let start = 0;
	for (const [index, context] of map.entires()) {
		// 预备下一查找起始位置
		start = (type === 'block' ? source.indexOf('\n', index) : index) + 1;
		// 解析
		const parsed = await context.plugin.parse(
			source.slice(index),
			context,
			options,
		);
		// 重新查找起始位置
		if (!parsed || parsed.raw.length === 0) {
			if (start) {
				const i = await findStart(context, source.slice(start), options);
				if (i === -1) continue;
				map.add(start + i, context);
			}
			continue;
		}
		// 加入未匹配的文本节点
		if (offset < index) nodes.push(new Text(source.slice(offset, index)));
		offset = index + parsed.raw.length;
		start = offset;
		// 转换解析结果并添加节点
		nodes.push(new ParsedNode(context.plugin.name, type, parsed));
		// 重新查找起始位置
		if (start >= source.length) break;
		const rest = source.slice(start);
		const i = await findStart(context, rest, options);
		if (i !== -1) map.add(start + i, context);
		// 重新查找小于结束位置的插件的匹配起始位置
		for (const context of map.takeAllBelow(start)) {
			const i = await findStart(context, rest, options);
			if (i !== -1) map.add(start + i, context);
		}
	}
	// 加入剩余未匹配的文本节点
	if (offset < source.length) nodes.push(new Text(source.slice(offset)));
	return nodes;
}

//#region Walk

type Walker<T extends NodeType> = (
	node: Node,
	map: PluginContextMap,
	type: T,
) => Promise<void>;
/** 遍历并解析、替换节点 */
const walk: <T extends NodeType>(
	node: Node,
	map: PluginContextMap,
	type: T,
) => Promise<void> = stackSafeRecursion((async (
	rec: Walker<NodeType>,
	node: Node,
	map: PluginContextMap,
	type: NodeType,
) => {
	const level = getLevel(type);
	// Pre
	for (const context of map.fetch(type, 0)) {
		await context.plugin.parse(node, context);
	}
	// Children
	const textNodes: WeakRef<Text>[] = [];
	let i = 0;
	while (true) {
		const child = node.child(i);
		if (!child) break;
		if (!(child instanceof Text)) {
			if (getLevel(child) >= level) await rec(child, map, type);
			i++;
			continue;
		}
		// Common
		if (child.maxLevel && getLevel(child) < level) {
			i++;
			continue;
		}
		const order = (child.order ?? 0) + 1;
		const plugins = map.fetch(type, 1)[order - 1];
		if (!plugins) {
			i++;
			continue;
		}
		const nodes = await tokenize(
			child.raw,
			type,
			plugins,
			child.resolveOptions(),
		);
		for (const node of nodes) {
			if (node instanceof Text) {
				node.order = order;
				textNodes.push(new WeakRef(node));
			}
		}
		child.order = order;
		child.after(...nodes);
		child.remove();
	}
	// Post
	for (const context of map.fetch(type, 2)) {
		await context.plugin.parse(node, context);
	}
	// Clean
	for (const ref of textNodes) {
		const node = ref.deref();
		if (!node) continue;
		node.order = undefined;
	}
}) as any) as any;

//#region Main

const PATTERN_EOL = /\r\n?/g;

/** 解析 Markdown 文档 */
export async function parse(
	source: string,
	options: ResolvedOptions,
): Promise<ParseResult> {
	// 预处理
	source = source.replace(PATTERN_EOL, '\n');
	// Frontmatter
	let frontmatter: FrontmatterExtractResult | undefined;
	if (options.frontmatter) {
		frontmatter = await extractFrontmatter(
			source,
			isObject(options.frontmatter) ? options.frontmatter : undefined,
		);
		if (frontmatter) source = source.slice(frontmatter.raw.length);
	}
	// 分词
	const document = new Document(options);
	document.append(new Text(source));
	if (options.maxLevel === 'block') {
		await walk(document, options.context.plugins, 'block');
	}
	await walk(document, options.context.plugins, 'inline');
	// 返回
	return { options, frontmatter, document, context: options.context };
}
