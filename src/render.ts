import { Document, Node, ParsedChild, ParsedNode, Text } from './node';
import { Context, ResolvedOptions } from './types';

export interface HTMLRenderResult {
	options: ResolvedOptions;
	root: Node;
	context: Context;
	html: string;
}

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
				options,
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
				options,
			);
			continue;
		}
		throw new Error(`Unknown ${node.type} node call ${node.name}`);
	}
	return { options, root, context: options.context, html: root.html };
}
