import { type Node, Text } from '../node';
import type { PluginLogger } from '../plugin';
import { normalizeLabel, type RefMap } from '../ref-map';
import type { ASTPlugin } from '../types';
import { escapeMarkdown, isEmpty } from '../utils';
import {
	destinationLengthOf,
	gapLengthOf,
	labelLengthOf,
	nodesToRaw,
	pickNodesHasRaw,
	removeNodesByStringLength,
	titleLengthOf,
} from './emphasis-links';

interface Parsed {
	/** 原始文本 */
	raw: string;
	/** 标签 */
	label: string;
	/** 链接目的地 */
	destination: string;
	/** 链接标题 */
	title?: string;
}

export const PATTERN_LINK_REF_DEFINE_START =
	/(?<=^|^\s*\n|\n\s*\n) {0,3}\[.*?[^ \t\n].*?\]:/s;
const PATTERN_BLANK_LINE = /(?<=\n)[ \t]*($|\n)/;

function findEnd(source: string, offset: number): number {
	let index = source.indexOf('\n', offset);
	if (index === -1) index = source.length;
	else index += 1;
	return isEmpty(source.slice(offset, index)) ? index : 0;
}

function parse(source: string): Parsed | undefined {
	const maxLength = source.match(PATTERN_BLANK_LINE)?.index ?? -1;
	if (maxLength !== -1) source = source.slice(0, maxLength);
	let length = 0;
	// Gap
	length += gapLengthOf(source);
	if (source[length] !== '[') return;
	// Label
	const labelLength = labelLengthOf(source.slice(length));
	if (labelLength === 0) return;
	const label = normalizeLabel(
		source.slice(length + 1, length + labelLength - 1),
	);
	if (!label) return;
	length += labelLength;
	if (source[length] !== ':') return;
	length++;
	// Gap
	length += gapLengthOf(source.slice(length));
	// Destination
	const destinationLength = destinationLengthOf(source.slice(length));
	if (!destinationLength) return;
	let destination = source.slice(length, length + destinationLength);
	if (destination[0] === '<') destination = destination.slice(1, -1);
	destination = encodeURI(decodeURI(escapeMarkdown(destination)));
	length += destinationLength;
	// Extra
	let extraLength = length;
	// Gap
	extraLength += gapLengthOf(source.slice(extraLength));
	if (extraLength === length && source[extraLength]) return;
	// Title
	const titleLength = titleLengthOf(source.slice(extraLength));
	let title: string | undefined;
	if (titleLength) {
		title = escapeMarkdown(
			source.slice(extraLength + 1, extraLength + titleLength - 1),
		);
		extraLength += titleLength;
	}
	// 查找结尾
	let end = findEnd(source, extraLength);
	if (!end) {
		title = undefined;
		end = findEnd(source, length);
	}
	if (!end) return;
	return { raw: source.slice(0, end), label, destination, title };
}

function lookup(source: string): (Parsed & { index: number }) | undefined {
	let i = 0;
	while (i < source.length) {
		const matched = source.slice(i).match(PATTERN_LINK_REF_DEFINE_START);
		if (matched?.index === undefined) return;
		const index = i + matched.index;
		const parsed = parse(source.slice(index));
		if (parsed) return { ...parsed, index };
		i = source.indexOf('\n', i) + 1;
		if (!i) return;
	}
	return;
}

function tokenize(
	node: Node | null,
	refMap: RefMap,
	logger: PluginLogger,
): boolean {
	if (!(node instanceof Text)) return false;
	// 准备
	const source = nodesToRaw([node, ...pickNodesHasRaw(node)]);
	if (!source) return false;
	// 查找
	const parsed = lookup(source);
	if (!parsed) return false;
	// 注册
	if (!refMap.set(parsed.label, parsed)) {
		logger.warn(
			`There are multiple link reference definitions with the label ${parsed.label}`,
		);
	}
	// 切分前部分
	for (let length = parsed.index; length > 0 && node; node = node.next()) {
		// XXX：不应该出现的状况，可能需要更好的决策
		if (node.raw === undefined) continue;
		if (node.raw.length <= length) {
			length -= node.raw.length;
			continue;
		}
		if (node instanceof Text) {
			const nodes = node.splitAt(length);
			node = nodes[1];
			break;
		}
		node.before(new Text(node.raw.slice(0, length)));
		const text = new Text(node.raw.slice(length));
		node.before(text);
		node.remove();
		node = text;
		break;
	}
	if (!(node instanceof Text)) return false;
	// 切分后部分
	removeNodesByStringLength([node, ...pickNodesHasRaw(node)], parsed.raw.length);
	return true;
}

/**
 * 链接引用定义
 * @see https://spec.commonmark.org/0.31.2/#link-reference-definitions
 */
export const linkRefDefine: ASTPlugin<'block', Node> = {
	name: 'link-reference-define',
	type: 'block',
	phase: 'post',
	priority: 1,
	parse(root, { refMap, logger }) {
		Text.normalize(root);
		let checked = false;
		for (const node of root.entires()) {
			if (node instanceof Text) {
				checked = true;
				break;
			}
		}
		if (!checked) return;
		for (let i = 0; ; i++) {
			const node = root.child(i);
			if (!node) break;
			if (!(node instanceof Text)) continue;
			if (tokenize(node, refMap, logger)) i--;
		}
		Text.normalize(root);
	},
	verifyNode: (_): _ is Node => false,
	render: () => '',
};
