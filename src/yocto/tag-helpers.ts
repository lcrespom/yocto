import { VNode, VNodeData } from 'snabbdom/src/vnode';
import { h } from 'snabbdom';

type ChildNodes = (string | VNode)[];
type VNodeFactory = (
		sel_data_text_children?: VNodeData | string | ChildNodes,
		data_text_children?: VNodeData | string | ChildNodes,
		text_children?: string | ChildNodes
	) => VNode;


function isValidString(param: any): boolean {
	return typeof param === 'string' && param.length > 0;
}

function isSelector(param: any): boolean {
	return isValidString(param) && (param[0] === '.' || param[0] === '#');
}

function createTagFunction(tagName: string): VNodeFactory {
	return function hyperscript(first: any, b?: any, c?: any): VNode {
		if (isSelector(first)) {
			if (typeof b !== 'undefined' && typeof c !== 'undefined') {
				return h(tagName + first, b, c);
			} else if (typeof b !== 'undefined') {
				return h(tagName + first, b);
			} else {
				return h(tagName + first, {});
			}
		} else if (!!b) {
			return h(tagName, first, b);
		} else if (!!first) {
			return h(tagName, first);
		} else {
			return h(tagName, {});
		}
	};
}

export const tagHelpers = {
	a: createTagFunction('a'),
	abbr: createTagFunction('abbr'),
	address: createTagFunction('address'),
	area: createTagFunction('area'),
	article: createTagFunction('article'),
	aside: createTagFunction('aside'),
	audio: createTagFunction('audio'),
	b: createTagFunction('b'),
	base: createTagFunction('base'),
	bdi: createTagFunction('bdi'),
	bdo: createTagFunction('bdo'),
	blockquote: createTagFunction('blockquote'),
	body: createTagFunction('body'),
	br: createTagFunction('br'),
	button: createTagFunction('button'),
	canvas: createTagFunction('canvas'),
	caption: createTagFunction('caption'),
	cite: createTagFunction('cite'),
	code: createTagFunction('code'),
	col: createTagFunction('col'),
	colgroup: createTagFunction('colgroup'),
	dd: createTagFunction('dd'),
	del: createTagFunction('del'),
	dfn: createTagFunction('dfn'),
	dir: createTagFunction('dir'),
	div: createTagFunction('div'),
	dl: createTagFunction('dl'),
	dt: createTagFunction('dt'),
	em: createTagFunction('em'),
	embed: createTagFunction('embed'),
	fieldset: createTagFunction('fieldset'),
	figcaption: createTagFunction('figcaption'),
	figure: createTagFunction('figure'),
	footer: createTagFunction('footer'),
	form: createTagFunction('form'),
	h1: createTagFunction('h1'),
	h2: createTagFunction('h2'),
	h3: createTagFunction('h3'),
	h4: createTagFunction('h4'),
	h5: createTagFunction('h5'),
	h6: createTagFunction('h6'),
	head: createTagFunction('head'),
	header: createTagFunction('header'),
	hgroup: createTagFunction('hgroup'),
	hr: createTagFunction('hr'),
	html: createTagFunction('html'),
	i: createTagFunction('i'),
	iframe: createTagFunction('iframe'),
	img: createTagFunction('img'),
	input: createTagFunction('input'),
	ins: createTagFunction('ins'),
	kbd: createTagFunction('kbd'),
	keygen: createTagFunction('keygen'),
	label: createTagFunction('label'),
	legend: createTagFunction('legend'),
	li: createTagFunction('li'),
	link: createTagFunction('link'),
	main: createTagFunction('main'),
	map: createTagFunction('map'),
	mark: createTagFunction('mark'),
	menu: createTagFunction('menu'),
	meta: createTagFunction('meta'),
	nav: createTagFunction('nav'),
	noscript: createTagFunction('noscript'),
	object: createTagFunction('object'),
	ol: createTagFunction('ol'),
	optgroup: createTagFunction('optgroup'),
	option: createTagFunction('option'),
	p: createTagFunction('p'),
	param: createTagFunction('param'),
	pre: createTagFunction('pre'),
	progress: createTagFunction('progress'),
	q: createTagFunction('q'),
	rp: createTagFunction('rp'),
	rt: createTagFunction('rt'),
	ruby: createTagFunction('ruby'),
	s: createTagFunction('s'),
	samp: createTagFunction('samp'),
	script: createTagFunction('script'),
	section: createTagFunction('section'),
	select: createTagFunction('select'),
	small: createTagFunction('small'),
	source: createTagFunction('source'),
	span: createTagFunction('span'),
	strong: createTagFunction('strong'),
	style: createTagFunction('style'),
	sub: createTagFunction('sub'),
	sup: createTagFunction('sup'),
	table: createTagFunction('table'),
	tbody: createTagFunction('tbody'),
	td: createTagFunction('td'),
	textarea: createTagFunction('textarea'),
	tfoot: createTagFunction('tfoot'),
	th: createTagFunction('th'),
	thead: createTagFunction('thead'),
	title: createTagFunction('title'),
	tr: createTagFunction('tr'),
	u: createTagFunction('u'),
	ul: createTagFunction('ul'),
	video: createTagFunction('video')
};

export default tagHelpers;
