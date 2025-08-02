import {
	AtomicParseResult,
	Plugin,
	PluginContext,
	TypeToParseResult,
} from './plugin';
import { RenderContext } from './render';
import {
	AtomicNode,
	BaseNode,
	BlockNode,
	InlineNode,
	Node,
	NodeType,
} from './token';
import { Children, PromiseOr, mapChildren } from './utils';

function createPluginContextGetter(context: RenderContext) {
	return <T extends NodeType>(
		token: Node & { type: T },
	): PluginContext<unknown, Plugin<T, TypeToParseResult<T>, unknown>> => {
		const ctx = context.plugins.get(token.type, token.name);
		if (ctx) return ctx;
		throw new Error(
			`No plugin found for ${token.type} node with name '${token.name}'`,
		);
	};
}

function parsedChildValidator(value: unknown): value is Node[] {
	if (!Array.isArray(value)) return false;
	return value.every((v) => v instanceof BaseNode);
}

function transformAtomic(
	context: PluginContext<unknown, Plugin<'atomic', AtomicParseResult, unknown>>,
	token: AtomicNode,
): PromiseOr<string> {
	return context.plugin.render({ ...token.data, raw: token.raw }, context);
}

async function transformInlineAndBlock(
	token: InlineNode | BlockNode,
	context: RenderContext,
): Promise<string> {
	const ctx = context.plugins.get(token.type, token.name);
	if (!ctx) {
		throw new Error(
			`No plugin found for ${token.type} node with name '${token.name}'`,
		);
	}
	const children = token.children
		? await mapChildren(
				token.children as Children<Node[]>,
				parsedChildValidator,
				(tokens): Promise<string> => transform(tokens, context),
			)
		: undefined;
	return ctx.plugin.render(
		{ ...token.data, raw: token.raw, children } as any,
		ctx,
	);
}

export async function transform(
	tokens: Node[],
	context: RenderContext,
): Promise<string> {
	const ctx = createPluginContextGetter(context);
	const result: string[] = [];
	for (const token of tokens) {
		switch (token.type) {
			case 'atomic':
				result.push(await transformAtomic(ctx(token), token));
				break;
			case 'inline':
			case 'block':
				result.push(await transformInlineAndBlock(token, context));
				break;
			default:
				throw new Error(`Unknown node type encountered: '${(token as Node).type}'`);
		}
	}
	return result.join('');
}
