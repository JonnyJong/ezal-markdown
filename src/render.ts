import { Document, type Node, ParsedChild, ParsedNode, Text } from './node';
import type { Context, ResolvedOptions } from './types';

export interface HTMLRenderResult {
	/** 选项 */
	options: ResolvedOptions;
	/** 根节点 */
	root: Node;
	/** 上下文 */
	context: Context;
	/** HTML 渲染结果 */
	html: string;
}

/** 后序遍历 */
function* postOrderTraversal(root: Node): Generator<Node, void, void> {
	let node: Node | null = root;
	while (node) {
		// Child
		const child: Node | null = node.child(0);
		if (child) {
			node = child;
			continue;
		}
		// Current
		yield node;
		if (node === root) return;
		// Next
		const next = node.next();
		if (next) {
			node = next;
			continue;
		}
		// Parent
		while (true) {
			if (node === root) return;
			const parent: Node | null = node.parent;
			if (!parent) return;
			yield parent;
			// Parent Next
			const next: Node | null = parent.next();
			if (next) {
				node = next;
				break;
			}
			node = parent;
		}
	}
}

function errInfo(node: Node) {
	return `Could not fount renderer/common plugin for ${node.type} node call ${node.name}`;
}

/**
 * 渲染为 HTML
 * @param root 渲染根节点
 * @param options 选项
 */
export async function renderHTML(
	root: Node,
	options: ResolvedOptions,
): Promise<HTMLRenderResult> {
	const plugins = options.context.plugins;
	const textRenderer = plugins.get('inline', 'text');
	EACH_NODE: for (const node of postOrderTraversal(root)) {
		if (node instanceof Document || node instanceof ParsedChild) {
			node.html = [...node.entires()].map((node) => node.html).join('');
			continue;
		}
		if (node instanceof ParsedNode) {
			const context = plugins.get(node.type, node.name);
			if (!context) throw new Error(errInfo(node));
			node.html = await context.plugin.render(
				{ ...node.data, raw: node.raw, children: node.children },
				context,
				node.resolveOptions(),
			);
			continue;
		}
		for (const context of plugins.entiresAst(node.type)) {
			if (!context.plugin.verifyNode(node, context)) continue;
			node.html = await context.plugin.render(node, context);
			continue EACH_NODE;
		}
		if (node instanceof Text) {
			if (!textRenderer) {
				throw new Error(errInfo(node));
			}
			node.html = await textRenderer.plugin.render(
				{ raw: node.raw },
				textRenderer,
				node.resolveOptions(),
			);
			continue;
		}
		throw new Error(`Unknown ${node.type} node call ${node.name}`);
	}
	return { options, root, context: options.context, html: root.html };
}
