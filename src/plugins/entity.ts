import { decodeHTML5Strict } from 'entities';
import type { CommonPlugin, Parsed } from '../types';
import { escapeHTML } from '../utils';

export interface CharReferenceParsed extends Parsed {
	/** 字符 */
	char: string;
	/** 有效性 */
	valid: boolean;
}

const PATTERN_ENTITY = /&[A-Za-z][A-Za-z0-9]*;/;

/**
 * 实体引用
 * @see https://spec.commonmark.org/0.31.2/#entity-references
 */
export const entityReference: CommonPlugin<'inline', CharReferenceParsed> = {
	name: 'entity-reference',
	type: 'inline',
	order: 0,
	priority: 0,
	start: PATTERN_ENTITY,
	parse(source) {
		const raw = source.match(PATTERN_ENTITY)?.[0];
		if (!raw) return;
		const char = decodeHTML5Strict(raw);
		if (char === raw) return;
		return { raw, char, valid: true };
	},
	render({ char }) {
		return escapeHTML(char);
	},
};

function parseCodePoint(code: number): [char: string, valid: boolean] {
	if (!code) return ['\uFFFD', false];
	try {
		return [String.fromCodePoint(code), true];
	} catch {
		return ['\uFFFD', false];
	}
}

const PATTERN_DEC = /&#[0-9]{1,7};/;

/**
 * 十进制字符引用
 * @see https://spec.commonmark.org/0.31.2/#decimal-numeric-character-references
 */
export const decimalCharReference: CommonPlugin<'inline', CharReferenceParsed> =
	{
		name: 'decimal-character-reference',
		type: 'inline',
		order: 0,
		priority: 0,
		start: PATTERN_DEC,
		parse(source) {
			const raw = source.match(PATTERN_DEC)?.[0];
			if (!raw) return;
			const codePoint = parseInt(raw.slice(2, -1), 10);
			const [char, valid] = parseCodePoint(codePoint);
			return { raw, char, valid };
		},
		render({ char }) {
			return escapeHTML(char);
		},
	};

const PATTERN_HEX = /&#[Xx][A-Za-z0-9]{1,6};/;

/**
 * 十六进制字符引用
 * @see https://spec.commonmark.org/0.31.2/#hexadecimal-numeric-character-references
 */
export const hexadecimalCharReference: CommonPlugin<
	'inline',
	CharReferenceParsed
> = {
	name: 'hexadecimal-character-reference',
	type: 'inline',
	order: 0,
	priority: 0,
	start: PATTERN_HEX,
	parse(source) {
		const raw = source.match(PATTERN_HEX)?.[0];
		if (!raw) return;
		const codePoint = parseInt(raw.slice(3, -1), 16);
		const [char, valid] = parseCodePoint(codePoint);
		return { raw, char, valid };
	},
	render({ char }) {
		return escapeHTML(char);
	},
};
