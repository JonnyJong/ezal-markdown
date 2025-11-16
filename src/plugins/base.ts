import type { RendererPlugin } from '../types';
import { escapeHTML } from '../utils';

/**
 * Text 节点渲染器
 * @see https://spec.commonmark.org/0.31.2/#blank-lines
 */
export const text: RendererPlugin<'inline'> = {
	name: 'text',
	type: 'inline',
	render({ raw }, { counter }) {
		counter.count(raw);
		return escapeHTML(raw);
	},
};
