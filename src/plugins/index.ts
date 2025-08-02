import { base } from './base';
import { blockquote } from './blockquote';
import { code, codeblock } from './code';
import { footnote } from './footnote';
import { heading } from './heading';
import { hr } from './hr';
import { html } from './html';
import {
	imageBlock,
	imageBlockRef,
	imageInline,
	imageInlineRef,
} from './image';
import { link } from './link';
import { orderedList, taskList, unorderedList } from './list';
import { table } from './table';
import { tex } from './tex';
import { bold, boldItalic, del, italic } from './text';

export const plugins = {
	base,
	bold,
	italic,
	boldItalic,
	del,
	code,
	imageInline,
	imageInlineRef,
	link,
	heading,
	blockquote,
	hr,
	imageBlock,
	imageBlockRef,
	orderedList,
	unorderedList,
	taskList,
	table,
	codeblock,
	footnote,
	tex,
	html,
};
