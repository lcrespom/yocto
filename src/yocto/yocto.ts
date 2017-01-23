import vdom from 'snabbdom/snabbdom.bundle';
const { patch: render } = vdom;
import { VNode } from 'snabbdom/src/vnode';
export { VNode } from 'snabbdom/src/vnode';
import { tagHelpers } from './tag-helpers';
export const H = tagHelpers;
let global = window as any;


// -------------------- Application entry point --------------------

export type Dispatcher<A> = (action: A) => void;
export type ModelInit<M> = (props?: any) => M;
export type Updater<M, A> = (model: M, action: A, onEvent?: ParentDispatch) => M;
export type Renderer<M, A> = (model: M, dispatch: Dispatcher<A>) => VNode;
export type ParentDispatch = (evt: any) => any;

export interface Component<M, A> {
	init: ModelInit<M>;
	view: Renderer<M, A>;
	update: Updater<M, A>;
}

function runNext(f: Function) {
	setTimeout(f(), 0);
}

export function runComponent<M, A>(component: Component<M, A>,
	domNode: HTMLElement, props: any = {}, debug: string = ''): Dispatcher<A> {
	let vnode = domNode;
	let model = component.init(props);
	let dispatch = (action) => runNext(_ => {
		if (action.type == '__debug') {
			model = action.model;
		}
		else {
			model = component.update(model, action);
			if (debug)
				global.yocto.debug[debug]._push(model);
		}
		vnode = render(vnode, component.view(model, dispatch));
	});
	vnode = render(vnode, component.view(model, dispatch));
	if (debug)
		prepareDebug(debug, model, dispatch);
	return dispatch;
}


// -------------------- Debug support  --------------------

function prepareDebug<M, A>(key: string, initialModel: M, dispatch: Dispatcher<A>) {
	global.yocto = global.yocto || { debug: {} };
	global.yocto.debug[key] = new YoctoDebugger<M, A>(dispatch);
	global.yocto.debug[key]._push(initialModel);
}

class YoctoDebugger<M, A> {
	models: M[] = [];
	pos = 0;

	constructor(private dispatch: Dispatcher<A>) {}

	_push(model: M) {
		this.models.push(model);
		this.pos = this.models.length - 1;
	}

	_setModel() {
		this.dispatch({ type: '__debug', model: this.models[this.pos]} as any);
	}

	back(steps = 1) {
		if (this.pos - steps < 0)
			throw Error('Beyond initial state');
		this.pos -= steps;
		this._setModel();
	}

	forward(steps = 1) {
		if (this.pos + steps >= this.models.length)
			throw Error('Beyond final state');
		this.pos += steps;
		this._setModel();
	}
}
