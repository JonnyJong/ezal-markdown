import type { MatcherState, SyncExpectationResult } from '@vitest/expect';
import { expect } from 'vitest';
import { Node, NodeType, ParsedNode, Text } from '../src/node';

export type ASTName =
	| 'document'
	| 'item'
	| '#item'
	| '#escape'
	| '#entity-reference'
	| '#decimal-character-reference'
	| '#hexadecimal-character-reference'
	| 'thematic-break'
	| 'atx-heading'
	| 'setext-heading'
	| 'indented-codeblock'
	| 'fenced-codeblock'
	| 'html'
	| 'link-reference-define'
	| 'paragraph'
	| 'table'
	| 'blockquote'
	| 'list'
	| '#code'
	| '#emph'
	| '#strong'
	| '#del'
	| '#link'
	| '#image'
	| '#autolink'
	| '#html'
	| '#linebreak'
	| '#softbreak'
	| (string & {});
/**
 * ASTLike 节点
 * @description
 * 若名称以 `?`，表示行内、块节点皆可；
 * 若名称以 `#`，表示行内节点；
 * 其他情况，表示块节点；
 */
export type ASTLikeNode = ASTLike | string;
export type ASTLikeNodeSelf = ASTName | [ASTName, attr: Record<string, any>];
export type ASTLike = [ASTLikeNodeSelf, ...nodes: ASTLikeNode[]];
type NodeCheckResult = Set<'name-type' | 'attr' | 'too-much'>;

interface ASTMatcher<R = unknown> {
	toLikeAst: (ast: ASTLikeNode) => R;
}

declare module 'vitest' {
	interface Matchers<T = any> extends ASTMatcher<T> {}
}

function parseName(self: ASTLikeNodeSelf): [name: string, type?: NodeType] {
	const name = typeof self === 'string' ? self : self[0];
	if (name.startsWith('#')) return [name.slice(1), 'inline'];
	if (name.startsWith('?')) return [name.slice(1), undefined];
	return [name, 'block'];
}

function pick(obj: Record<string, any>, keys: string[]): Record<string, any> {
	const result: Record<string, any> = {};
	for (const key of keys) {
		result[key] = obj[key];
	}
	return result;
}

function getAttr(
	node: Node,
	expected: Record<string, any>,
): Record<string, any> {
	const keys = Object.keys(expected);
	const data = pick(node instanceof ParsedNode ? node.data : node, keys);
	if (keys.includes('raw')) data.raw = node.raw;
	return data;
}

function checkNode(
	node: Node,
	expected: ASTLikeNode | undefined,
	equals: MatcherState['equals'],
): NodeCheckResult {
	const result: NodeCheckResult = new Set();
	if (expected === undefined) {
		result.add('too-much');
		return result;
	}
	// Text
	if (typeof expected === 'string') {
		if (!(node instanceof Text) || node.raw !== expected) {
			result.add('name-type');
		}
		return result;
	}
	// Name & Type
	const [name, type] = parseName(expected[0]);
	if (name !== node.name || (type && type !== node.type)) {
		result.add('name-type');
	}
	// Attr
	if (!Array.isArray(expected[0])) return result;
	if (!equals(getAttr(node, expected[0][1]), expected[0][1])) result.add('attr');
	return result;
}

function getNodeSelf(
	node: Node,
	expected: ASTLikeNodeSelf | undefined,
	checked: NodeCheckResult,
): ASTLikeNodeSelf {
	if (!checked.size && expected !== undefined) return expected;
	if (!Array.isArray(expected)) {
		return (node.type === 'inline' ? '#' : '') + node.name;
	}
	return [
		checked.has('name-type')
			? (node.type === 'inline' ? '#' : '') + node.name
			: expected[0],
		checked.has('attr') ? getAttr(node, expected[1]) : expected[1],
	];
}

function entiresExpected(expected?: ASTLikeNode): ArrayIterator<ASTLikeNode> {
	if (typeof expected === 'string' || expected === undefined) return [].values();
	return (expected.slice(1) as ASTLikeNode[]).values();
}

function match(
	root: Node,
	expected: ASTLikeNode,
	equals: MatcherState['equals'],
): ASTLikeNode | undefined {
	let diff = false;
	// Root
	const checked = checkNode(root, expected, equals);
	if (checked.size) diff = true;
	if (root instanceof Text) return diff ? root.raw : undefined;
	const result: ASTLike = [getNodeSelf(root, expected[0], checked)];
	// Children
	const stack: [
		output: ASTLike,
		childrenIter: Generator<Node, void, void>,
		expectedIter: ArrayIterator<ASTLikeNode>,
	][] = [[result, root.entires(), entiresExpected(expected)]];
	while (true) {
		// End
		const task = stack.at(-1);
		if (!task) break;
		// Next
		const [output, children, expectedIter] = task;
		const expected: ASTLikeNode | undefined = expectedIter.next().value;
		const child = children.next().value;
		// Pop
		if (expected === undefined && child === undefined) {
			stack.pop();
			continue;
		}
		// Too little
		if (!child) {
			diff = true;
			stack.pop();
			continue;
		}
		// Check
		const checked = checkNode(child, expected, equals);
		if (checked.size) diff = true;
		// Push
		if (child instanceof Text) {
			output.push(child.raw);
			continue;
		}
		const next: ASTLike = [getNodeSelf(child, expected?.[0], checked)];
		output.push(next);
		stack.push([next, child.entires(), entiresExpected(expected)]);
	}
	return diff ? result : undefined;
}

export function initAstMatcher() {
	expect.extend({
		toLikeAst(
			this: MatcherState,
			received: unknown,
			...expected: ASTLikeNode[]
		): SyncExpectationResult {
			if (!(received instanceof Node))
				return { pass: false, message: () => 'Expect instanceof Node' };
			const result = match(received, expected[0], this.equals);
			if (!result) return { pass: true, message: () => '' };
			return {
				pass: false,
				message: () => 'Mismatch',
				actual: result,
				expected: expected[0],
			};
		},
	});
}
