import { Node, ParsedChild, ParsedNode, Text } from '../node';
import { ASTPlugin } from '../types';
import { $, isEmpty } from '../utils';

/** 段落节点 */
export class Paragraph extends Node {
	constructor(nodes: Node[]) {
		super('paragraph', 'block');
		this.append(...nodes);
		let raw = '';
		for (const node of nodes) {
			if (node.raw === undefined) return;
			raw += node.raw;
		}
		this.raw = raw;
	}
}

/** @see https://spec.commonmark.org/0.31.2/#paragraphs */
const PATTERN_BLANK_LINES = /(^|\n)[ \t\n]*(\n|$)/;
const PATTERN_TAILING_WHITESPACES = /\n[ \t]*$/;
const PATTERN_PREFIX_WHITESPACES = /^[ \t]*/;
const PATTERN_LEADING_WHITESPACES = /(?<=\n)[ \t]*/g;

function parse(root: Node) {
	for (let i = 0; ; i++) {
		// 查找段落起点
		const child = root.child(i);
		if (!child) return;
		if (child.type === 'block') continue;
		// 查找段落元素
		const nodes: Node[] = [];
		for (let j = i; ; j++) {
			const child = root.child(j);
			if (!child) break;
			if (child.type === 'block') continue;
			if (!(child instanceof Text)) {
				nodes.push(child);
				continue;
			}
			// 检查空行
			const matched = child.raw.match(PATTERN_BLANK_LINES);
			if (matched?.index === undefined) {
				nodes.push(child);
				continue;
			}
			const texts = child.splitAt(
				matched.index,
				matched.index + matched[0].length,
			);
			if (matched.index) {
				nodes.push(texts[0]);
				texts[1].remove();
			} else {
				texts[0].remove();
				j--;
			}
			if (nodes.length) break;
		}
		// 生成段落
		if (!nodes.length) continue;
		const node = new Paragraph(nodes);
		root.insert(i, node);
		// 正则化
		Text.normalize(node, {
			trimStart: true,
			trimEnd: true,
			trimEndBeforeBlock: true,
		});
		// 移除每一行前导空格
		let canRemoveLeadingWhitespaces = true;
		for (let i = 0; ; i++) {
			const child = node.child(i);
			if (!child) break;
			// 文本节点
			if (child instanceof Text) {
				if (canRemoveLeadingWhitespaces) {
					child.raw = child.raw.replace(PATTERN_PREFIX_WHITESPACES, '');
					canRemoveLeadingWhitespaces = false;
				}
				child.raw = child.raw.replace(PATTERN_LEADING_WHITESPACES, '');
			}
			// 预备下一个文本节点
			if (!child.raw) continue;
			if (!isEmpty(child.raw)) canRemoveLeadingWhitespaces = false;
			if (PATTERN_TAILING_WHITESPACES.test(child.raw))
				canRemoveLeadingWhitespaces = true;
		}
	}
}

/**
 * 段落
 * @see https://spec.commonmark.org/0.31.2/#paragraphs
 */
export const paragraph: ASTPlugin<'block', Paragraph> = {
	name: 'paragraph',
	type: 'block',
	phase: 'post',
	priority: 0,
	parse(root) {
		if (root instanceof ParsedNode) {
			for (const node of root.entires()) {
				if (node.type === 'inline') continue;
				if (node.maxLevel === 'inline') continue;
				if (node.skipParagraphWrapping) continue;
				parse(node);
			}
			return;
		}
		if (root instanceof ParsedChild) return;
		if (root.skipParagraphWrapping) return;
		parse(root);
	},
	verifyNode(node) {
		return node instanceof Paragraph;
	},
	render(node) {
		return $('p', [...node.entires().map((node) => node.html)]);
	},
};
