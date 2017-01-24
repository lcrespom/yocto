import { runComponent, H, VNode, Dispatcher } from './yocto/yocto';
import { FormModel, FormAction, FormComponent } from './form-cmp';
import { viewCrudTable } from './crud-table-view';
import * as R from 'ramda';


interface SearchQuery {
	fromDate: Date;
	toDate: Date;
}

interface Transaction {
	amount: number;
}

interface AppModel {
	name: string;
	form: FormModel;
	query: SearchQuery;
	txns: Transaction[];
}

type AppAction = NameAction | FormAction;

type NameAction = {
	type: 'name';
	name: string;
};

type AppDispatcher = Dispatcher<AppAction>;


function init(props): AppModel {
	return {
		name: '',
		form: FormComponent.init({
			fields: ['fromDate', 'toDate'],
			labels: ['From date', 'To date'],
			formData: { fromDate: new Date(), toDate: new Date() },
			attrs: {
				fromDate: { type: 'date' },
				toDate: { type: 'date' }
			},
			submitLabel: 'Search',
			submitIcon: 'search',
			hideCancel: true
		}),
		query: { fromDate: new Date(), toDate: new Date },
		txns: []
	};
}


function view(model: AppModel, dispatch: AppDispatcher): VNode {
	const ucfirst = str => str.charAt(0).toUpperCase() + str.slice(1);
	const TABLE_FIELDS = ['date', 'description', 'amount', 'balance'];
	let tableData = {
		items: model.txns,
		fields: TABLE_FIELDS,
		labels: R.map(ucfirst, TABLE_FIELDS)
	};
	let buttons = [];
	return H.div([
		H.h1('Transactions'),
		FormComponent.view(model.form, dispatch),
		H.hr(),
		viewCrudTable(tableData, buttons)
	]);
}


function update(model: AppModel, action: AppAction): AppModel {
	const newModel = R.merge(model);
	switch (action.type) {
		case 'name':
			return newModel({ name: action.name });
		case 'form.submit':
			console.log('Submit action:', action);
			return model;
		default:
			return newModel({ form: FormComponent.update(model.form, action) });
	}
}


let bankApp = {
	init,
	view,
	update
};

function main() {
	let element = document.getElementById('app');
	if (!element)
		throw Error('No "#app" element');
	runComponent(bankApp, element, {}, 'txns');
}

main();
