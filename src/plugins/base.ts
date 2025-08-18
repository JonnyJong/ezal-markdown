import { RendererPlugin } from '../types';
import { escapeHTML } from '../utils';

export const text: RendererPlugin<'inline'> = {
	name: 'text',
	type: 'inline',
	render({ raw }, { counter }) {
		counter.count(raw);
		return escapeHTML(raw);
	},
};
