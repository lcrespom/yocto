import vdom from 'snabbdom/snabbdom.bundle';
const { patch: render, h } = vdom;
import { VNode } from 'snabbdom/src/vnode';
export { VNode } from 'snabbdom/src/vnode';
import { tagHelpers } from './tag-helpers';
export const H = tagHelpers;
let global = window as any;


// -------------------- Application entry point --------------------

export type Dispatcher<M, A> = (action: A, newModel?: M) => void;
export type ModelInit<M> = (props?: any) => M;
export type Updater<M, A> = (model: M, action: A, onEvent?: ParentDispatch) => M;
export type Renderer<M, A> = (model: M, dispatch: Dispatcher<M, A>) => VNode;
export type ParentDispatch = (evt: any) => any;

export interface Component<M, A> {
	init: ModelInit<M>;
	view: Renderer<M, A>;
	update: Updater<M, A>;
}


export function runComponent<M, A>(component: Component<M, A>,
	domNode: HTMLElement, props: any = {}, debug: string = ''): Dispatcher<M, A> {
	let vnode = domNode;
	let model = component.init(props);
	let dispatch = (action: A, newModel?: M) => {
		model = newModel || component.update(model, action);
		if (debug && !newModel)
			global.yocto.debug[debug].push(model);
		vnode = render(vnode, component.view(model, dispatch));
	};
	vnode = render(vnode, component.view(model, dispatch));
	if (debug)
		prepareDebug(debug, model, dispatch);
	return dispatch;
}



// -------------------- Debug support  --------------------

function prepareDebug<M, A>(key: string, initialModel: M, dispatch: Dispatcher<M, A>) {
	global.yocto = global.yocto || { debug: {} };
	global.yocto.debug[key] = new YoctoDebugger<M, A>(dispatch);
	global.yocto.debug[key].push(initialModel);
}

class YoctoDebugger<M, A> {
	models: M[] = [];
	pos = 0;

	constructor(private dispatch: Dispatcher<M, A>) {}

	push(model: M) {
		this.models.push(model);
		this.pos = this.models.length - 1;
	}

	back(steps = 1) {
		if (this.pos - steps < 0)
			throw Error('Beyond initial state');
		this.pos -= steps;
		this.dispatch({} as A, this.models[this.pos]);
	}

	forward(steps = 1) {
		if (this.pos + steps >= this.models.length)
			throw Error('Beyond final state');
		this.pos += steps;
		this.dispatch({} as A, this.models[this.pos]);
	}
}
