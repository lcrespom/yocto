import { runComponent, H, VNode, Dispatcher } from './yocto/yocto';
import * as R from 'ramda';


interface SearchQuery {
	fromDate: Date;
	toDate: Date;
}

interface Transaction {
	amount: number;
}

interface AppModel {
	name: string;	//Testing only
	query: SearchQuery;
	txns: Transaction[];
}

type AppAction = any;

let postAction: Dispatcher<AppModel, AppAction>;


function init(props): AppModel {
	return {
		name: '',
		query: { fromDate: new Date(), toDate: new Date },
		txns: []
	};
}

function view(model: AppModel): VNode {
	return H.div([
		H.h1('Transactions'),
		'What is your name? ',
		H.input({ on: {
			input: evt => postAction({ type: 'name', name: evt.target.value })
		}}),
		H.br(),
		H.span('Hello ' + model.name),
	]);
}

function update(model: AppModel, action: AppAction): AppModel {
	const newModel = R.merge(model);
	switch (action.type) {
		case 'name':
			return newModel({ name: action.name })
		default:
			return model;
	}
}

let bankApp = {
	init,
	view,
	update
}

function main() {
	let element = document.getElementById('app');
	if (!element)
		throw Error('No "#app" element');
	postAction = runComponent(bankApp, element);
}


main();
